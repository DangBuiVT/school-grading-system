// app/components/Header.tsx
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import HeaderClientUI from "./HeaderClientUI"; // We will create this next

export default async function HeaderComponent() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <header className="bg-[var(--primary-color)] py-4 relative z-50 font-montserrat">
        {/* Guest View */}
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">
            Advance School Management
          </h1>
          <button className="bg-white px-4 py-2 ml-6 font-bold rounded-md font-semibold text-[var(--primary-color)] hover:bg-gray-100 transition-colors">
            <a href="/login">Sign In</a>
          </button>
        </div>
      </header>
    );
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*, roles(role_name)")
    .eq("id", user.id)
    .single();

  const role = profile?.roles?.role_name || "Unknown";

  // Pass the role to the Client Component which handles the state
  return <HeaderClientUI role={role} />;
}
