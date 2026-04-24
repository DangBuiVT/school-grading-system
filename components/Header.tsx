import { createClient } from "@/supabase/server";
import TeacherNav from "./nav/TeacherNav";
import StudentNav from "./nav/StudentNav";

export default async function HeaderComponent() {
  const supabase = await createClient();

  /* Header different based on roles */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return <header>Guest Header</header>;

  const { data: profile } = await supabase
    .from("users")
    .select("*, roles(role_name)") // This does the "JOIN"
    .eq("id", user.id)
    .single();

  const role = profile?.roles?.role_name;

  return (
    <header className="bg-[var(--primary-color)] py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white font-montserrat">
          Advance School Management
        </h1>
        {role === "Teacher" ? (
          <TeacherNav />
        ) : role === "Student" ? (
          <StudentNav />
        ) : (
          <p className="text-white">Unknown Role</p>
        )}
      </div>
    </header>
  );
}
