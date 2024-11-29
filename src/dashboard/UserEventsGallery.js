import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { Calendar, Map, ImageIcon } from "lucide-react";
import { useParams } from "react-router-dom"; // Import useParams

const UserEventCard = ({ event }) => {
  const formattedDate = event.date
    ? format(new Date(event.date), "PPP")
    : "No date specified";

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col w-full">
      <div className="mb-4 rounded-xl overflow-hidden flex-shrink-0 h-56">
        {event.image?.url ? (
          <img
            src={event.image.url}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/10 flex items-center justify-center">
            <ImageIcon className="text-gray-500 h-12 w-12" />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-orange-400 mb-2 leading-tight">
          {event.title}
        </h3>

        <div className="flex items-center text-gray-300 mb-3">
          <Calendar className="mr-2 h-5 w-5 text-blue-500" />
          <span className="text-sm">{formattedDate}</span>
        </div>

        <div className="flex items-center text-gray-300 mb-3">
          <Map className="mt-1 h-5 w-5 text-blue-500" />
          {event.location}
        </div>

        <p className="text-gray-300 mb-4 flex-grow line-clamp-3">
          {event.description}
        </p>
      </div>

      <div className="mt-4 bg-white/10 p-3 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-200 mb-2">
          Your Registration Details
        </h4>
        <div className="text-xs text-gray-400">
          {event.participants.find(
            (participant) => participant._id === event.userId
          )?.status || "Registered"}
        </div>
      </div>
    </div>
  );
};

const UserEventsGallery = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { eventId } = useParams();
  console.log("Event ID from URL:", eventId);

  useEffect(() => {
    const fetchUserEvents = async () => {
      const token = localStorage.getItem("authToken");
      console.log("Token:", token);

      if (!token) {
        setError("No valid authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8800/api/events/${eventId}`,
          {
            headers: { token, "Content-Type": "application/json" },
          }
        );

        setEvents(response.data);
        console.log(response.data); // Check if participants is present in the response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user events:", error);
        setError("Failed to load your events. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserEvents();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading your events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white"
      style={{
        backgroundImage: "url('/images/sports3.jpg')",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-black/70 min-h-screen">
        <div className="container mx-auto px-4 py-12 custom-scroll mt-10 overflow-y-auto">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-10">
            My Events
          </h2>

          {events.length === 0 ? (
            <div className="text-center text-gray-400 text-2xl">
              You haven't registered for any events yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {events.map((event) => (
                <UserEventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserEventsGallery;
