import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function GradesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: roleData, error: roleError } = await supabase
    .from("users")
    .select("role_id")
    .eq("id", user.id)
    .single();

  if (roleError || !roleData) {
    console.error("Error fetching user role data:", roleError);
    redirect("/login");
  }

  const roleId = roleData.role_id;

  if (roleId === 1) {
    redirect("/grades/student-grade-page");
  } else if (roleId === 2) {
    redirect("/grades/teacher-grade-page");
  }
}
