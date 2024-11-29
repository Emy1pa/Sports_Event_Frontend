import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, Map, ImageIcon } from "lucide-react";

const UserEventsGallery = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipantEvents = async () => {
      // Retrieve token, userId, and userRole from localStorage
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const userRole = localStorage.getItem("userRole");

      if (!token || !userId || !userRole) {
        setError("Authentication information is incomplete. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:8800/api/events/participant",
          {
            headers: {
              token,
              "Content-Type": "application/json",
            },
            params: {
              userId: userId,
              userRole: userRole,
            },
          }
        );

        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Full error details:", error.response?.data || error);
        setError(
          error.response?.data?.message ||
            "Failed to load your events. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchParticipantEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-gray-600">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        My Participating Events
      </h1>

      {events.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">
          You are not participating in any events currently.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:scale-105"
            >
              {event.image?.url ? (
                <img
                  src={event.image.url}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <ImageIcon className="text-gray-500 h-12 w-12" />
                </div>
              )}

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {event.title}
                </h2>

                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  <span>
                    {event.date
                      ? format(new Date(event.date), "EEEE, MMMM d, yyyy")
                      : "Date not specified"}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <Map className="mr-2 h-5 w-5 text-green-500" />
                  <span>{event.location || "Location not specified"}</span>
                </div>

                <p className="text-gray-700 line-clamp-3">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEventsGallery;
