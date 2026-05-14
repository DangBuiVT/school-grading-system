import Link from "next/link";

type ErrorPageProps = {
  title?: string;
  errorMessage?: string;
  redirectAction?: {
    text: string;
    link: string;
  };
};
export default async function ErrorPage({
  title,
  errorMessage,
  redirectAction,
}: ErrorPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-montserrat">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Error</h1>
        <h3 className="text-2xl text-secondary mb-4">{title}</h3>
        <p className="text-lg text-gray-700 mb-2">
          {errorMessage || "An unexpected error occurred."}
        </p>
        {redirectAction && (
          <button className="mt-6 px-4 py-2 bg-primary font-bold text-white rounded-lg hover:opacity-90 transition-opacity">
            <Link href={redirectAction?.link}>{redirectAction?.text}</Link>
          </button>
        )}
      </div>
    </div>
  );
}
