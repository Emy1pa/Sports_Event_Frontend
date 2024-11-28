import React from "react";
import { Trash2, X } from "lucide-react";

const DeleteConfirmModal = ({
  isOpen,
  eventTitle,
  onClose,
  onConfirmDelete,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white/10 border border-white/20 rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-red-500 flex items-center">
            <Trash2 className="mr-2 h-6 w-6" /> Confirm Delete
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
            disabled={isLoading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the event
          <span className="font-bold text-white ml-1">{eventTitle}</span>? This
          action cannot be undone.
        </p>

        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-600/20 text-gray-300 px-4 py-2 rounded-lg 
                       hover:bg-gray-600/30 transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={onConfirmDelete}
            className="flex-1 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg 
                       hover:bg-red-500/30 transition flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse">Deleting...</span>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
