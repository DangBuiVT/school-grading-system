import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import TableClient from "./TableClient";

export default async function TeacherGradePage() {
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

  const { data: teacherData, error: teacherError } = await supabase
    .from("teachers")
    .select("*")
    .eq("id", user.id)
    .single();

  if (teacherError || !teacherData) {
    console.error("Error fetching teacher data:", teacherError);
    redirect("/error");
  }

  const { data: teachesData, error: teachesError } = await supabase
    .from("teaches")
    .select(
      `
classes(id, class_name),
subjects(id, subject_name)    
    `,
    )
    .eq("teacher_id", teacherData.id);

  if (teachesError || !teachesData) {
    console.error("Error fetching teaches data:", teachesError);
    redirect("/error");
  }

  const { data: studiesData, error: studiesError } = await supabase
    .from("studies")
    .select("*")
    .in(
      "class_id",
      teachesData.map((item) => item.classes.id),
    );

  if (studiesError || !studiesData) {
    console.error("Error fetching studies data:", studiesError);
    redirect("/error");
  }

  const { data: studentsData, error: studentsError } = await supabase
    .from("students")
    .select(
      `
        users (id, fname, lname)
    `,
    )
    .in(
      "id",
      studiesData.map((item) => item.student_id),
    );

  if (studentsError || !studentsData) {
    console.error("Error fetching students data:", studentsError);
    redirect("/error");
  }
  const classSubjectPairProps = teachesData.map((item) => ({
    classes: {
      classId: item.classes?.id,
      className: item.classes?.class_name,
    },
    subjects: {
      subjectId: item.subjects?.id,
      subjectName: item.subjects?.subject_name,
    },
  }));

  return (
    <div className="flex flex-col bg-[var(--secondary-color)] font-montserrat">
      <h1 className="text-2xl font-bold my-4 flex justify-center items-center">
        Teacher Grade Page
      </h1>
      <TableClient combinedProps={classSubjectPairProps} />
    </div>
  );
}
