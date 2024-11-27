import logo from "./logo.svg";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import { Route, Routes } from "react-router-dom";
import RegisterPage from "./auth/RegisterPage";
import LoginPage from "./auth/LoginPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
      <Navbar />
    </div>
  );
}

export default App;
