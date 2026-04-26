"use client";

import { useState } from "react";
import { createClient } from "@/supabase/client";
import { useRouter } from "next/navigation";
import TeacherNav from "./nav/TeacherNav";
import StudentNav from "./nav/StudentNav";

export default function HeaderClientUI({ role }: { role: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsModalOpen(false);
    router.push("/");
    router.refresh(); // Clears the server cache
  };

  return (
    <>
      <header className="bg-[var(--primary-color)] py-4 relative z-50 shadow-md font-montserrat">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Advance School Management
          </h1>

          <div className="flex items-center gap-6">
            {role === "Teacher" ? <TeacherNav /> : <StudentNav />}

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-white px-4 py-2 ml-6 font-bold rounded-md font-semibold text-[var(--primary-color)] hover:bg-gray-100 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Logout Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          {/* Backdrop: Covers everything EXCEPT the header because header is z-50 and this is z-40 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          {/* Modal Box */}
          <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full mx-4 font-montserrat">
            <h2 className="text-xl font-bold text-[var(--primary-color)]">
              Sign Out?
            </h2>
            <p className="text-gray-600 mt-2">
              Are you sure you want to log out of the LMS?
            </p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 text-black font-bold rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 bg-[var(--primary-color)] text-white rounded-md font-bold"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
