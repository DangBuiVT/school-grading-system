// app/dashboard/page.tsx
import { createClient } from "@/supabase/server";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";
import { redirect } from "next/navigation";
import ErrorPage from "../error/page";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("Error fetching user:", userError);
    return (
      <ErrorPage
        title="Authentication Error"
        errorMessage="Unable to fetch user data. Please log in again."
        redirectAction={{ text: "Go to Login", link: "/login" }}
      />
    );
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*, roles(role_name)")
    .eq("id", user.id)
    .single();

  const role = profile?.roles?.role_name;

  if (role === "Teacher" && profile) return <TeacherDashboard {...profile} />;
  if (role === "Student" && profile) return <StudentDashboard {...profile} />;

  redirect("/profile-setup");
}
