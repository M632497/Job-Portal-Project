// components/common/ResumeRequiredModal.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const ResumeRequiredModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Resume Required
        </h2>
        <p className="text-gray-600 mb-6">
          You haven’t added your resume yet. Please add it in your profile before applying for a job.
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeRequiredModal;
