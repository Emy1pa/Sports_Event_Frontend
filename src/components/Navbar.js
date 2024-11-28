import React, { useState } from "react";
import {
  Trophy,
  User,
  Menu,
  X,
  Target,
  Calendar,
  BarChart,
  Zap,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const onLogout = () => {
    handleLogout();
    closeMobileMenu();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-900 to-black text-white shadow-xl">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Trophy className="h-10 w-10 text-orange-500" />
            <Link to={"/"} onClick={closeMobileMenu}>
              <span className="font-bold text-2xl tracking-wider">
                SportsEvents
              </span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            <Link
              onClick={closeMobileMenu}
              to="/events"
              className="hover:text-orange-400 transition duration-300 flex items-center space-x-2"
            >
              <Zap className="h-5 w-5" />
              <span>Events</span>
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/analytics"
              className="hover:text-orange-400 transition duration-300 flex items-center space-x-2"
            >
              <BarChart className="h-5 w-5" />
              <span>Analytics</span>
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/calendar"
              className="hover:text-orange-400 transition duration-300 flex items-center space-x-2"
            >
              <Calendar className="h-5 w-5" />
              <span>Calendar</span>
            </Link>
            <Link
              onClick={closeMobileMenu}
              to="/achievements"
              className="hover:text-orange-400 transition duration-300 flex items-center space-x-2"
            >
              <Target className="h-5 w-5" />
              <span>Achievements</span>
            </Link>
          </div>

          <div className="hidden md:flex space-x-4">
            {!isLoggedIn ? (
              <>
                <Link to={"/register"} onClick={closeMobileMenu}>
                  <button className="bg-orange-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition transform hover:scale-105">
                    Register
                  </button>
                </Link>
                <Link to={"/login"} onClick={closeMobileMenu}>
                  <button className="border-2 border-white text-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-red-900 transition transform hover:scale-105">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-full font-semibold hover:bg-orange-600 transition transform hover:scale-105 flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="h-8 w-8" />
              ) : (
                <Menu className="h-8 w-8" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-red-900 to-black">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link
                onClick={closeMobileMenu}
                to="/events"
                className="block py-3 px-4 hover:bg-red-800 rounded-lg flex items-center space-x-3"
              >
                <Zap className="h-6 w-6 text-orange-500" />
                <span>Events</span>
              </Link>
              <Link
                onClick={closeMobileMenu}
                to="/analytics"
                className="block py-3 px-4 hover:bg-red-800 rounded-lg flex items-center space-x-3"
              >
                <BarChart className="h-6 w-6 text-orange-500" />
                <span>Analytics</span>
              </Link>
              <Link
                onClick={closeMobileMenu}
                to="/calendar"
                className="block py-3 px-4 hover:bg-red-800 rounded-lg flex items-center space-x-3"
              >
                <Calendar className="h-6 w-6 text-orange-500" />
                <span>Calendar</span>
              </Link>
              <Link
                onClick={closeMobileMenu}
                to="/achievements"
                className="block py-3 px-4 hover:bg-red-800 rounded-lg flex items-center space-x-3"
              >
                <Target className="h-6 w-6 text-orange-500" />
                <span>Achievements</span>
              </Link>
              {!isLoggedIn && (
                <div className="space-y-4 pt-4">
                  <Link to={"/register"} onClick={closeMobileMenu}>
                    <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold">
                      Register
                    </button>
                  </Link>
                  <Link to={"/login"} onClick={closeMobileMenu}>
                    <button className="w-full border-2 border-white text-white py-3 rounded-full font-semibold">
                      Login
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
