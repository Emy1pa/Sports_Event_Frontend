import React, { useState } from "react";
import { Users, Mail, Lock, UserPlus } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };
  const validateForm = () => {
    const { fullName, email, password } = formData;
    if (!fullName) {
      toast.error("FullName is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Email is invalid");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:8800/api/auth/register",
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Registration successful", response.data);
        toast.success("Registration successful!");
        setFormData({
          fullName: "",
          email: "",
          password: "",
        });
      } catch (error) {
        console.error(
          "Registration error: ",
          error.response?.data || error.message
        );
        toast.error(
          error.response?.data.message ||
            "Registration failed. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center text-center text-white relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/sports3.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-black/70 backdrop-blur-sm "></div>

      <div className="relative z-10 bg-black/30 backdrop-blur-md rounded-2xl p-12 w-full max-w-md h-[80vh] overflow-y-auto mt-20">
        <h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
          SportsEvents
        </h1>
        <h2 className="text-3xl font-bold mb-6">Create Your Account</h2>
        <p className="text-xl mb-8 text-gray-300">
          Join SportsEvents and start your athletic journey
        </p>

        <form onSubmit={handleSubmit}>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-gray-400" />
            </div>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

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
            <UserPlus className="mr-2 h-5 w-5" />
            {loading ? "Registring..." : "Register"}
          </button>

          <div className="mt-6 text-gray-300">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-orange-500 hover:text-orange-600 font-bold"
            >
              Login
            </a>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterPage;
