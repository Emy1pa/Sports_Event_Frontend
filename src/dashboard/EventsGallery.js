import React, { useEffect, useState, useRef, forwardRef } from "react";
import axios from "axios";
import {
  Plus,
  Edit,
  Trash2,
  Map,
  Calendar,
  ImageIcon,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import DeleteConfirmModal from "./DeleteConfirmModal";
import EditEventModal from "./EditEventModal";
import { useReactToPrint } from "react-to-print";

const EventPDFDetails = forwardRef(({ event }, ref) => {
  return (
    <div
      ref={ref}
      className="p-12 bg-white text-gray-800 font-sans max-w-4xl mx-auto shadow-lg"
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        lineHeight: 1.6,
      }}
    >
      <div className="border-b-2 border-orange-500 pb-6 mb-8">
        <h1 className="text-4xl font-bold text-center text-orange-600 mb-2">
          {event.title}
        </h1>
        <p className="text-center text-gray-500 text-lg">Event Details</p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b pb-2">
            Event Information
          </h2>
          <div className="space-y-3">
            <div>
              <strong className="text-gray-600">Date:</strong>
              <p className="text-gray-800">
                {event.date
                  ? format(new Date(event.date), "EEEE, MMMM d, yyyy")
                  : "No date specified"}
              </p>
            </div>
            <div>
              <strong className="text-gray-600">Location:</strong>
              <p className="text-gray-800">
                {event.location || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        {event.image?.url && (
          <div>
            <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b pb-2">
              Event Image
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <img
                src={event.image.url}
                alt={event.title}
                className="max-w-full h-auto rounded-lg object-cover"
                style={{ maxHeight: "300px" }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b pb-2">
          Description
        </h2>
        <p className="text-gray-700 leading-relaxed">
          {event.description || "No description provided"}
        </p>
      </div>

      {event.participants && event.participants.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4 border-b pb-2">
            Participants
          </h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-3 text-gray-600 border">FullName</th>
                <th className="text-left p-3 text-gray-600 border">Email</th>
              </tr>
            </thead>
            <tbody>
              {event.participants.map((participant, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                >
                  <td className="p-3 border text-gray-800">
                    {participant.fullName}
                  </td>
                  <td className="p-3 border text-gray-800">
                    {participant.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-12 pt-4 border-t text-center text-gray-500">
        <p className="text-sm">
          Generated on {new Date().toLocaleString()} | ©{" "}
          {new Date().getFullYear()} Event Management
        </p>
      </div>
    </div>
  );
});

const EventPDFModal = ({ event, isOpen, onClose }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${event.title}_Event_Details`,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg w-4/5 max-w-3xl overflow-y-auto custom-scroll mt-20">
        <EventPDFDetails ref={componentRef} event={event} />
        <div className="flex justify-end mt-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
            onClick={handlePrint}
          >
            Print PDF
          </button>
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const EventCard = ({ event, onDeleteClick, onEditClick }) => {
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);

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
      <div className="flex flex-1 space-x-3 mt-auto w-full ">
        <button
          onClick={() => onEditClick(event)}
          className="flex-1 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg 
                     hover:bg-blue-500/30 transition flex items-center justify-center"
        >
          <Edit className="mr-2 h-4 w-4" /> Edit
        </button>
        <button
          onClick={() => onDeleteClick(event._id, event.title)}
          className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg 
                     hover:bg-red-500/30 transition flex items-center justify-center"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </button>
        <button
          onClick={() => setIsPDFModalOpen(true)}
          className="flex-1 bg-green-500/20 text-green-400 px-4 py-2 rounded-lg 
                     hover:bg-green-500/30 transition flex items-center justify-center"
        >
          <FileText className="mr-2 h-4 w-4" /> Details
        </button>
      </div>
      <EventPDFModal
        event={event}
        isOpen={isPDFModalOpen}
        onClose={() => setIsPDFModalOpen(false)}
      />
    </div>
  );
};

const EventsGallery = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: null,
    eventTitle: "",
    isLoading: false,
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    event: null,
  });
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
  const openDeleteModal = (eventId, eventTitle) => {
    setDeleteModal({
      isOpen: true,
      eventId,
      eventTitle,
      isLoading: false,
    });
  };
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      eventId: null,
      eventTitle: "",
      isLoading: false,
    });
  };
  const openEditModal = (event) => {
    setEditModal({
      isOpen: true,
      event: event,
    });
  };
  const closeEditModal = () => {
    setEditModal({
      isOpen: false,
      event: null,
    });
  };
  const handleUpdateEvent = (updatedEvent) => {
    setEvents(
      events.map((event) =>
        event._id === updatedEvent._id ? updatedEvent : event
      )
    );
    closeEditModal();
  };
  const handleDelete = async () => {
    try {
      setDeleteModal({ ...deleteModal, isLoading: true });
      const token = localStorage.getItem("authToken");
      await axios.delete(
        `http://localhost:8800/api/events/${deleteModal.eventId}`,
        {
          headers: {
            token: token,
          },
        }
      );
      setEvents(events.filter((event) => event._id !== deleteModal.eventId));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting event:", error);
      setError("Failed to delete event. Please try again later.");
      setDeleteModal({ ...deleteModal, isLoading: false });
    }
  };

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
            <Link to={"/events/create"}>
              <button
                className="bg-orange-500 text-white px-6 py-3 rounded-full font-bold 
              flex items-center hover:bg-orange-600 transition transform hover:scale-105"
              >
                <Plus className="mr-2 h-5 w-5" /> Create Event
              </button>
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="text-center text-gray-400 text-2xl">
              No events found. Create your first event!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDeleteClick={openDeleteModal}
                  onEditClick={openEditModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        eventTitle={deleteModal.eventTitle}
        onClose={closeDeleteModal}
        onConfirmDelete={handleDelete}
        isLoading={deleteModal.isLoading}
      />
      <EditEventModal
        isOpen={editModal.isOpen}
        event={editModal.event}
        onClose={closeEditModal}
        onUpdateSuccess={handleUpdateEvent}
      />
    </div>
  );
};

export default EventsGallery;
