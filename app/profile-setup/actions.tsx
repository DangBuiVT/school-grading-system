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

  const profileData = {
    id: user.id,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    role_id: formData.get("role_id") as string,
    school_id: formData.get("school_id") as string,
  };

  const { error } = await supabase.from("users").upsert(profileData);

  if (error) {
    console.error("Error saving profile:", error);
    redirect("/error?message=Failed to save profile");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}
