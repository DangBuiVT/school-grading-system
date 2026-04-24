import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("users")
    .select("fname, lname, phone, role_id, school_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !profile || !profile.fname || !profile.lname || !profile.phone) {
    redirect("/profile-setup");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary-color)] font-montserrat">
            Welcome to Advance LMS
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-montserrat">
            {`Hello, ${profile?.fname}! This is your dashboard.`}
          </p>
        </div>
      </div>
    </div>
  );
}
