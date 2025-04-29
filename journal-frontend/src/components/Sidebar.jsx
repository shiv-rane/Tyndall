import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart2 } from "lucide-react"; // Icons for sidebar

const Sidebar = () => {
  const location = useLocation(); // Track current route
  const currentPath = location.pathname;

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Journal", href: "/journal", icon: BookOpen },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-600 text-white flex flex-col p-6 fixed h-full">
        <h1 className="text-2xl font-bold mb-10 tracking-wide">TradeSaaS</h1>

        <nav className="flex flex-col gap-4">
          {links.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              to={href}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 font-medium tracking-wide ${
                currentPath === href
                  ? "bg-indigo-500 scale-[1.02]"
                  : "hover:bg-indigo-500 hover:scale-[1.02]"
              }`}
            >
              <Icon size={20} />
              {name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64"> {/* Give margin-left to avoid sidebar overlap */}
        {/* Your page content (Dashboard, Journal, etc.) will go here */}
      </div>
    </div>
  );
};

export default Sidebar;
