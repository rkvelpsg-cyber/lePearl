"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase/auth";
import { LogOut } from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Your Student Dashboard</h2>
          <p className="text-gray-600 mb-6">
            This is your personal learning space where you can access courses, track progress, view grades, and more.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
              <p className="text-gray-600">View and manage your enrolled courses</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mock Tests</h3>
              <p className="text-gray-600">Take mock tests and track your performance</p>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border-l-4 border-green-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracker</h3>
              <p className="text-gray-600">Monitor your learning progress and achievements</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This is a placeholder dashboard. Full dashboard features will be available soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
