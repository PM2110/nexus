import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/db';
import { config } from '../config/env';

// Helpers to generate tokens using configured expiration times
const generateAccessToken = (user: { id: string | number; email: string; role: string }): string => {
  return jwt.sign(
    { id: String(user.id), email: user.email, role: user.role },
    config.JWT_SECRET,
    { expiresIn: config.JWT_ACCESS_EXPIRES_IN }
  );
};

const generateRefreshToken = (user: { id: string | number; email: string; role: string }): string => {
  return jwt.sign(
    { id: String(user.id), email: user.email, role: user.role },
    config.JWT_REFRESH_SECRET,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN }
  );
};

const saveRefreshToken = async (userId: number, token: string) => {
  const expiresAt = new Date(Date.now() + config.JWT_REFRESH_EXPIRES_IN * 1000);
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });
};

// ==========================================
// GOOGLE OAUTH FLOW
// ==========================================
export const googleAuth = (req: Request, res: Response) => {
  const clientID = config.GOOGLE_CLIENT_ID;
  const redirectURI = config.GOOGLE_REDIRECT_URI;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientID}&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&scope=profile%20email`;

  return res.redirect(googleAuthUrl);
};

export const googleCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const clientID = config.GOOGLE_CLIENT_ID;
    const clientSecret = config.GOOGLE_CLIENT_SECRET;
    const redirectURI = config.GOOGLE_REDIRECT_URI;

    if (!code) {
      throw new Error('No authorization code provided from Google callback.');
    }

    // Exchange code for Google Access Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = (await tokenResponse.json()) as any;
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Failed to exchange Google OAuth code');
    }

    // Fetch Google User Details
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUser = (await userResponse.json()) as any;
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user details from Google');
    }

    const userData = {
      id: googleUser.id,
      email: googleUser.email,
      name: googleUser.name || 'Google User',
      picture: googleUser.picture || '',
    };

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email.toLowerCase(),
          provider: 'google',
          providerId: userData.id,
          avatar: userData.picture,
        },
      });
    } else if (user.provider !== 'google') {
      // Update existing user with OAuth details
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'google',
          providerId: userData.id,
          avatar: userData.picture,
        },
      });
    }

    // Generate credentials
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user.id, refreshToken);

    const redirectUrl = `${config.FRONTEND_URL}/login?token=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(
      JSON.stringify({
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      })
    )}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google OAuth error:', error);
    return res.redirect(`${config.FRONTEND_URL}/login?error=google_auth_failed`);
  }
};

// ==========================================
// GITHUB OAUTH FLOW
// ==========================================
export const githubAuth = (req: Request, res: Response) => {
  const clientID = config.GITHUB_CLIENT_ID;
  const redirectURI = config.GITHUB_REDIRECT_URI;

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirect_uri=${encodeURIComponent(
    redirectURI
  )}&scope=user:email`;

  return res.redirect(githubAuthUrl);
};

export const githubCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const clientID = config.GITHUB_CLIENT_ID;
    const clientSecret = config.GITHUB_CLIENT_SECRET;
    const redirectURI = config.GITHUB_REDIRECT_URI;

    if (!code) {
      throw new Error('No authorization code provided from GitHub callback.');
    }

    // Exchange code for GitHub Access Token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        code,
        client_id: clientID,
        client_secret: clientSecret,
        redirect_uri: redirectURI,
      }),
    });

    const tokenData = (await tokenResponse.json()) as any;
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(tokenData.error_description || 'Failed to exchange GitHub OAuth code');
    }

    // Fetch GitHub User Details
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
        'User-Agent': 'Nexus-App',
      },
    });

    const githubUser = (await userResponse.json()) as any;
    if (!userResponse.ok) {
      throw new Error('Failed to fetch user profile from GitHub');
    }

    // Fetch GitHub User Emails (needed as emails can be private)
    const emailsResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: 'application/json',
        'User-Agent': 'Nexus-App',
      },
    });

    const emails = (await emailsResponse.json()) as any[];
    let email = githubUser.email;
    if (Array.isArray(emails)) {
      const primaryEmailObj = emails.find((e) => e.primary && e.verified);
      if (primaryEmailObj) {
        email = primaryEmailObj.email;
      } else if (emails.length > 0) {
        email = emails[0].email;
      }
    }

    if (!email) {
      email = `${githubUser.login}@github.nexus.dev`;
    }

    const userData = {
      id: String(githubUser.id),
      email,
      name: githubUser.name || githubUser.login || 'GitHub User',
      picture: githubUser.avatar_url || '',
    };

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: { email: userData.email.toLowerCase() },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email.toLowerCase(),
          provider: 'github',
          providerId: userData.id,
          avatar: userData.picture,
        },
      });
    } else if (user.provider !== 'github') {
      // Update existing user with OAuth details
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          provider: 'github',
          providerId: userData.id,
          avatar: userData.picture,
        },
      });
    }

    // Generate credentials
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await saveRefreshToken(user.id, refreshToken);

    const redirectUrl = `${config.FRONTEND_URL}/login?token=${accessToken}&refreshToken=${refreshToken}&user=${encodeURIComponent(
      JSON.stringify({
        id: String(user.id),
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      })
    )}`;

    return res.redirect(redirectUrl);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    return res.redirect(`${config.FRONTEND_URL}/login?error=github_auth_failed`);
  }
};
