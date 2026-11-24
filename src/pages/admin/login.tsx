import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@aipc.live');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();
      if (json.success) {
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setErrorMsg(json.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Login network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AIPC Portal Sign In – All India Pastors’ Conference</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-[#111] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle Background Backdrop with Dark Maroon Wash */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-sm"
          style={{ backgroundImage: `url('/assets/DSCF0834-scaled.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0505]/90 via-[#0a0a0a]/95 to-[#000]/95" />

        <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
          {/* Logo */}
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <img
              src="/assets/AIPC-White-1.png"
              alt="AIPC Logo"
              className="h-16 w-auto mx-auto drop-shadow-lg"
            />
          </Link>

          <h2 className="mt-4 text-center text-2xl font-bold tracking-wide text-white uppercase font-sans">
            AIPC Platform Admin
          </h2>
          <p className="mt-1 text-center text-xs text-gray-400">
            All India Pastors’ Conference &bull; Permanent Management CMS
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
          <div className="bg-[#1d2327]/95 border border-[#3c434a] py-8 px-6 shadow-2xl rounded-lg sm:px-10 backdrop-blur-md">
            {errorMsg && (
              <div className="mb-5 bg-red-950/80 border-l-4 border-red-500 p-3 rounded text-red-200 text-xs">
                <div className="font-bold">Authentication Failed</div>
                <div>{errorMsg}</div>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-300"
                >
                  Admin Email Address
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded border border-[#3c434a] bg-[#2c3338] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#72aee6] focus:outline-none focus:ring-1 focus:ring-[#72aee6]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-300 flex items-center justify-between"
                >
                  <span>Password / Master Key</span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] text-gray-400 hover:text-white capitalize font-normal"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </label>
                <div className="mt-1.5">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="block w-full appearance-none rounded border border-[#3c434a] bg-[#2c3338] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#72aee6] focus:outline-none focus:ring-1 focus:ring-[#72aee6]"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full justify-center rounded border border-transparent bg-[#cc0000] hover:bg-[#aa0000] py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin">↻</span>
                      <span>Verifying Session...</span>
                    </span>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 border-t border-[#3c434a] pt-4">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <Link
                  href="/"
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>&larr;</span>
                  <span>Back to Public Website</span>
                </Link>
                <Link
                  href="/archive"
                  className="hover:text-white transition-colors"
                >
                  Historical Archives
                </Link>
              </div>
            </div>
          </div>

          {/* Secure RBAC Badges */}
          <div className="mt-6 text-center">
            <div className="text-[11px] text-gray-400 mb-2 uppercase tracking-wider font-semibold">
              Supported Role-Based Permissions
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {[
                { name: 'Super Admin', color: 'bg-purple-950/80 text-purple-300 border-purple-800/50' },
                { name: 'Editor', color: 'bg-blue-950/80 text-blue-300 border-blue-800/50' },
                { name: 'Registration Mgr', color: 'bg-amber-950/80 text-amber-300 border-amber-800/50' },
                { name: 'Media Mgr', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50' },
                { name: 'Viewer', color: 'bg-gray-800/80 text-gray-300 border-gray-700/50' },
              ].map((role) => (
                <span
                  key={role.name}
                  className={`text-[10px] px-2 py-0.5 rounded border font-medium ${role.color}`}
                >
                  {role.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
