"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/supabase/auth";
import { LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login-portal");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to Admin Panel
          </h2>
          <p className="text-gray-600 mb-6">
            Full platform control. Manage users, courses, payments, analytics,
            and institutional settings.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <div className="bg-amber-50 rounded-lg p-6 border-l-4 border-amber-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                User Management
              </h3>
              <p className="text-gray-600">
                Create, modify, and manage user accounts and permissions
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-6 border-l-4 border-orange-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Course Control
              </h3>
              <p className="text-gray-600">
                Manage courses, batches, and curriculum
              </p>
            </div>

            <div className="bg-red-50 rounded-lg p-6 border-l-4 border-red-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Payment Reports
              </h3>
              <p className="text-gray-600">
                Monitor financial transactions and generate reports
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Platform Analytics
              </h3>
              <p className="text-gray-600">
                View comprehensive platform usage statistics
              </p>
            </div>

            <div className="bg-pink-50 rounded-lg p-6 border-l-4 border-pink-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                System Settings
              </h3>
              <p className="text-gray-600">
                Configure institutional settings and preferences
              </p>
            </div>

            <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-600">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Activity Log
              </h3>
              <p className="text-gray-600">
                Track all system activities and audit trails
              </p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600">
              <strong>Note:</strong> This is a placeholder dashboard. Full admin
              panel features will be available soon.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
