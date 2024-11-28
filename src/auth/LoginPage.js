import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { Mail, Lock, LogIn } from "lucide-react";

const LoginPage = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const validateForm = () => {
    const { email, password } = formData;
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email is invalid");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      setLoading(true);
    }
    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        formData
      );
      console.log("API Response:", response.data);
      const { token, role, userId } = response.data;
      const user = response.data;
      if (!user || !role) {
        throw new Error("User data or role is missing from the response");
      }
      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);
      localStorage.setItem("userId", userId);
      toast.success("Login successful!");
      setIsLoggedIn(true);
      if (role === "Participant") {
        navigate("/");
      } else if (role === "Organisateur") {
        navigate("/");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      toast.error(
        error.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center text-center text-white relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/sports3.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-black/70 backdrop-blur-sm"></div>

      <div className="relative z-10 bg-black/30 backdrop-blur-md rounded-2xl p-12 w-full max-w-md h-[80vh] overflow-y-auto mt-20 custom-scroll">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          SportsEvents
        </h1>
        <h2 className="text-3xl font-bold mb-6">Welcome Back</h2>
        <p className="text-xl mb-8 text-gray-300">
          Login to continue your sports journey
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-orange-500 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center hover:bg-orange-600 transition transform hover:scale-105 mt-6"
          >
            <LogIn className="mr-2 h-5 w-5" />
            {loading ? "Logging..." : "Login"}
          </button>

          <div className="mt-6 text-gray-300">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-orange-500 hover:text-orange-600 font-bold"
            >
              Register
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;
