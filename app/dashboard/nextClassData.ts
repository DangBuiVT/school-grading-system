import { createClient } from "@/supabase/server";
import { getVNDayOfWeek, getDetailedPeriodInfo } from "@/lib/schedule-utils";

export async function getNextClassDataAsTeacher(teacherId: string) {
  const supabase = await createClient();

  const now = new Date();
  const presetTime = new Date();

  presetTime.setDate(now.getDate() - 4);
  presetTime.setHours(7, 0, 0);
  const dayOfWeek = getVNDayOfWeek(presetTime);
  console.log(presetTime, "Current time for schedule check");

  // 1. Get period info from your helper
  console.log(dayOfWeek, "Day of week for schedule check");
  // 1. Get period info from your helper
  const { nextPeriodInfo, nextPeriodInfos, countdownLabel, shift } =
    getDetailedPeriodInfo(presetTime);

  if (!nextPeriodInfo || nextPeriodInfos.length === 0) return null;

  const shiftType = shift as "morning" | "afternoon";

  const periodNumbers = nextPeriodInfos.map((period) => period.period);

  // 2. Query the schedule for that specific coordinate (limit to 2)
  const { data, error } = await supabase
    .from("schedule")
    .select(
      `
      period_number,
      subjects (subject_name),
      classes (class_name)
    `,
    )
    .eq("teacher_id", teacherId)
    .eq("day_of_week", dayOfWeek)
    .in("period_number", periodNumbers)
    .eq("part_of_the_day", shiftType)
    .order("period_number", { ascending: true })
    .limit(2);

  if (error || !data || data.length === 0)
    return {
      dayOfWeek,
      presetTime,
      classes: [],
    };

  // 3. Merge helper data with database data
  return {
    dayOfWeek,
    presetTime,
    classes: data.map((row) => {
      const periodInfo = nextPeriodInfos.find(
        (period) => period.period === row.period_number,
      );

      return {
        className: row.classes?.class_name,
        subjectName: row.subjects?.subject_name,
        startTime: periodInfo?.start,
        countdown:
          periodInfo?.period === nextPeriodInfo.period ? countdownLabel : "",
      };
    }),
  };
}

export async function getNextClassDataAsClass(classId: string) {
  const supabase = await createClient();

  const now = new Date();
  const presetTime = new Date();

  presetTime.setDate(now.getDate() - 3);
  presetTime.setHours(6, 59, 59);
  const dayOfWeek = getVNDayOfWeek(presetTime);

  console.log(presetTime, "Current time for schedule check");

  // 1. Get period info from your helper
  console.log(dayOfWeek, "Day of week for schedule check");
  const { nextPeriodInfo, nextPeriodInfos, countdownLabel, shift } =
    getDetailedPeriodInfo(presetTime);

  if (!nextPeriodInfo || nextPeriodInfos.length === 0) return null;

  const shiftType = shift as "morning" | "afternoon";

  const periodNumbers = nextPeriodInfos.map((period) => period.period);

  // 2. Query the schedule for that specific coordinate

  const { data, error } = await supabase
    .from("schedule")
    .select(
      `
      period_number,
      subjects (subject_name),
      teachers (users(fname, lname, gender))
    `,
    )
    .eq("class_id", classId)
    .eq("day_of_week", dayOfWeek)
    .in("period_number", periodNumbers)
    .eq("part_of_the_day", shiftType)
    .order("period_number", { ascending: true })
    .limit(2);

  if (error || !data || data.length === 0)
    return {
      dayOfWeek,
      presetTime,
      data: [],
    };

  // 3. Merge helper data with database data
  return {
    dayOfWeek,
    presetTime,
    data: data.map((row) => {
      const periodInfo = nextPeriodInfos.find(
        (period) => period.period === row.period_number,
      );
      console.log(
        periodInfo?.period === nextPeriodInfo.period
          ? countdownLabel + " until next class"
          : "No label",
        "Countdown label for class schedule",
      );
      return {
        teacherFName: row.teachers?.users?.fname,
        teacherLName: row.teachers?.users?.lname,
        teacherGender: row.teachers?.users?.gender,
        subjectName: row.subjects?.subject_name,
        startTime: periodInfo?.start,
        countdown:
          periodInfo?.period === nextPeriodInfo.period ? countdownLabel : "",
      };
    }),
  };
}
