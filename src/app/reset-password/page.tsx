"use client";

export const dynamic = "force-dynamic";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { createClient, type AuthScope } from "@/lib/supabase/client";

function loginPathByRole(role: string) {
  if (role === "faculty") return "/faculty-login";
  if (role === "admin") return "/admin-login";
  return "/login";
}

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role");
  const role: AuthScope =
    roleParam === "faculty" || roleParam === "admin" || roleParam === "student"
      ? roleParam
      : "student";

  const supabase = useMemo(() => createClient(role), [role]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null,
  );

  async function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);

    if (newPassword.length < 8) {
      setMsg({
        type: "err",
        text: "Password must be at least 8 characters long.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: "err", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;

      setMsg({
        type: "ok",
        text: "Password updated successfully. Redirecting to login...",
      });

      setTimeout(() => {
        router.push(loginPathByRole(role));
      }, 1200);
    } catch (err) {
      setMsg({
        type: "err",
        text:
          err instanceof Error
            ? err.message
            : "Unable to reset password. Please use the latest email link.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Set New Password
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your new password to complete account recovery.
        </p>

        {msg && (
          <div
            className={`mb-5 p-3 rounded-lg text-sm flex items-center gap-2 ${
              msg.type === "ok"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {msg.type === "ok" ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>{msg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:bg-gray-100"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none disabled:bg-gray-100"
              placeholder="Re-enter new password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Updating...
              </>
            ) : (
              "Update Password"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href={loginPathByRole(role)}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
