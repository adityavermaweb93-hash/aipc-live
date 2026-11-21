import React, { useState, useEffect } from 'react';

export interface AdminUserItem {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'EDITOR' | 'REGISTRATION_MANAGER' | 'MEDIA_MANAGER' | 'VIEWER';
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface ActivityLogItem {
  id: string;
  action: string;
  targetType: string;
  description: string;
  ipAddress?: string | null;
  createdAt: string;
  user?: {
    name: string;
    email: string;
    role: string;
  } | null;
}

interface UsersTabProps {
  currentUserId?: string;
  showToast: (type: 'success' | 'error', message: string) => void;
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800 border-purple-200',
  EDITOR: 'bg-blue-100 text-blue-800 border-blue-200',
  REGISTRATION_MANAGER: 'bg-amber-100 text-amber-800 border-amber-200',
  MEDIA_MANAGER: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  VIEWER: 'bg-gray-100 text-gray-700 border-gray-200',
};

export default function UsersTab({ currentUserId, showToast }: UsersTabProps) {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add User Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState<'SUPER_ADMIN' | 'EDITOR' | 'REGISTRATION_MANAGER' | 'MEDIA_MANAGER' | 'VIEWER'>('EDITOR');
  const [actionLoading, setActionLoading] = useState(false);

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'SUPER_ADMIN' | 'EDITOR' | 'REGISTRATION_MANAGER' | 'MEDIA_MANAGER' | 'VIEWER'>('EDITOR');
  const [editPassword, setEditPassword] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users?t=' + Date.now());
      const json = await res.json();
      if (json.success) {
        setUsers(json.users || []);
        setLogs(json.logs || []);
      } else {
        showToast('error', json.error || 'Failed to fetch users');
      }
    } catch (e: any) {
      showToast('error', 'Network error: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addEmail || !addName || !addPassword) {
      showToast('error', 'Please fill all fields');
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: addEmail,
          name: addName,
          password: addPassword,
          role: addRole,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', `User ${json.user.email} created successfully!`);
        setIsAddOpen(false);
        setAddName('');
        setAddEmail('');
        setAddPassword('');
        fetchUsers();
      } else {
        showToast('error', json.error || 'Failed to create user');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editName,
          role: editRole,
          newPassword: editPassword || undefined,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', `User ${editingUser.email} updated successfully!`);
        setEditingUser(null);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Failed to update user');
      }
    } catch (err: any) {
      showToast('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const toggleUserStatus = async (user: AdminUserItem) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          isActive: !user.isActive,
        }),
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', `User ${user.email} is now ${!user.isActive ? 'Active' : 'Disabled'}.`);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Update failed');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  const handleDeleteUser = async (user: AdminUserItem) => {
    if (!confirm(`Are you sure you want to permanently delete user account ${user.email}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        showToast('success', `User ${user.email} removed.`);
        fetchUsers();
      } else {
        showToast('error', json.error || 'Failed to delete');
      }
    } catch (err: any) {
      showToast('error', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#c3c4c7] pb-3">
        <div>
          <h1 className="text-2xl font-normal text-[#1d2327]">
            Team Users &amp; Role-Based Access Control
          </h1>
          <p className="text-xs text-[#646970] mt-0.5">
            Manage admin credentials, role permissions (Super Admin, Editor, Registration Mgr, Media Mgr, Viewer), and review activity audit logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="text-xs font-semibold text-white bg-[#2271b1] hover:bg-[#135e96] border border-[#2271b1] rounded px-3 py-1.5 shadow-sm transition-colors flex items-center gap-1.5"
        >
          <span>👤+</span>
          <span>Add New Team User</span>
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded overflow-hidden">
        <div className="bg-[#f6f7f7] px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Active Administrative Accounts ({users.length})
          </span>
          <span className="text-[11px] text-gray-500">
            Encrypted with bcrypt password hashing
          </span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading admin users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#f0f0f1] text-[#2c3338] font-semibold border-b border-[#c3c4c7]">
                <tr>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Email Address</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Last Login</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c3c4c7]/50">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#f9f9f9]">
                    <td className="py-3 px-3 font-semibold text-gray-900">
                      {u.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-600">
                      {u.email}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          ROLE_COLORS[u.role] || 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => toggleUserStatus(u)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                        title="Click to toggle active status"
                      >
                        {u.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-gray-500">
                      {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString('en-IN') : 'Never'}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingUser(u);
                          setEditName(u.name);
                          setEditRole(u.role);
                          setEditPassword('');
                        }}
                        className="text-[#2271b1] hover:underline font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u)}
                        className="text-[#d63638] hover:underline font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Logs Section */}
      <div className="bg-white border border-[#c3c4c7] shadow-sm rounded overflow-hidden">
        <div className="bg-[#f6f7f7] px-4 py-3 border-b border-[#c3c4c7] flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Recent Admin Activity &amp; Audit Logs (Last 30 Events)
          </span>
          <span className="text-[11px] text-gray-500">Security compliance audit trail</span>
        </div>

        <div className="overflow-x-auto max-h-80">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="bg-[#f0f0f1] text-[#2c3338] font-semibold border-b border-[#c3c4c7] sticky top-0">
              <tr>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">User</th>
                <th className="py-2 px-3">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c3c4c7]/40 font-mono text-[11px]">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-400">
                    No activity logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2 px-3">
                      <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-700 font-sans">
                      {log.user ? `${log.user.name} (${log.user.role})` : 'System / Root'}
                    </td>
                    <td className="py-2 px-3 text-gray-600 font-sans">
                      {log.description}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-[100000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#1d2327] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Add New Team Member</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                  placeholder="e.g. Pastor John David"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                  placeholder="john@aipc.live"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={addPassword}
                  onChange={(e) => setAddPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Role &amp; Permissions</label>
                <select
                  value={addRole}
                  onChange={(e) => setAddRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:ring-[#2271b1]"
                >
                  <option value="SUPER_ADMIN">Super Admin (Complete system access)</option>
                  <option value="EDITOR">Editor (Manage website, editions, and content)</option>
                  <option value="REGISTRATION_MANAGER">Registration Manager (Attendees &amp; Enquiries)</option>
                  <option value="MEDIA_MANAGER">Media Manager (Gallery and media uploads)</option>
                  <option value="VIEWER">Viewer (Read-only dashboard access)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded"
                >
                  {actionLoading ? 'Creating...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[100000] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full border border-gray-300 overflow-hidden">
            <div className="bg-[#1d2327] text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-sm font-bold">Edit User ({editingUser.email})</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Role</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:ring-[#2271b1]"
                >
                  <option value="SUPER_ADMIN">Super Admin (Complete system access)</option>
                  <option value="EDITOR">Editor (Manage website, editions, and content)</option>
                  <option value="REGISTRATION_MANAGER">Registration Manager (Attendees &amp; Enquiries)</option>
                  <option value="MEDIA_MANAGER">Media Manager (Gallery and media uploads)</option>
                  <option value="VIEWER">Viewer (Read-only dashboard access)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Reset Password (Leave blank to keep unchanged)
                </label>
                <input
                  type="password"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="New password (optional)"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs focus:ring-[#2271b1]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-1.5 bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold rounded"
                >
                  {actionLoading ? 'Saving...' : 'Update Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
