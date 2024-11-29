import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Save, Users, UserMinus, ImageIcon } from "lucide-react";

const EditEventModal = ({ isOpen, event, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
    participants: [],
  });
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchUsersAndParticipants = async () => {
        try {
          const token = localStorage.getItem("authToken");

          const usersResponse = await axios.get(
            "http://localhost:8800/api/auth/users",
            {
              headers: { token },
            }
          );

          const participants = usersResponse.data.filter(
            (user) => user.role === "Participant"
          );

          setAllUsers(
            participants.map((user) => ({
              ...user,
              isParticipating:
                event?.participants?.some((p) => p._id === user._id) || false,
            }))
          );
        } catch (error) {
          console.error("Error fetching users:", error);
          setError("Failed to load users");
        }
      };

      fetchUsersAndParticipants();
    }
  }, [isOpen, event]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || "",
        description: event.description || "",
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
        location: event.location || "",
        image: event.image || null,
        participants: event.participants || [],
      });

      setImagePreview(event.image?.url || null);
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Toggle user participation
  const toggleParticipation = (userId) => {
    setAllUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId
          ? { ...user, isParticipating: !user.isParticipating }
          : user
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("authToken");
      const formPayload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== null &&
          formData[key] !== undefined &&
          key !== "image"
        ) {
          formPayload.append(key, formData[key]);
        }
      });

      if (formData.image instanceof File) {
        formPayload.append("image", formData.image);
      } else if (event.image && event.image.url) {
        formPayload.append("existingImageUrl", event.image.url);
        formPayload.append("existingImagePublicId", event.image.publicId);
      }

      const participantIds = allUsers
        .filter((user) => user.isParticipating)
        .map((user) => user._id);

      participantIds.forEach((id) => formPayload.append("participants[]", id));

      const response = await axios.put(
        `http://localhost:8800/api/events/${event._id}`,
        formPayload,
        {
          headers: {
            token: token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      onUpdateSuccess(response.data);
      onClose();
    } catch (error) {
      console.error("Error updating event:", error);
      setError(error.response?.data?.message || "Failed to update event");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex-col items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto custom-scroll">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-2xl w-2/3 mt-24 ">
        {/* Event Details Column */}
        <div>
          <div className="flex justify-between items-center mb-4 ">
            <h3 className="text-xl font-bold text-orange-500 flex items-center ">
              Edit Event
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 flex-col ">
            <div>
              <label className="block text-gray-300 mb-2">Event Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white h-24"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Date</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white"
                required
              />
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-gray-300 mb-2">Event Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:rounded-full file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-white hover:file:bg-orange-600"
              />
              {imagePreview ? (
                <div className="mt-4 rounded-xl overflow-hidden h-56">
                  <img
                    src={imagePreview}
                    alt="Event Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="mt-4 rounded-xl overflow-hidden h-56 bg-white/10 flex items-center justify-center">
                  <ImageIcon className="text-gray-500 h-12 w-12" />
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Participants Column */}
        <div>
          <h3 className="text-xl font-bold text-orange-500 flex items-center mt-6 mb-4">
            <Users className="mr-2 h-6 w-6" /> Manage Participants
          </h3>

          {/* Participants Grid */}
          <div className="grid grid-cols-3 gap-4">
            {allUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => toggleParticipation(user._id)}
                className={`
                  relative cursor-pointer 
                  p-4 rounded-xl border-2 
                  ${
                    user.isParticipating
                      ? "bg-orange-500/30 border-orange-500"
                      : "bg-white/10 border-white/20"
                  }
                  flex flex-col items-center justify-center
                  hover:bg-white/20 transition
                `}
              >
                {user.isParticipating && (
                  <div className="absolute top-2 right-2">
                    <UserMinus className="text-orange-500" />
                  </div>
                )}
                <div className="text-white text-center">{user.fullName}</div>
              </div>
            ))}
          </div>

          {/* Error and Submit Section */}
          {error && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg mt-4">
              {error}
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-600/20 text-gray-300 px-4 py-2 rounded-lg 
                         hover:bg-gray-600/30 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-orange-500/20 text-orange-400 px-4 py-2 rounded-lg 
                         hover:bg-orange-500/30 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
