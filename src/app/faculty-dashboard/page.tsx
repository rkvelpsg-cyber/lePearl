"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase/auth";
import { LogOut } from "lucide-react";

export default function FacultyDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Faculty Dashboard</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to Faculty Portal</h2>
          <p className="text-gray-600 mb-6">
            Manage your classes, upload course materials, track student performance, and conduct interactive sessions.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-emerald-50 rounded-lg p-6 border-l-4 border-emerald-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Batches</h3>
              <p className="text-gray-600">Create and manage your course batches</p>
            </div>

            <div className="bg-teal-50 rounded-lg p-6 border-l-4 border-teal-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Materials</h3>
              <p className="text-gray-600">Share learning materials and resources with students</p>
            </div>

            <div className="bg-cyan-50 rounded-lg p-6 border-l-4 border-cyan-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Student Reports</h3>
              <p className="text-gray-600">View detailed performance metrics and attendance</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This is a placeholder dashboard. Full faculty portal features will be available soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
