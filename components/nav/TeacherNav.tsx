export default function TeacherNav() {
  return (
    <nav className="flex gap-10 items-center font-montserrat font-bold text-lg h-full">
      <ul className="flex gap-15 items-center">
        <li>
          <a
            href="/teacher/dashboard"
            className="text-white hover:text-gray-300"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a href="/teacher/classes" className="text-white hover:text-gray-300">
            My Classes
          </a>
        </li>
        <li>
          <a
            href="/teacher/gradetable"
            className="text-white hover:text-gray-300"
          >
            Grades
          </a>
        </li>
      </ul>
    </nav>
  );
}
