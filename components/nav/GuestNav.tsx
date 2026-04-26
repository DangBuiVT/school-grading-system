export default function GuestNav() {
  return (
    <nav className="flex gap-10 items-center font-montserrat font-bold text-lg h-full">
      <ul className="flex gap-15 items-center">
        <li>
          <a href="/login" className="text-white hover:text-gray-300">
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
}
