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
    //console.log(studiesData);
    const { data: scheduleMorningData, error: scheduleMorningError } =
      await supabase
        .from("schedule")
        .select(
          `
        day_of_week,
        period_number,
        subjects(subject_name),
        classes(class_name),
        teachers(users(fname, lname, gender)),
        part_of_the_day
      `,
        )
        .eq("class_id", studiesData.class_id)
        .eq("part_of_the_day", "morning");

    if (scheduleMorningError || !scheduleMorningData) {
      console.error("Error fetching schedule data:", scheduleMorningError);
      redirect("/error?message=Schedule data not found");
    }

    const { data: scheduleAfternoonData, error: scheduleAfternoonError } =
      await supabase
        .from("schedule")
        .select(
          `
        day_of_week,
        period_number,
        subjects(subject_name),
        teachers(users(fname, lname, gender)),
        part_of_the_day
      `,
        )
        .eq("class_id", studiesData.class_id)
        .eq("part_of_the_day", "afternoon");

    if (scheduleAfternoonError || !scheduleAfternoonData) {
      console.error("Error fetching schedule data:", scheduleMorningError);
      redirect("/error?message=Schedule data not found");
    }
    return (
      <div className="flex flex-col bg-[var(--secondary-color)]">
        <div className="flex min-h-[calc(100vh-80px)] font-montserrat gap-10 p-6 border border-[var(--primary-color)] rounded-2xl m-4 bg-gray-50 ">
          <div className="text-center flex-[1] flex justify-end items-center text-2xl font-bold mb-4 text-[var(--secondary-color)]">
            Morning
          </div>

          <div className="flex-[6] grid grid-cols-6 gap-2  ">
            <div
              style={{ gridArea: "1/1" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Period No.
            </div>
            <div
              style={{ gridArea: "1/2" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Monday
            </div>
            <div
              style={{ gridArea: "1/3" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Tuesday
            </div>
            <div
              style={{ gridArea: "1/4" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Wednesday
            </div>
            <div
              style={{ gridArea: "1/5" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Thursday
            </div>
            <div
              style={{ gridArea: "1/6" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Friday
            </div>
            <div
              style={{ gridArea: "2/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              1
            </div>
            <div
              style={{ gridArea: "3/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              2
            </div>
            <div
              style={{ gridArea: "4/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              3
            </div>
            <div
              style={{ gridArea: "5/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              4
            </div>
            <div
              style={{ gridArea: "6/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              5
            </div>
            {scheduleMorningData.map((slot, index) => (
              <div
                key={`${slot.day_of_week ?? "day"}-${slot.period_number ?? "period"}-${index}`}
                style={{
                  /* gridColumn: slot.day_of_week ? slot.day_of_week - 1 : undefined, */
                  gridColumn: slot.day_of_week ?? undefined,
                  gridRow: (slot.period_number ?? 0) + 1,
                }}
                className="bg-[var(--primary-color)]/50 border-l-4 border-[var(--primary-color)] p-2 rounded text-black text-xl flex flex-col justify-between"
              >
                <p className="font-bold text-xs">
                  {slot.teachers?.users?.gender === "male" ? "Mr." : "Ms."}{" "}
                  {slot.subjects?.subject_name === "English"
                    ? slot.teachers?.users?.fname +
                      " " +
                      slot.teachers?.users?.lname
                    : slot.teachers?.users?.lname +
                      " " +
                      slot.teachers?.users?.fname}
                </p>
                <p className="text-sm">{slot.subjects?.subject_name}</p>
              </div>
            ))}
          </div>
        </div>
        <h2 className="w-full flex justify-center items-center font-bold font-montserrat text-3xl">
          Lunch Break
        </h2>
        <div className="flex min-h-[calc(100vh-80px)] font-montserrat gap-10 p-6 border border-[var(--primary-color)] rounded-2xl m-4 bg-gray-50 ">
          <div className="text-center flex-[1] flex justify-end items-center text-2xl font-bold mb-4 text-[var(--secondary-color)]">
            Afternoon
          </div>
          <div className="flex-[6] grid grid-cols-6 gap-2  ">
            <div
              style={{ gridArea: "1/1" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Period No.
            </div>
            <div
              style={{ gridArea: "1/2" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Monday
            </div>
            <div
              style={{ gridArea: "1/3" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Tuesday
            </div>
            <div
              style={{ gridArea: "1/4" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Wednesday
            </div>
            <div
              style={{ gridArea: "1/5" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Thursday
            </div>
            <div
              style={{ gridArea: "1/6" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Friday
            </div>
            <div
              style={{ gridArea: "2/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              1
            </div>
            <div
              style={{ gridArea: "3/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              2
            </div>
            <div
              style={{ gridArea: "4/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              3
            </div>
            <div
              style={{ gridArea: "5/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              4
            </div>
            <div
              style={{ gridArea: "6/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              5
            </div>
            {scheduleAfternoonData.map((slot, index) => (
              <div
                key={`${slot.day_of_week ?? "day"}-${slot.period_number ?? "period"}-${index}`}
                style={{
                  /* gridColumn: slot.day_of_week ? slot.day_of_week - 1 : undefined, */
                  gridColumn: slot.day_of_week ?? undefined,
                  gridRow: (slot.period_number ?? 0) + 1,
                }}
                className="bg-[var(--primary-color)]/50 border-l-4 border-[var(--primary-color)] p-2 rounded text-black text-xl flex flex-col justify-between"
              >
                <p className="font-bold text-xs">
                  {slot.teachers?.users?.gender === "male" ? "Mr." : "Ms."}{" "}
                  {slot.subjects?.subject_name === "English"
                    ? slot.teachers?.users?.fname +
                      " " +
                      slot.teachers?.users?.lname
                    : slot.teachers?.users?.lname +
                      " " +
                      slot.teachers?.users?.fname}
                </p>
                <p className="text-sm">{slot.subjects?.subject_name}</p>
              </div>
            ))}
          </div>
        </div>
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

    const { data: scheduleMorningData, error: scheduleMorningError } =
      await supabase
        .from("schedule")
        .select(
          `
        day_of_week,
        period_number,
        subjects (subject_name),
        classes (class_name)
        `,
        )
        .eq("teacher_id", teacherData.id) // Direct filter is more accurate
        .eq("part_of_the_day", "morning")
        .order("period_number", { ascending: true });

    const { data: scheduleAfternoonData, error: scheduleAfternoonError } =
      await supabase
        .from("schedule")
        .select(
          `
        day_of_week,
        period_number,
        subjects (subject_name),
        classes (class_name)
        `,
        )
        .eq("teacher_id", teacherData.id) // Direct filter is more accurate
        .eq("part_of_the_day", "afternoon")
        .order("period_number", { ascending: true });

    if (
      scheduleMorningError ||
      !scheduleMorningData ||
      scheduleAfternoonError ||
      !scheduleAfternoonData
    ) {
      console.error(
        "Error fetching schedule data:",
        scheduleMorningError || scheduleAfternoonError,
      );
      redirect("/error?message=Schedule data not found");
    }

    return (
      <div className="flex flex-col bg-[var(--secondary-color)]">
        <div className="flex min-h-[calc(100vh-80px)] font-montserrat gap-10 p-6 border border-[var(--primary-color)] rounded-2xl m-4 bg-gray-50 ">
          <div className="text-center flex-[1] flex justify-end items-center text-2xl font-bold mb-4 text-[var(--secondary-color)]">
            Morning
          </div>

          <div className="flex-[6] grid grid-cols-6 gap-2  ">
            <div
              style={{ gridArea: "1/1" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Period No.
            </div>
            <div
              style={{ gridArea: "1/2" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Monday
            </div>
            <div
              style={{ gridArea: "1/3" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Tuesday
            </div>
            <div
              style={{ gridArea: "1/4" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Wednesday
            </div>
            <div
              style={{ gridArea: "1/5" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Thursday
            </div>
            <div
              style={{ gridArea: "1/6" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Friday
            </div>
            <div
              style={{ gridArea: "2/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              1
            </div>
            <div
              style={{ gridArea: "3/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              2
            </div>
            <div
              style={{ gridArea: "4/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              3
            </div>
            <div
              style={{ gridArea: "5/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              4
            </div>
            <div
              style={{ gridArea: "6/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              5
            </div>
            {scheduleMorningData.map((slot, index) => (
              <div
                key={`${slot.day_of_week ?? "day"}-${slot.period_number ?? "period"}-${index}`}
                style={{
                  /* gridColumn: slot.day_of_week ? slot.day_of_week - 1 : undefined, */
                  gridColumn: slot.day_of_week ?? undefined,
                  gridRow: (slot.period_number ?? 0) + 1,
                }}
                className="bg-[var(--primary-color)]/50 border-l-4 border-[var(--primary-color)] p-2 rounded text-black text-xl"
              >
                <p className="font-bold text-sm">
                  {slot.subjects?.subject_name}
                </p>
                <p className="">{slot.classes?.class_name}</p>
              </div>
            ))}
          </div>
        </div>
        <h2 className="w-full flex justify-center items-center font-bold font-montserrat text-3xl">
          Lunch Break
        </h2>
        <div className="flex min-h-[calc(100vh-80px)] font-montserrat gap-10 p-6 border border-[var(--primary-color)] rounded-2xl m-4 bg-gray-50 ">
          <div className="text-center flex-[1] flex justify-end items-center text-2xl font-bold mb-4 text-[var(--secondary-color)]">
            Afternoon
          </div>
          <div className="flex-[6] grid grid-cols-6 gap-2  ">
            <div
              style={{ gridArea: "1/1" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Period No.
            </div>
            <div
              style={{ gridArea: "1/2" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Monday
            </div>
            <div
              style={{ gridArea: "1/3" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Tuesday
            </div>
            <div
              style={{ gridArea: "1/4" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Wednesday
            </div>
            <div
              style={{ gridArea: "1/5" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Thursday
            </div>
            <div
              style={{ gridArea: "1/6" }}
              className="font-bold text-[var(--secondary-color)] text-lg flex items-center justify-center"
            >
              Friday
            </div>
            <div
              style={{ gridArea: "2/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              1
            </div>
            <div
              style={{ gridArea: "3/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              2
            </div>
            <div
              style={{ gridArea: "4/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              3
            </div>
            <div
              style={{ gridArea: "5/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              4
            </div>
            <div
              style={{ gridArea: "6/1" }}
              className="font-bold text-[var(--secondary-color)] text-2xl flex items-center justify-center"
            >
              5
            </div>
            {scheduleAfternoonData.map((slot, index) => (
              <div
                key={`${slot.day_of_week ?? "day"}-${slot.period_number ?? "period"}-${index}`}
                style={{
                  /* gridColumn: slot.day_of_week ? slot.day_of_week - 1 : undefined, */
                  gridColumn: slot.day_of_week ?? undefined,
                  gridRow: (slot.period_number ?? 0) + 1,
                }}
                className="bg-[var(--primary-color)]/50 border-l-4 border-[var(--primary-color)] p-2 rounded text-black text-xl"
              >
                <p className="font-bold text-sm">
                  {slot.subjects?.subject_name}
                </p>
                <p className="">{slot.classes?.class_name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    redirect("/error?message=Invalid user role");
  }
}
