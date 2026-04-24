import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      {/* --- Navigation Bar --- */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="text-xl font-bold text-indigo-600">LMS Connect</div>
          <nav className="flex gap-4">
            <Link
              href="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      {/* --- Main Content Area --- */}
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 sm:px-6">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
              Manage Grades with{" "}
              <span className="text-indigo-600">Precision.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
              A modern, AI-powered Learning Management System built for the
              Vietnamese academic standard.
            </p>
          </section>

          {/* --- COMPONENT PLACEHOLDER --- */}
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* You can drop your custom components here to see them side-by-side */}
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
              Feature Component 1
            </div>
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
              Feature Component 2
            </div>
            <div className="rounded-xl border-2 border-dashed border-gray-300 p-12 text-center text-gray-400">
              Feature Component 3
            </div>
          </div>
        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t bg-white py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Advance LMS. Built with Next.js and
          Supabase.
        </div>
      </footer>
    </div>
  );
}
