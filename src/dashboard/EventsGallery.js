import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Edit, Trash2, Map, Calendar, ImageIcon } from "lucide-react";
import { format } from "date-fns";
const EventCard = ({ event }) => {
  // Format date to show only year, month, and day
  const formattedDate = event.date
    ? format(new Date(event.date), "PPP")
    : "No date specified";

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col w-full">
      {" "}
      <div className="mb-4 rounded-xl overflow-hidden flex-shrink-0 h-56">
        {" "}
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
      <div className="flex space-x-3 mt-auto">
        <button
          className="flex-1 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg 
                     hover:bg-blue-500/30 transition flex items-center justify-center"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit
        </button>
        <button
          className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg 
                     hover:bg-red-500/30 transition flex items-center justify-center"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </button>
      </div>
    </div>
  );
};

const EventsGallery = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.get("http://localhost:8800/api/events", {
          headers: { token },
        });
        setEvents(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching events:", error);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading events...</div>
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
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
              Manage Events
            </h2>
            <button
              className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold 
                         flex items-center hover:bg-orange-600 transition transform hover:scale-105"
            >
              <Plus className="mr-2 h-5 w-5" /> Create Event
            </button>
          </div>

          {events.length === 0 ? (
            <div className="text-center text-gray-400 text-2xl">
              No events found. Create your first event!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsGallery;
