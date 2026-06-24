import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../types';

// Helper to generate a unique 8-character invite code
const generateInviteCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const createWorkspace = async (req: AuthRequest, res: Response) => {
  try {
    const { name, problemUrl, problemPlatform, invitedFriends } = req.body;
    const userId = parseInt(req.user!.id, 10);

    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Workspace name is required' });
    }

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID in request context' });
    }

    // Get current user details for notifications
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode();
    let codeExists = await prisma.workspace.findUnique({ where: { inviteCode } });
    while (codeExists) {
      inviteCode = generateInviteCode();
      codeExists = await prisma.workspace.findUnique({ where: { inviteCode } });
    }

    // Create Workspace inside a transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create the Workspace
      const workspace = await tx.workspace.create({
        data: {
          name: name.trim(),
          ownerId: userId,
          inviteCode,
          problemUrl: problemUrl ? problemUrl.trim() : null,
          problemPlatform: problemPlatform ? problemPlatform.trim() : null,
        },
      });

      // 2. Create Owner Workspace Member
      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId,
          role: 'Owner',
        },
      });

      // 3. Create Default Public Sheet
      const defaultSheet = await tx.sheet.create({
        data: {
          workspaceId: workspace.id,
          name: 'shared',
          isPublic: true,
        },
      });

      // 4. Create invite notifications if friends are specified
      if (invitedFriends && Array.isArray(invitedFriends) && invitedFriends.length > 0) {
        const notificationsData = invitedFriends.map((friendId: any) => {
          const parsedFriendId = parseInt(friendId, 10);
          if (isNaN(parsedFriendId)) return null;

          return {
            userId: parsedFriendId,
            type: 'WORKSPACE_INVITE',
            title: 'Workspace Invitation',
            content: `${currentUser.name} invited you to join the workspace "${workspace.name}".`,
            link: `/workspace/join?code=${inviteCode}`,
          };
        }).filter(Boolean) as any[];

        if (notificationsData.length > 0) {
          await tx.notification.createMany({
            data: notificationsData,
          });
        }
      }

      return { workspace, defaultSheet };
    });

    return res.status(201).json({
      message: 'Workspace created successfully',
      workspace: {
        id: String(result.workspace.id),
        name: result.workspace.name,
        inviteCode: result.workspace.inviteCode,
        problemUrl: result.workspace.problemUrl,
        problemPlatform: result.workspace.problemPlatform,
        createdAt: result.workspace.createdAt,
      },
      defaultSheetId: String(result.defaultSheet.id),
    });
  } catch (error) {
    console.error('Create workspace error:', error);
    return res.status(500).json({ message: 'Server error during workspace creation' });
  }
};

export const getWorkspaces = async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.user!.id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Get workspaces where user is a member
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId },
      include: {
        workspace: {
          include: {
            owner: {
              select: { id: true, name: true, email: true, avatar: true },
            },
            members: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
          },
        },
      },
      orderBy: {
        joinedAt: 'desc',
      },
    });

    const workspaces = memberships.map((m) => {
      const w = m.workspace;
      return {
        id: String(w.id),
        name: w.name,
        inviteCode: w.inviteCode,
        problemUrl: w.problemUrl,
        problemPlatform: w.problemPlatform,
        createdAt: w.createdAt,
        owner: {
          id: String(w.owner.id),
          name: w.owner.name,
          email: w.owner.email,
          avatar: w.owner.avatar,
        },
        membersCount: w.members.length,
        myRole: m.role,
      };
    });

    return res.json({ workspaces });
  } catch (error) {
    console.error('Get workspaces error:', error);
    return res.status(500).json({ message: 'Server error fetching workspaces' });
  }
};

export const getWorkspaceById = async (req: AuthRequest, res: Response) => {
  try {
    const workspaceId = parseInt(req.params.id, 10);
    const userId = parseInt(req.user!.id, 10);

    if (isNaN(workspaceId) || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid workspace or user ID' });
    }

    // Check membership
    const membership = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId,
        },
      },
    });

    if (!membership) {
      return res.status(403).json({ message: 'Access denied: You are not a member of this workspace' });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        owner: {
          select: { id: true, name: true, email: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true },
            },
          },
        },
        sheets: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    return res.json({
      workspace: {
        id: String(workspace.id),
        name: workspace.name,
        inviteCode: workspace.inviteCode,
        problemUrl: workspace.problemUrl,
        problemPlatform: workspace.problemPlatform,
        createdAt: workspace.createdAt,
        owner: {
          id: String(workspace.owner.id),
          name: workspace.owner.name,
          email: workspace.owner.email,
          avatar: workspace.owner.avatar,
        },
        members: workspace.members.map((m) => ({
          id: String(m.id),
          role: m.role,
          user: {
            id: String(m.user.id),
            name: m.user.name,
            email: m.user.email,
            avatar: m.user.avatar,
          },
        })),
        sheets: workspace.sheets.map((s) => ({
          id: String(s.id),
          name: s.name,
          isPublic: s.isPublic,
        })),
        myRole: membership.role,
      },
    });
  } catch (error) {
    console.error('Get workspace by ID error:', error);
    return res.status(500).json({ message: 'Server error fetching workspace' });
  }
};

export const joinWorkspaceByCode = async (req: AuthRequest, res: Response) => {
  try {
    const { inviteCode } = req.body;
    const userId = parseInt(req.user!.id, 10);

    if (!inviteCode || inviteCode.trim() === '') {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    if (isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace with this invite code not found' });
    }

    // Check if already a member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId: workspace.id,
          userId,
        },
      },
    });

    if (existingMember) {
      return res.status(200).json({
        message: 'You are already a member of this workspace',
        workspaceId: String(workspace.id),
      });
    }

    // Add as member (default role = 'Editor')
    await prisma.workspaceMember.create({
      data: {
        workspaceId: workspace.id,
        userId,
        role: 'Editor',
      },
    });

    return res.status(200).json({
      message: 'Joined workspace successfully',
      workspaceId: String(workspace.id),
    });
  } catch (error) {
    console.error('Join workspace error:', error);
    return res.status(500).json({ message: 'Server error joining workspace' });
  }
};

export const getWorkspaceByInviteCode = async (req: AuthRequest, res: Response) => {
  try {
    const { inviteCode } = req.params;

    if (!inviteCode) {
      return res.status(400).json({ message: 'Invite code is required' });
    }

    const workspace = await prisma.workspace.findUnique({
      where: { inviteCode: inviteCode.trim().toUpperCase() },
      include: {
        owner: {
          select: { name: true, avatar: true },
        },
      },
    });

    if (!workspace) {
      return res.status(404).json({ message: 'Workspace not found' });
    }

    return res.json({
      workspace: {
        id: String(workspace.id),
        name: workspace.name,
        ownerName: workspace.owner.name,
        ownerAvatar: workspace.owner.avatar,
      },
    });
  } catch (error) {
    console.error('Get invite error:', error);
    return res.status(500).json({ message: 'Server error fetching invite details' });
  }
};
