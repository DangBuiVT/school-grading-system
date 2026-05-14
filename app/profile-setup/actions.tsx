"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export async function saveProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const email = user.email;
  if (!email) {
    redirect("/error?message=User email not found");
  }

  // Phone was set at signup via options.data.phone
  const phoneFromAuth = user.user_metadata?.phone;
  if (typeof phoneFromAuth !== "string" || phoneFromAuth.trim() === "") {
    redirect("/error?message=Missing phone number in account metadata");
  }

  const gender = formData.get("gender") as "male" | "female" | null;
  const dob = formData.get("dob") as string | null;
  const lname = formData.get("lname") as string | null;
  const fname = formData.get("fname") as string | null;
  const roleIdRaw = formData.get("role_id") as string | null;
  const school_id = formData.get("school_id") as string | null;

  if (!gender || !dob || !lname || !fname || !roleIdRaw || !school_id) {
    redirect("/error?message=All fields are required");
  }

  const role_id = Number(roleIdRaw);
  if (Number.isNaN(role_id)) {
    redirect("/error?message=Invalid role selected");
  }

  const profileData = {
    id: user.id,
    email: email,
    gender,
    date_of_birth: dob,
    lname,
    fname,
    phone: phoneFromAuth,
    role_id,
    school_id,
  };

  const { error } = await supabase.from("users").upsert(profileData);

  if (error) {
    console.error("Error saving profile:", error);
    redirect("/error?message=Failed to save profile");
  }

  if (role_id === 1) {
    const { error: studentError } = await supabase
      .from("students")
      .upsert({ id: user.id });

    if (studentError) {
      console.error("Error creating student record:", studentError);
      redirect("/error?message=Failed to create student profile");
    }

    // Randomly assign a student to a class (for demo purposes) & joint table 'studies'
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select("id");
    if (classesError) {
      console.error("Error fetching classes:", classesError);
      redirect("/error?message=Failed to fetch classes for student assignment");
    }

    if (!classes || classes.length === 0) {
      console.error("No classes available for student assignment");
      redirect("/error?message=No classes available for student assignment");
    }

    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const { error: studiesError } = await supabase
      .from("studies")
      .insert({ student_id: user.id, class_id: randomClass.id });
    if (studiesError) {
      console.error("Error assigning student to class:", studiesError);
      redirect("/error?message=Failed to assign student to class");
    }
  } else if (role_id === 2) {
    const { error: teacherError } = await supabase
      .from("teachers")
      .insert({ id: user.id });

    if (teacherError) {
      console.error("Error creating teacher record:", teacherError);
      redirect("/error?message=Failed to create teacher profile");
    }

    // Randomly assign a teacher to a class (for demo purposes) and a subject & joint table 'teaches'
    const { data: classes, error: classesError } = await supabase
      .from("classes")
      .select("id");
    if (classesError) {
      console.error("Error fetching classes:", classesError);
      redirect("/error?message=Failed to fetch classes for teacher assignment");
    }

    if (!classes || classes.length === 0) {
      console.error("No classes available for teacher assignment");
      redirect("/error?message=No classes available for teacher assignment");
    }

    const randomClass = classes[Math.floor(Math.random() * classes.length)];

    const { data: subjects, error: subjectsError } = await supabase
      .from("subjects")
      .select("id");
    if (subjectsError) {
      console.error("Error fetching subjects:", subjectsError);
      redirect(
        "/error?message=Failed to fetch subjects for teacher assignment",
      );
    }

    if (!subjects || subjects.length === 0) {
      console.error("No subjects available for teacher assignment");
      redirect("/error?message=No subjects available for teacher assignment");
    }

    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];

    const { error: teachesError } = await supabase.from("teaches").insert({
      teacher_id: user.id,
      class_id: randomClass.id,
      subject_id: randomSubject.id,
    });
    if (teachesError) {
      console.error("Error assigning teacher to class:", teachesError);
      redirect("/error?message=Failed to assign teacher to class");
    }
  } else {
    redirect("/error?message=Invalid role selected");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
