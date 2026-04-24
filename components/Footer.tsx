export default function FooterComponent() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm font-montserrat">
          &copy; {new Date().getFullYear()} Advance School Management. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
}
