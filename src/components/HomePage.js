import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trophy, Zap, ChevronRight, Target, Users, Medal } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div className="bg-white/10 p-4 rounded-xl text-center backdrop-blur-sm">
    <Icon className={`mx-auto mb-2 ${color} h-8 w-8`} />
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-300">{label}</div>
  </div>
);

const EventCard = ({ title, date, description }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-4">
    <div className="flex justify-between items-center mb-3">
      <h3 className="text-xl font-bold text-orange-400">{title}</h3>
      <span className="text-sm text-gray-400">{date}</span>
    </div>
    <p className="text-gray-300">{description}</p>
  </div>
);

const HomePage = () => {
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const role = decoded.role;
        setUserRole(role);
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const handleButtonClick = () => {
    if (userRole === "Organisateur") {
      navigate("/OrganizerDashboard");
    } else if (userRole === "Participant") {
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Active Athletes",
      color: "text-orange-500",
    },
    {
      icon: Target,
      value: "250+",
      label: "Events",
      color: "text-blue-500",
    },
    {
      icon: Medal,
      value: "500+",
      label: "Achievements",
      color: "text-green-500",
    },
  ];

  const events = [
    {
      title: "Summer Sports Championship",
      date: "Aug 15-20, 2024",
      description:
        "Annual multi-sport competition featuring top athletes from around the world.",
    },
    {
      title: "Urban Running Series",
      date: "Sep 5, 2024",
      description:
        "City-wide marathon with professional and amateur categories.",
    },
    {
      title: "Extreme Sports Expo",
      date: "Oct 10-12, 2024",
      description:
        "Showcase of cutting-edge sports technologies and extreme athletic performances.",
    },
    {
      title: "Youth Athletic Development Camp",
      date: "Nov 22-25, 2024",
      description:
        "Comprehensive training program for young athletes aged 12-18.",
    },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center text-center text-white relative bg-cover bg-center pt-20"
      style={{
        backgroundImage: "url('/images/sports3.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-black/30 backdrop-blur-md rounded-2xl p-12 max-w-4xl w-full h-[80vh] overflow-y-auto custom-scroll">
        <div className="flex justify-center items-center mb-6">
          <Trophy className="h-12 w-12 text-orange-500 mr-4" />
          <h1 className="text-5xl font-extrabold">SportsEvents</h1>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          Elevate Your Sports Experience
        </h2>

        <p className="text-xl mb-10 text-gray-300">
          Transform your passion into performance. SportsPro is your
          comprehensive platform for tracking, competing, and achieving athletic
          excellence.
        </p>

        <div className="flex justify-center space-x-6 mb-4 -mt-6">
          <Link
            to="/events/participants"
            className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold flex items-center hover:bg-orange-600 transition transform hover:scale-105"
          >
            Upcoming Events
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
          {userRole === "Organisateur" && (
            <div className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-red-900 transition transform hover:scale-105 flex items-center">
              <button onClick={handleButtonClick}>
                Go to Organizer Dashboard
              </button>
              <Zap className="ml-2 h-5 w-5" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          Upcoming Sporting Events
        </h3>

        <div className="space-y-4">
          {events.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
