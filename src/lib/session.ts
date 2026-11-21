import { getIronSession, SessionOptions } from 'iron-session';
import type { IncomingMessage, ServerResponse } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';

export type AdminRole =
  | 'SUPER_ADMIN'
  | 'EDITOR'
  | 'REGISTRATION_MANAGER'
  | 'MEDIA_MANAGER'
  | 'VIEWER';

export interface AdminUserSession {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

declare module 'iron-session' {
  interface SessionData {
    user?: AdminUserSession;
  }
}

export const sessionOptions: SessionOptions = {
  password:
    process.env.SECRET_COOKIE_PASSWORD ||
    'aipc_secure_cookie_encryption_key_2026_at_least_32_chars_long_production',
  cookieName: 'aipc_admin_session_v1',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    path: '/',
  },
};

export async function getAdminSession(
  req: IncomingMessage | NextApiRequest,
  res: ServerResponse | NextApiResponse
) {
  return getIronSession(req, res, sessionOptions);
}

/**
 * Helper to check role permissions on API routes
 */
export function hasPermission(
  role: AdminRole,
  requiredRole: 'SUPER_ADMIN' | 'EDITOR' | 'REGISTRATION_MANAGER' | 'MEDIA_MANAGER' | 'VIEWER'
): boolean {
  if (role === 'SUPER_ADMIN') return true;
  if (requiredRole === 'VIEWER') return true;
  if (requiredRole === 'EDITOR' && role === 'EDITOR') return true;
  if (requiredRole === 'REGISTRATION_MANAGER' && role === 'REGISTRATION_MANAGER') return true;
  if (requiredRole === 'MEDIA_MANAGER' && (role === 'EDITOR' || role === 'MEDIA_MANAGER')) return true;
  return false;
}
