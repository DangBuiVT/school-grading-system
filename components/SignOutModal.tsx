"use client";

import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";

export default function SignOutModal({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      {/* 1. The Backdrop (The "dimming" layer) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 2. The Actual Box */}
      <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-10 border font-montserrat">
        <h2 className="text-xl font-bold text-gray-900">Are you sure?</h2>
        <p className="mt-2 text-gray-600">
          You will need to log in again to access your dashboard.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSignOut}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
