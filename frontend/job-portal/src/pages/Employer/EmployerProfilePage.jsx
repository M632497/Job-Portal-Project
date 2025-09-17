import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Building2, Mail, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; 
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import uploadImage from '../../utils/uploadImage';
import EditProfileDetails from './EditProfileDetails';

const EmployerProfilePage = () => {

    const { user, updateUser } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    companyLogo: user?.companyLogo || "",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [uploading, setUploading] = useState({ avatar: false, logo: false });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        avatar: user.avatar || "",
        companyName: user.companyName || "",
        companyDescription: user.companyDescription || "",
        companyLogo: user.companyLogo || "",
      });
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (type === "avatar") {
      setFormData((prev) => ({ ...prev, avatar: previewUrl, avatarFile: file }));
    } else if (type === "logo") {
      setFormData((prev) => ({ ...prev, companyLogo: previewUrl, companyLogoFile: file }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let avatarUrl = formData.avatar;
      let companyLogoUrl = formData.companyLogo;

      if (formData.avatarFile) {
        avatarUrl = await uploadImage(formData.avatarFile);
      }
      if (formData.companyLogoFile) {
        companyLogoUrl = await uploadImage(formData.companyLogoFile);
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, {
        name: formData.name,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        avatarUrl,
        companyLogoUrl,
      });

      if (response.status === 200) {
        toast.success("Profile updated!");
        setProfileData({ ...profileData, ...response.data });
        updateUser(response.data);
        setEditMode(false);
      }
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Profile update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setEditMode(false);
  };

  if (editMode) {
    return (
      <EditProfileDetails
        formData={formData}
        handleImageChange={handleImageChange}
        handleInputChange={handleInputChange}
        handleSave={handleSave}
        handleCancel={handleCancel}
        saving={saving}
        uploading={uploading}
      />
    );
  }

  return (
    <DashboardLayout activeMenu='company-profile'>
      <div className='min-h-screen bg-gray-50 py-8 px-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-white rounded-xl shadow-lg overflow-hidden'>
            <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex justify-between items-center'>
              <h1 className='text-xl font-medium text-white'>
                Employer Profile
              </h1>
              <button
              onClick={() => setEditMode(true)}
              className='bg-white/10 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 cursor-pointer'
              >
                <Edit3 className='w-4 h-4' />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className='p-8'>
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='space-y-6'>
                  <h2 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2'>
                    Personal Information
                  </h2>

                  <div className='flex items-center space-x-4'>
                    <img
                    src={profileData.avatar}
                    alt='Avatar'
                    className='w-20 h-20 rounded-full object-cover border-4 border-blue-500' />
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {profileData.name}
                      </h3>
                      <div className='flex items-center text-sm text-gray-600 mt-1'>
                        <Mail className='w-4 h-4 mr-2' />
                        <span>{profileData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-6'>
                  <h2 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2'>
                    Company Information
                  </h2>
                  <div className='flex items-center space-x-4'>
                    <img 
                    src={profileData.companyLogo}
                    alt='companylogo'
                    className='w-20 h-20 rounded-lg object-cover border-4 border-blue-50'
                    />
                    <div>
                      <h3 className='text-lg font-semibold text-gray-800'>
                        {profileData.companyName}
                      </h3>
                      <div className='flex items-center text-sm text-gray-600 mt-1'>
                        <Building2 className='w-4 h-4 mr-2' />
                        <span>Company</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mt-8'>
                <h2 className='text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2 mb-6'>
                  About Company
                </h2>
                <p className='text-sm text-gray-700 leading-relaxed bg-gray-50 p-6 rounded-lg'>{profileData.companyDescription}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployerProfilePage
