"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signInWithEmail } from "@/lib/supabase/auth";
import { AlertCircle, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { user, role, sessionError } = await signInWithEmail(email, password);

      if (sessionError) {
        setError(sessionError);
        setLoading(false);
        return;
      }

      if (!user || !role) {
        setError("Sign in successful but role not found. Please contact support.");
        setLoading(false);
        return;
      }

      // Role-based redirect
      switch (role) {
        case "student":
          router.push("/student-dashboard");
          break;
        case "faculty":
          router.push("/faculty-dashboard");
          break;
        case "admin":
          router.push("/admin-dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex flex-col items-center justify-center px-4 py-12">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-purple-700/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-indigo-700/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-12 text-center">
          <a href="/" className="inline-flex items-center gap-3 mb-6 group">
            <Image
              src="/LePearl_Logo_Canva_1.png"
              alt="LePearl Education"
              width={52}
              height={52}
              className="rounded-lg shadow-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <span className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
              LePearl Education
            </span>
          </a>
          <h1 className="text-3xl font-bold text-white mb-2">Student Login</h1>
          <p className="text-purple-200">
            Access your course dashboard and track your progress
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="student@lepearl.education"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-colors disabled:bg-gray-100"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent outline-none transition-colors disabled:bg-gray-100"
              />
            </div>

            {/* Demo Credentials Hint */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-900">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <p>Email: student@lepearl.education</p>
              <p>Password: Student@123</p>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <a
              href="/login-portal"
              className="text-sm text-purple-600 hover:text-purple-700 font-semibold"
            >
              Back to Login Portal
            </a>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center text-sm text-purple-300">
          Having trouble?{" "}
          <a
            href="https://wa.me/919994990639"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-white underline underline-offset-2 hover:text-purple-200"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
