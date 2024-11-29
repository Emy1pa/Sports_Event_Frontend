import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import RegisterPage from "./auth/RegisterPage";
import LoginPage from "./auth/LoginPage";
import { useEffect, useState } from "react";
import OrganSideBar from "./dashboard/OrganSideBar";
import EventsGallery from "./dashboard/EventsGallery";
import CreateEvent from "./dashboard/CreateEvent";
import DeleteConfirmModal from "./dashboard/DeleteConfirmModal";
import UserEventsGallery from "./dashboard/UserEventsGallery";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    navigate("/login");
  };
  const organizerDashboard = location.pathname === "/OrganizerDashboard";

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/login"
          element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="OrganizerDashboard"
          element={
            <OrganSideBar
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              handleLogout={handleLogout}
            />
          }
        />
        <Route path="/Organizer/events" element={<EventsGallery />} />
        <Route path="/events/create" element={<CreateEvent />} />
        <Route path="/events/delete" element={<DeleteConfirmModal />} />
        <Route path="/events/:eventId" element={<UserEventsGallery />} />
      </Routes>
      {!organizerDashboard && (
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
