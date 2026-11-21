import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { getAdminSession, hasPermission, AdminRole } from '@/lib/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  const session = await getAdminSession(req, res);
  const authHeader = req.headers.authorization;
  const isMasterKey = authHeader === 'Bearer AIPC@2025#Admin';

  if (!isMasterKey && (!session.user || session.user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ success: false, error: 'Forbidden: Super Administrator access required.' });
  }

  // 1. GET: List all admin users
  if (req.method === 'GET') {
    try {
      const users = await prisma.adminUser.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'asc' },
      });

      const logs = await prisma.activityLog.findMany({
        take: 30,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, role: true } } },
      });

      return res.status(200).json({ success: true, users, logs });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 2. POST: Create a new admin user
  if (req.method === 'POST') {
    try {
      const { email, name, password, role } = req.body || {};

      if (!email || !name || !password || !role) {
        return res.status(400).json({ success: false, error: 'All fields (email, name, password, role) are required.' });
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const existing = await prisma.adminUser.findUnique({ where: { email: cleanEmail } });
      if (existing) {
        return res.status(400).json({ success: false, error: 'A user with this email address already exists.' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newUser = await prisma.adminUser.create({
        data: {
          email: cleanEmail,
          name: String(name).trim(),
          passwordHash,
          role: role as any,
          isActive: true,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true,
        },
      });

      if (session.user) {
        await prisma.activityLog.create({
          data: {
            userId: session.user.id !== 'root-admin' ? session.user.id : null,
            action: 'USER_CREATED',
            targetType: 'AdminUser',
            targetId: newUser.id,
            description: `Super Admin created user ${newUser.email} with role ${newUser.role}.`,
            ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
          },
        });
      }

      return res.status(201).json({ success: true, user: newUser });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 3. PUT: Update user (role, active, password reset)
  if (req.method === 'PUT') {
    try {
      const { id, name, role, isActive, newPassword } = req.body || {};
      if (!id) {
        return res.status(400).json({ success: false, error: 'User ID is required.' });
      }

      const updateData: any = {};
      if (name) updateData.name = String(name).trim();
      if (role) updateData.role = role;
      if (typeof isActive === 'boolean') updateData.isActive = isActive;
      if (newPassword && String(newPassword).trim().length >= 6) {
        updateData.passwordHash = await bcrypt.hash(String(newPassword).trim(), 10);
      }

      const updated = await prisma.adminUser.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          updatedAt: true,
        },
      });

      if (session.user) {
        await prisma.activityLog.create({
          data: {
            userId: session.user.id !== 'root-admin' ? session.user.id : null,
            action: 'USER_UPDATED',
            targetType: 'AdminUser',
            targetId: updated.id,
            description: `Super Admin updated user ${updated.email}.`,
            ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
          },
        });
      }

      return res.status(200).json({ success: true, user: updated });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  // 4. DELETE: Remove user
  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, error: 'User ID is required.' });
      }

      if (session.user && session.user.id === id) {
        return res.status(400).json({ success: false, error: 'You cannot delete your own active administrator account.' });
      }

      const deleted = await prisma.adminUser.delete({
        where: { id: id as string },
      });

      if (session.user) {
        await prisma.activityLog.create({
          data: {
            userId: session.user.id !== 'root-admin' ? session.user.id : null,
            action: 'USER_DELETED',
            targetType: 'AdminUser',
            targetId: deleted.id,
            description: `Super Admin deleted user ${deleted.email}.`,
            ipAddress: (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '',
          },
        });
      }

      return res.status(200).json({ success: true, message: 'User deleted.' });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
