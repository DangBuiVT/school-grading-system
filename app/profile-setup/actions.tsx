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
    // Student role
    const { error: studentError } = await supabase
      .from("students")
      .insert({ id: user.id });

    if (studentError) {
      console.error("Error creating student record:", studentError);
      redirect("/error?message=Failed to create student profile");
    }
  } else if (role_id === 2) {
    // Teacher role
    const { error: teacherError } = await supabase
      .from("teachers")
      .insert({ id: user.id });

    if (teacherError) {
      console.error("Error creating teacher record:", teacherError);
      redirect("/error?message=Failed to create teacher profile");
    }
  } else {
    redirect("/error?message=Invalid role selected");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
