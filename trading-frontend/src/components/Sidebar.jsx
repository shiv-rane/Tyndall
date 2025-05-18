import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, BarChart2 } from "lucide-react"; // Icons for sidebar
import { FaUserCircle } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="w-64 bg-indigo-600 text-white flex flex-col p-6 h-screen sticky top-0">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">TradeSaaS</h1>

      <nav className="flex flex-col gap-2">
        <a
          href="/dashboard"
          className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
        >
          Dashboard
        </a>
        <a
          href="/journal"
          className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
        >
          Journal
        </a>
        <a
          href="/analytics"
          className="p-3 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
        >
          Analytics
        </a>
      </nav>

      {/* Profile Button */}
      <button
        onClick={() => (window.location.href = "/profile")}
        className="mt-6 w-full p-3 text-left flex items-center gap-2 rounded-lg hover:bg-indigo-500 hover:scale-[1.02] transition-all duration-200 font-medium tracking-wide"
      >
        <FaUserCircle className="text-xl" />
        My Profile
      </button>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-indigo-400">
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="w-full p-3 text-left rounded-lg hover:bg-indigo-400 bg-indigo-500 transition-colors font-medium tracking-wide"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
