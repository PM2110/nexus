import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../types';

export const getFriends = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = parseInt(req.user!.id, 10);
    const search = req.query.search ? String(req.query.search) : '';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;

    if (isNaN(currentUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const skip = (page - 1) * limit;

    // Build the query options
    const whereQuery: any = {
      status: 'ACCEPTED',
      OR: [
        {
          userId: currentUserId,
          friend: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
        {
          friendId: currentUserId,
          user: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ],
    };

    // Run both queries in parallel: count total & fetch items
    const [totalCount, friendships] = await Promise.all([
      prisma.friendship.count({ where: whereQuery }),
      prisma.friendship.findMany({
        where: whereQuery,
        include: {
          user: {
            select: { id: true, name: true, email: true, avatar: true },
          },
          friend: {
            select: { id: true, name: true, email: true, avatar: true },
          },
        },
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const friends = friendships.map((f) => {
      const otherUser = f.userId === currentUserId ? f.friend : f.user;
      return {
        friendshipId: f.id,
        id: String(otherUser.id),
        name: otherUser.name,
        email: otherUser.email,
        avatar: otherUser.avatar,
      };
    });

    const hasMore = skip + friends.length < totalCount;

    return res.json({
      friends,
      totalCount,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('Get friends error:', error);
    return res.status(500).json({ message: 'Server error fetching friends list' });
  }
};

export const getFriendRequests = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = parseInt(req.user!.id, 10);

    if (isNaN(currentUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Fetch incoming friend requests (where friendId is current user and status is PENDING)
    const requests = await prisma.friendship.findMany({
      where: {
        friendId: currentUserId,
        status: 'PENDING',
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedRequests = requests.map((r) => ({
      friendshipId: r.id,
      sender: {
        id: String(r.user.id),
        name: r.user.name,
        email: r.user.email,
        avatar: r.user.avatar,
      },
      createdAt: r.createdAt,
    }));

    return res.json({ requests: formattedRequests });
  } catch (error) {
    console.error('Get friend requests error:', error);
    return res.status(500).json({ message: 'Server error fetching friend requests' });
  }
};

export const sendFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = parseInt(req.user!.id, 10);
    const { friendId } = req.body;

    const targetFriendId = parseInt(friendId, 10);

    if (isNaN(senderId) || isNaN(targetFriendId)) {
      return res.status(400).json({ message: 'Invalid sender or friend ID' });
    }

    if (senderId === targetFriendId) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetFriendId },
    });
    if (!targetUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get current sender details
    const senderUser = await prisma.user.findUnique({
      where: { id: senderId },
    });

    // Check if relationship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { userId: senderId, friendId: targetFriendId },
          { userId: targetFriendId, friendId: senderId },
        ],
      },
    });

    if (existingFriendship) {
      if (existingFriendship.status === 'ACCEPTED') {
        return res.status(400).json({ message: 'You are already friends with this user' });
      }
      if (existingFriendship.status === 'PENDING') {
        if (existingFriendship.userId === senderId) {
          return res.status(400).json({ message: 'Friend request already sent' });
        } else {
          // If the other user already sent one, accept it automatically
          await prisma.friendship.update({
            where: { id: existingFriendship.id },
            data: { status: 'ACCEPTED' },
          });

          await prisma.notification.create({
            data: {
              userId: targetFriendId,
              type: 'FRIEND_REQUEST',
              title: 'Friend Request Accepted',
              content: `${senderUser?.name} accepted your friend request.`,
              link: '/friends',
            },
          });

          return res.json({ message: 'Friend request accepted automatically as they had invited you', status: 'ACCEPTED' });
        }
      }
    }

    // Create friendship request
    const friendship = await prisma.friendship.create({
      data: {
        userId: senderId,
        friendId: targetFriendId,
        status: 'PENDING',
      },
    });

    // Create Notification for the target user
    await prisma.notification.create({
      data: {
        userId: targetFriendId,
        type: 'FRIEND_REQUEST',
        title: 'New Friend Request',
        content: `${senderUser?.name} sent you a friend request.`,
        link: '/friends',
      },
    });

    return res.status(201).json({
      message: 'Friend request sent successfully',
      friendshipId: friendship.id,
      status: 'PENDING',
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    return res.status(500).json({ message: 'Server error sending friend request' });
  }
};

export const acceptFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = parseInt(req.user!.id, 10);
    const { friendshipId } = req.body;

    const parsedFriendshipId = parseInt(friendshipId, 10);

    if (isNaN(currentUserId) || isNaN(parsedFriendshipId)) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: parsedFriendshipId },
      include: { user: true },
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    if (friendship.friendId !== currentUserId) {
      return res.status(403).json({ message: 'You can only accept requests sent to you' });
    }

    // Get current user details
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    // Update status to ACCEPTED
    await prisma.friendship.update({
      where: { id: parsedFriendshipId },
      data: { status: 'ACCEPTED' },
    });

    // Notify the sender that request was accepted
    await prisma.notification.create({
      data: {
        userId: friendship.userId,
        type: 'FRIEND_REQUEST',
        title: 'Friend Request Accepted',
        content: `${currentUser?.name} accepted your friend request.`,
        link: '/friends',
      },
    });

    return res.json({ message: 'Friend request accepted successfully' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    return res.status(500).json({ message: 'Server error accepting friend request' });
  }
};

export const rejectFriendRequest = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = parseInt(req.user!.id, 10);
    const { friendshipId } = req.body;

    const parsedFriendshipId = parseInt(friendshipId, 10);

    if (isNaN(currentUserId) || isNaN(parsedFriendshipId)) {
      return res.status(400).json({ message: 'Invalid request parameters' });
    }

    const friendship = await prisma.friendship.findUnique({
      where: { id: parsedFriendshipId },
    });

    if (!friendship) {
      return res.status(404).json({ message: 'Friendship record not found' });
    }

    if (friendship.friendId !== currentUserId && friendship.userId !== currentUserId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Delete friendship request/friendship
    await prisma.friendship.delete({
      where: { id: parsedFriendshipId },
    });

    return res.json({ message: 'Friend request declined / friend removed successfully' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    return res.status(500).json({ message: 'Server error rejecting request' });
  }
};

export const searchUsersToRequest = async (req: AuthRequest, res: Response) => {
  try {
    const currentUserId = parseInt(req.user!.id, 10);
    const search = req.query.search ? String(req.query.search) : '';
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;

    if (isNaN(currentUserId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const skip = (page - 1) * limit;

    // Get all existing friendships to exclude them from user search
    const existingFriendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { userId: currentUserId },
          { friendId: currentUserId },
        ],
      },
    });

    const relatedUserIds = existingFriendships.map((f) =>
      f.userId === currentUserId ? f.friendId : f.userId
    );
    // Exclude current user as well
    relatedUserIds.push(currentUserId);

    const whereQuery = {
      id: { notIn: relatedUserIds },
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    };

    const [totalCount, users] = await Promise.all([
      prisma.user.count({ where: whereQuery as any }),
      prisma.user.findMany({
        where: whereQuery as any,
        select: { id: true, name: true, email: true, avatar: true },
        skip,
        take: limit,
      }),
    ]);

    const formattedUsers = users.map((u) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      avatar: u.avatar,
    }));

    const hasMore = skip + users.length < totalCount;

    return res.json({
      users: formattedUsers,
      totalCount,
      page,
      limit,
      hasMore,
    });
  } catch (error) {
    console.error('Search users error:', error);
    return res.status(500).json({ message: 'Server error searching users' });
  }
};
