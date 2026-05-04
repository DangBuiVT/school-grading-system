import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import { getNextClassDataAsClass } from "./nextClassData";
import { dayOfWeekMap } from "@/lib/schedule-config";

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

export default async function StudentDashboard(profile: ProfileProps) {
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
  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", profile.id)
    .single();

  if (studentError) {
    console.error("Error fetching teacher data:", studentError);
    return <div className="text-red-500">Failed to load student data.</div>;
  }

  const { data: studiesData, error: studiesError } = await supabase
    .from("studies")
    .select("*")
    .eq("student_id", studentData.id)
    .single();

  if (studiesError) {
    console.error("Error fetching teaches data:", studiesError);
    return <div className="text-red-500">Failed to load studies data.</div>;
  }

  const { data: classData, error: classError } = await supabase
    .from("classes")
    .select("*")
    .eq("id", studiesData.class_id)
    .single();

  if (classError) {
    console.error("Error fetching subject data:", classError);
    return <div className="text-red-500">Failed to load class data.</div>;
  }

  const nextClassData = await getNextClassDataAsClass(classData.id);
  const nextClasses = nextClassData?.data ?? [];

  const { data: topSubjectData } = await supabase
    .from("student_subject_averages")
    .select("subject_name, subject_avg")
    .eq("student_id", profile.id)
    .order("subject_avg", { ascending: false }) // Sort by highest score
    .limit(1) // Get only the best one
    .single();

  // 2. Get the Overall GPA (Average of Averages)
  const { data: allStats } = await supabase
    .from("student_subject_averages")
    .select("subject_avg")
    .eq("student_id", profile.id);

  if (!topSubjectData || !allStats) {
    console.error("Error fetching grade statistics");
    return <div className="text-red-500">Failed to load grade statistics.</div>;
  }

  const totalGPA = allStats
    ? (
        allStats.reduce((acc, curr) => acc + curr.subject_avg, 0) /
        allStats.length
      ).toFixed(2)
    : "0.0";

  return (
    <div className="p-6 bg-gray-50 min-h-[calc(100vh-80px)] font-montserrat">
      <div className="container mx-auto mt-20 grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              Student
            </p>

            {/* Info Lines from your sketch */}
            <div className="w-full space-y-4 text-left border-t pt-6 text-[var(--secondary-color)]">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-montserrat">School:</span>
                <span className="font-semibold">{schoolData.school_name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-montserrat">Class:</span>
                <span className="font-semibold">{classData.class_name}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-montserrat">
                  Year joined on platform:
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
              <h4 className="font-bold text-[var(--secondary-color)]">
                {dayOfWeekMap[nextClassData?.dayOfWeek ?? 0]},{" "}
                {nextClassData?.presetTime.toLocaleDateString()}
                {", "}
                {nextClassData?.presetTime.toLocaleTimeString([], {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </h4>
              <a
                href="/weekly-schedule"
                className="text-sm text-[var(--primary-color)] font-semibold hover:underline"
              >
                View Schedule
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sample Class Card */}
              {nextClasses.length === 0 ? (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-sm text-gray-600">No more classes</p>
                </div>
              ) : (
                nextClasses.map((classItem, index) => (
                  <div
                    key={`${classItem?.subjectName ?? "unknown"}-${index}`}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold text-gray-800">
                        {classItem?.subjectName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {classItem?.teacherGender === "male" ? "Mr. " : "Ms. "}
                        {classItem?.subjectName === "English"
                          ? (classItem?.teacherFName ?? "") +
                            " " +
                            (classItem?.teacherLName ?? "")
                          : (classItem?.teacherLName ?? "") +
                            " " +
                            (classItem?.teacherFName ?? "")}{" "}
                        • {classItem?.startTime}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                      {classItem.countdown || "Upcoming"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* SECTION: Attendance Check Summary */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Personal Statistics
            </h3>

            <div className="flex items-center justify-around space-x-40">
              {/* Student Number Input Box from your sketch */}

              {/* On Time Stat */}
              <div className="flex items-center justify-center space-x-5">
                <label className="text-sm font-bold text-secondary uppercase">
                  Overall Average Grade
                </label>
                <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center font-bold text-primary text-2xl">
                  {totalGPA}
                </div>
              </div>

              {/* Late Stat */}
              <div className="flex items-center justify-center space-x-5">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <label className="text-sm font-bold text-secondary uppercase">
                    Best Subject
                  </label>
                  <div className="text-lg font-semibold text-secondary">
                    {topSubjectData.subject_name}
                  </div>
                </div>

                <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center font-bold text-primary text-2xl">
                  {topSubjectData.subject_avg.toFixed(2)}
                </div>
              </div>
            </div>
            <button className="mt-8 w-full bg-[var(--primary-color)] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
              <a href="/grades" className="block w-full h-full">
                Open Gradebook
              </a>
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}
