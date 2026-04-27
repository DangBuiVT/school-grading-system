import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function WeeklySchedulePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user data:", userError);
    redirect("/login");
  }

  if (userData.role_id === 1) {
    /* Student schedule, with class is the fixed value*/
    const { data: studentData } = await supabase
      .from("students")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!studentData) {
      console.error("No student data found for user:", user.id);
      redirect("/error?message=Student data not found");
    }

    const { data: studiesData, error: studiesError } = await supabase
      .from("studies")
      .select("*")
      .eq("student_id", studentData.id)
      .single();
    if (studiesError || !studiesData) {
      console.error("Error fetching studies data:", studiesError);
      redirect("/error?message=Studies data not found");
    }

    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedule")
      .select(
        `
        day_of_week,
        period_number,
        subjects(subject_name),
        classes(class_name)
      `,
      )
      .eq("class_id", studiesData.class_id);

    if (scheduleError || !scheduleData) {
      console.error("Error fetching schedule data:", scheduleError);
      redirect("/error?message=Schedule data not found");
    }
    return (
      <div className="grid gap-2">
        {scheduleData.map((slot, index) => (
          <div
            key={`${slot.day_of_week ?? "day"}-${slot.period_number ?? "period"}-${index}`}
            style={{
              gridColumn: slot.day_of_week ?? undefined,
              gridRow: (slot.period_number ?? 0) + 1,
            }}
            className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded"
          >
            <p className="font-bold text-xs">{slot.subjects?.subject_name}</p>
            <p className="text-[10px]">{slot.classes?.class_name}</p>
          </div>
        ))}
      </div>
    );
  } else if (userData.role_id === 2) {
    /* Teacher schedule, with subject is the fixed value*/
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("*")
      .eq("id", user.id)
      .single();
    if (!teacherData) {
      console.error("No teacher data found for user:", user.id);
      redirect("/error?message=Teacher data not found");
    }

    const { data: teachesData, error: teachesError } = await supabase
      .from("teaches")
      .select("*")
      .eq("teacher_id", teacherData.id)
      .single();
    if (teachesError || !teachesData) {
      console.error("Error fetching teaches data:", teachesError);
      redirect("/error?message=Teaches data not found");
    }

    const { data: scheduleData, error: scheduleError } = await supabase
      .from("schedule")
      .select(
        `
        day_of_week,
        period_number,
        subjects(subject_name),
        classes(class_name)
      `,
      )
      .eq("class_id", teachesData.class_id);

    if (scheduleError || !scheduleData) {
      console.error("Error fetching schedule data:", scheduleError);
      redirect("/error?message=Schedule data not found");
    }
    return (
      <div className="grid gap-2">
        {scheduleData.map((slot, index) => (
          <div
            key={`${slot.day_of_week ?? "day"}-${slot.period_number ?? "period"}-${index}`}
            style={{
              gridColumn: slot.day_of_week ?? undefined,
              gridRow: (slot.period_number ?? 0) + 1,
            }}
            className="bg-blue-100 border-l-4 border-blue-500 p-2 rounded"
          >
            <p className="font-bold text-xs">{slot.subjects?.subject_name}</p>
            <p className="text-[10px]">{slot.classes?.class_name}</p>
          </div>
        ))}
      </div>
    );
  } else {
    redirect("/error?message=Invalid user role");
  }
}
