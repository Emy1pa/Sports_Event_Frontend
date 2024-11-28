import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Calendar, Users, LogOut, UserPen, Trophy } from "lucide-react";

const OrganSideBar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  const sidebarItems = [
    { icon: Home, text: "Dashboard", href: "/" },
    { icon: Calendar, text: "Manage Events", href: "/Organizer/events" },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-black/70 backdrop-blur-md text-white flex flex-col">
      <div className="p-6 border-b border-white/10 flex items-center justify-center">
        <Trophy className="h-8 w-8 text-orange-500 mr-3" />
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          SportsEvents
        </h1>
      </div>

      <nav className="flex-grow p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.href}
                className="flex items-center p-3 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              >
                <item.icon className="mr-3 h-6 w-6 text-orange-500 group-hover:text-orange-400 transition-colors" />
                <span className="font-medium group-hover:text-gray-200">
                  {item.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {isLoggedIn && (
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center p-3 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors duration-200 group"
          >
            <LogOut className="mr-3 h-6 w-6 text-red-400 group-hover:text-red-300" />
            <span className="font-medium text-red-300 group-hover:text-red-200">
              Logout
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default OrganSideBar;
