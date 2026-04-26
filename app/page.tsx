import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isLoggedIn = !!user;

  if (isLoggedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 font-montserrat">
      {/* --- Navigation Bar --- */}

      {/* --- Main Content Area --- */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Manage your School with{" "}
              <span className="text-[var(--primary-color)]">Precision.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              A modern, AI-powered Learning Management System built for the
              Vietnamese academic standard.
            </p>
          </section>

          {/* --- COMPONENT PLACEHOLDER --- */}
          <div className="mt-16 flex items-center justify-center gap-8">
            {/* You can drop your custom components here to see them side-by-side */}
            <div className="rounded-xl border-2 border-[var(--secondary-color)] text-black p-10 flex flex-col items-center gap-4 justify-center">
              <h2 className="text-3xl font-bold text-[var(--secondary-color)]">
                Notice!
              </h2>
              <h4>You have to log in to proceed further.</h4>
              <h4>Please click the button below to go to the login page.</h4>
              <Link
                href="/login"
                className="bg-[var(--secondary-color)] text-white px-6 py-3 rounded-md font-bold hover:bg-[var(--primary-color)] transition-colors"
              >
                Sign In or create an account
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
    </div>
  );
}
