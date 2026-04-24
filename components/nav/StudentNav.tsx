export default function StudentNav() {
  return (
    <nav className="mt-4 font-montserrat">
      <ul className="flex space-x-4">
        <li>
          <a
            href="/student/dashboard"
            className="text-white hover:text-gray-300"
          >
            Dashboard
          </a>
        </li>
        <li>
          <a href="/student/courses" className="text-white hover:text-gray-300">
            My Courses
          </a>
        </li>
        <li>
          <a href="/student/grades" className="text-white hover:text-gray-300">
            Grades
          </a>
        </li>
      </ul>
    </nav>
  );
}
