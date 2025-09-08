import { useState, useEffect } from "react";
import { Save, X, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";
import { BASE_URL } from "../../utils/apiPaths";

const UserProfile = () => {
  const { user, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "",
    resume: "",
  });

  const [uploading, setUploading] = useState({ avatar: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        resume: user.resume || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Show instant preview
  const previewUrl = URL.createObjectURL(file);
  setFormData((prev) => ({ ...prev, avatar: previewUrl }));
  setUploading({ avatar: true });

  try {
    const res = await uploadImage(file);

    const url = res.imageUrl || "";

    if (url) {
      setFormData((prev) => ({ ...prev, avatar: url }));
      updateUser({ ...formData, avatar: url }); // keep AuthContext in sync
      toast.success("Avatar updated!");
    } else {
      toast.error("Upload failed: No URL received");
    }
  } catch (err) {
    console.error(err);
    toast.error("Avatar upload failed");
  } finally {
    setUploading({ avatar: false });
  }
};


  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const form = new FormData();
    form.append("resume", file);
    setSaving(true);
    try {
      const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200) {
        toast.success("Resume uploaded successfully!");
       const newResumeUrl = res.data.resume;
setFormData((prev) => ({ ...prev, resume: newResumeUrl }));
updateUser({ ...user, resume: newResumeUrl }); // use current user, not old formData

      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload resume");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!formData.resume) return;
    setSaving(true);
    try {
      const res = await axiosInstance.delete(API_PATHS.AUTH.DELETE_RESUME, {
        resumeUrl: formData.resume,
      });
      if (res.status === 200) {
        toast.success("Resume deleted successfully!");
        setFormData((prev) => ({ ...prev, resume: "" }));
        updateUser({ ...formData, resume: "" });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
  try {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name || "");
    formDataToSend.append("companyName", formData.companyName || "");
    formDataToSend.append("companyDescription", formData.companyDescription || "");

    if (formData.avatar instanceof File) {
      formDataToSend.append("avatar", formData.avatar);
    }
    if (formData.resume instanceof File) {
      formDataToSend.append("resume", formData.resume);
    }
    if (formData.companyLogo instanceof File) {
      formDataToSend.append("companyLogo", formData.companyLogo);
    }

    const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, formDataToSend, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Profile updated successfully");
    console.log("Profile updated:", res.data);

    if (res.data) {
      updateUser(res.data);  
    }
  } catch (err) {
    console.error("Update failed:", err);
    toast.error("Failed to update profile");
  }
};

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        resume: user.resume || "",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="py-8 px-4 lg:m-20">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-blue-500 px-6 py-4 text-white text-xl font-medium">Profile</div>
          <div className="p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-6">
              <img
                src={formData.avatar?.startsWith("http") 
      ? formData.avatar 
      : `${BASE_URL}/${formData.avatar}`}
    alt="avatar"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
              <div>
                <label className="cursor-pointer bg-blue-50 text-blue-700 px-4 py-2 rounded hover:bg-blue-100 transition">
                  Choose file
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded bg-gray-100"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="block text-gray-700 mb-1">Resume</label>
              {formData.resume ? (
                <div className="flex items-center justify-between">
                  <a
                    href={formData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {formData.resume.split("/").pop()}
                  </a>
                  <button onClick={handleDeleteResume}>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              ) : (
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="w-full text-gray-500 file:py-2 file:px-4 file:bg-blue-50 file:text-blue-700 file:rounded hover:file:bg-blue-100"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Link
                to="/find-jobs"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Cancel</span>
              </Link>
              <button
                onClick={handleSave}
                disabled={saving || uploading.avatar}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
