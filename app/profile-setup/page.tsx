import { createClient } from "@/supabase/server";
import ProfileForm from "./profile-form";

export default async function ProfileSetupPage() {
  const supabase = await createClient();

  const { data: schools } = await supabase.from("schools").select("*");
  const { data: roles } = await supabase.from("roles").select("*");
  const { data: years } = await supabase.from("academic_years").select("*");

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-10 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[var(--secondary-color)] font-montserrat">
            Advance LMS
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-montserrat">
            {"Let's finish setting up your profile information"}
          </p>
        </div>
        <ProfileForm
          schools={schools || []}
          roles={roles || []}
          years={years || []}
        />
      </div>
    </div>
  );
}
