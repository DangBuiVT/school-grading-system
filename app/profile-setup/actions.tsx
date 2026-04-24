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

  const gender = formData.get("gender") as "male" | "female";
  const dob = formData.get("dob") as string;
  const lname = formData.get("lname") as string;
  const fname = formData.get("fname") as string;
  const role_id = formData.get("role_id") as string;
  const school_id = formData.get("school_id") as string;

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

  if (!gender || !dob || !lname || !fname || !role_id || !school_id) {
    redirect("/error?message=All fields are required");
  }

  const { error } = await supabase.from("users").upsert(profileData);

  if (error) {
    console.error("Error saving profile:", error);
    redirect("/error?message=Failed to save profile");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
