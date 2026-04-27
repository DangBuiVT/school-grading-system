import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

interface ProfileProps {
  created_at: string | null;
  date_of_birth: string;
  email: string;
  fname: string;
  gender: "male" | "female";
  id: string;
  lname: string;
  phone: string;
  role_id: number;
  school_id: string;
  updated_at: string | null;
  roles: {
    role_name: string;
  };
}

export default async function TeacherDashboard(profile: ProfileProps) {
  const supabase = await createClient();

  const { data: schoolData, error: schoolError } = await supabase
    .from("schools")
    .select("*")
    .eq("id", profile.school_id)
    .single();

  if (schoolError) {
    console.error("Error fetching school data:", schoolError);
    redirect("/login");
  }
  const { data: teacherData, error: teacherError } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", profile.id)
    .single();

  if (teacherError) {
    console.error("Error fetching teacher data:", teacherError);
    return <div className="text-red-500">Failed to load teacher data.</div>;
  }

  const { data: teachesData, error: teachesError } = await supabase
    .from("teaches")
    .select("*")
    .eq("teacher_id", teacherData.id);

  if (teachesError) {
    console.error("Error fetching teaches data:", teachesError);
    return <div className="text-red-500">Failed to load teaches data.</div>;
  }

  const { data: subjectData, error: subjectError } = await supabase
    .from("subjects")
    .select("*")
    .eq("id", teachesData[0].subject_id)
    .single();

  if (subjectError) {
    console.error("Error fetching subject data:", subjectError);
    return <div className="text-red-500">Failed to load subject data.</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] font-montserrat">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Profile Card (3/12 columns) */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            {/* Profile Image Circle */}
            <div className="w-24 h-24 bg-gray-200 rounded-full mb-4 overflow-hidden border-4 border-[var(--primary-color)]/10">
              {/* <img src="/avatar.png" alt="Profile" /> */}
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {profile.lname + " " + profile.fname}
            </h2>
            <p className="text-sm text-[var(--primary-color)] font-medium mb-6">
              {subjectData.subject_name} Teacher
            </p>

            {/* Info Lines from your sketch */}
            <div className="w-full space-y-4 text-left border-t pt-6 text-[var(--secondary-color)]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-montserrat">School:</span>
                <span className="font-semibold">{schoolData.school_name}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-montserrat">
                  Year joined:
                </span>
                <span className="font-semibold">
                  {profile.created_at?.slice(0, 4)}
                </span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Content (9/12 columns) */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-6">
          {/* SECTION: Next Classes */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Next Classes</h3>
              <button className="text-sm text-[var(--primary-color)] font-semibold hover:underline">
                View Schedule
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample Class Card */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-gray-800">Class 10A1</p>
                  <p className="text-xs text-gray-500">
                    Mathematics • 10:30 AM
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                  In 15m
                </span>
              </div>
            </div>
          </section>

          {/* SECTION: Attendance Check Summary */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Attendance Quick Check
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Student Number Input Box from your sketch */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Student Total
                </label>
                <div className="text-3xl font-bold bg-gray-100 p-4 rounded-xl text-center border-2 border-dashed border-gray-200">
                  42
                </div>
              </div>

              {/* On Time Stat */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  On Time
                </label>
                <div className="w-16 h-16 rounded-full border-4 border-green-500 flex items-center justify-center font-bold text-green-600">
                  38
                </div>
              </div>

              {/* Late Stat */}
              <div className="flex flex-col items-center justify-center space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Late
                </label>
                <div className="w-16 h-16 rounded-full border-4 border-orange-400 flex items-center justify-center font-bold text-orange-500">
                  4
                </div>
              </div>
            </div>

            <button className="mt-8 w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
              Start Today&apos;s Attendance
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
