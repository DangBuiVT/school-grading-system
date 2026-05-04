import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import TableClient from "./TableClient";

export default async function StudentGradePage() {
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

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    redirect("/error");
  }

  const { data: studentData, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", user.id)
    .single();

  if (studentError || !studentData) {
    console.error("Error fetching student data:", studentError);
    redirect("/error");
  }

  const { data: gradesData, error: gradesError } = await supabase
    .from("grades")
    .select(
      `subjects(id, subject_name), bonus, frequent_1, frequent_2, frequent_3, mid_term, end_term, average, semesters(id, semester_name)`,
    )
    .eq("student_id", studentData.id);

  if (gradesError || !gradesData) {
    console.error("Error fetching grades data:", gradesError);
    redirect("/error");
  }

  const compositeGradesData = gradesData.map((grade) => ({
    ...grade,
    average: grade.average ?? null,
  }));

  return (
    <div className="flex flex-col bg-[var(--secondary-color)] font-montserrat">
      <h1 className="text-2xl font-bold my-4 flex justify-center items-center">
        My Grades
      </h1>
      <TableClient compositeGrades={gradesData} />
    </div>
  );
}
