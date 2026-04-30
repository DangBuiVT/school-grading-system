// app/dashboard/page.tsx
import { createClient } from "@/supabase/server";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return <div className="text-red-500">Failed to load user data.</div>;
  }

  // Fetch profile with role name
  const { data: profile } = await supabase
    .from("users")
    .select("*, roles(role_name)")
    .eq("id", user.id)
    .single();

  const role = profile?.roles?.role_name;

  // Render the specific dashboard based on the role found in database.ts
  if (role === "Teacher" && profile) return <TeacherDashboard {...profile} />;
  if (role === "Student" && profile) return <StudentDashboard {...profile} />;

  return <div>Please contact admin to assign a role.</div>;
}
