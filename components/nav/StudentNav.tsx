export default function StudentNav() {
  return (
    <nav className="flex gap-10 items-center font-montserrat font-bold text-lg h-full">
      <ul className="flex gap-15 items-center">
        <li>
          <a href="/dashboard" className="text-white hover:text-gray-300">
            Dashboard
          </a>
        </li>
        <li>
          <a href="/weekly-schedule" className="text-white hover:text-gray-300">
            Schedule
          </a>
        </li>
        <li>
          <a href="/grades" className="text-white hover:text-gray-300">
            Grades
          </a>
        </li>
      </ul>
    </nav>
  );
}
