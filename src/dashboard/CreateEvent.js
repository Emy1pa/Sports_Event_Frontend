import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trophy, Check } from "lucide-react";

const CreateEvent = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    maxParticipants: 0,
    participants: [],
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          "http://localhost:8800/api/auth/users",
          {
            headers: { token },
          }
        );
        const participants = response.data.filter(
          (user) => user.role === "Participant"
        );
        setUsers(participants);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      }
    };
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Create image preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("authToken");

      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "participants") {
          formData[key].forEach((participantId) => {
            formDataToSend.append("participants", participantId);
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (image) {
        formDataToSend.append("image", image);
      }
      await axios.post("http://localhost:8800/api/events", formDataToSend, {
        headers: {
          token: token,
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/Organizer/events");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create event");
      console.error("Event creation error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-red-900/70 to-black/70 p-6 custom-scroll mt-10 overflow-y-auto">
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-12 w-full max-w-lg custom-scroll mt-10 overflow-y-auto">
        <div className="flex justify-center items-center mb-8">
          <Trophy className="h-12 w-12 text-orange-500 mr-4" />
          <h1 className="text-4xl font-extrabold text-white">Create Event</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Event Title"
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Event Description"
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
          />

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            placeholder="Maximum Participants"
            required
            className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <div className="flex flex-col space-y-2">
            <label className="text-white">Upload Event Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-white hover:file:bg-orange-600"
            />
            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Event Preview"
                  className="max-w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="block text-white mb-2">Select Participants</label>
            <div className="grid grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    const selectedOptions = formData.participants.includes(
                      user._id
                    )
                      ? formData.participants.filter((id) => id !== user._id)
                      : [...formData.participants, user._id];
                    setFormData((prev) => ({
                      ...prev,
                      participants: selectedOptions,
                    }));
                  }}
                  className={`
                    relative cursor-pointer 
                    p-4 rounded-xl border-2 
                    ${
                      formData.participants.includes(user._id)
                        ? "bg-orange-500/30 border-orange-500"
                        : "bg-white/10 border-white/20"
                    }
                    flex flex-col items-center justify-center
                    hover:bg-white/20 transition
                  `}
                >
                  {formData.participants.includes(user._id) && (
                    <div className="absolute top-2 right-2">
                      <Check className="text-orange-500" />
                    </div>
                  )}
                  <div className="text-white text-center">{user.fullName}</div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-500 bg-red-900/20 p-3 rounded-xl text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 bg-orange-500 text-white rounded-full font-bold hover:bg-orange-600 transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Creating Event..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
