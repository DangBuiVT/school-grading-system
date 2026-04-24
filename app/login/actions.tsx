"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  /* Compare Password and Confirm password fields */
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirm-password") as string;
  if (password !== confirmPassword) {
    redirect("/error?message=Passwords do not match");
  }

  const signUpData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        phone: formData.get("phone") as string,
      },
    },
  };

  const { data, error } = await supabase.auth.signUp(signUpData);

  if (error) {
    console.log("Signup error, redirecting to /error");
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/profile-setup");
}
