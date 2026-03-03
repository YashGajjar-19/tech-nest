import React from "react";

export default function AdminUsersPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          User Management
        </h1>
        <p className="mt-2 text-white/60">
          Super Admin access tier. Manage system roles and user accounts.
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/2 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
        <div className="text-white/40 mb-4">
          <svg
            className="w-12 h-12 mx-auto"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-white">Role Directory</h3>
        <p className="mt-2 text-sm text-white/50 max-w-sm">
          User list will render from the Supabase public.profiles table.
        </p>
      </div>
    </div>
  );
}
