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
import ProtectedRoute from "./ProtectedRoute";
import { jwtDecode } from "jwt-decode";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserRole(decodedToken.role);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Token decoding failed", error);
        localStorage.removeItem("authToken"); // Optional: clean up if token is invalid
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserRole(null);

    navigate("/login");
  };
  const organizerDashboard = location.pathname === "/OrganizerDashboard";

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/register"
          element={<RegisterPage isLogged={isLoggedIn} />}
        />
        <Route
          path="/login"
          element={
            <LoginPage isLogged={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />

        <Route
          path="OrganizerDashboard"
          element={
            <ProtectedRoute allowedRoles={["Organisateur"]}>
              <OrganSideBar
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
                handleLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Organizer/events"
          element={
            <ProtectedRoute allowedRoles={["Organisateur"]}>
              <EventsGallery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/create"
          element={
            <ProtectedRoute allowedRoles={["Organisateur"]}>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/delete"
          element={
            <ProtectedRoute allowedRoles={["Organisateur"]}>
              <DeleteConfirmModal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events/:eventId"
          element={
            <ProtectedRoute allowedRoles={["Participant"]}>
              <UserEventsGallery />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!organizerDashboard && (
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
