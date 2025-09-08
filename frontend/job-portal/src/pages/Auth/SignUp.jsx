import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Upload, Eye, EyeOff, UserCheck, Building2, Loader, AlertCircle, CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosinstance';
import uploadImage from '../../utils/uploadImage';
import { validateEmail, validatePassword, validateAvatar } from '../../utils/helper';

const SignUp = () => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    avatar: null,
  });

  const [formState, setFormState] = useState({
    loading: false,
    errors: {},
    showPassword: false,
    avatarPreview: null,
    success: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, [name]: '' }
      }));
    }
  };

  const handleRoleChange = (role) => {
    setFormData(prev => ({ ...prev, role }));
    if (formState.errors.role) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, role: '' }
      }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const error = validateAvatar(file);
    if (error) {
      setFormState(prev => ({
        ...prev,
        errors: { ...prev.errors, avatar: error }
      }));
      return;
    }

    setFormData(prev => ({ ...prev, avatar: file }));

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormState(prev => ({
        ...prev,
        avatarPreview: e.target.result,
        errors: { ...prev.errors, avatar: '' }
      }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {
      name: !formData.name ? "Enter full name" : "",
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
      role: !formData.role ? "Please select a role" : "",
      avatar: "",
    };

    Object.keys(errors).forEach(key => { if (!errors[key]) delete errors[key]; });
    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setFormState(prev => ({ ...prev, loading: true }));

  try {
    let avatarUrl = "";

    // 1️⃣ Upload avatar if exists
    if (formData.avatar) {
      const imgRes = await uploadImage(formData.avatar);
      avatarUrl = imgRes.imageUrl || "";
    }

    // 2️⃣ Register user
    await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      avatar: avatarUrl,
    });

    // 3️⃣ Login user automatically
    const loginRes = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
  email: formData.email,
  password: formData.password,
});

const { token, _id, name, email, avatar, role, companyName, companyDescription, companyLogo, resume } = loginRes.data;

// Send user object to context
login({ _id, name, email, avatar, role, companyName, companyDescription, companyLogo, resume }, token);


      // 4️⃣ Show success message and redirect
      setFormState(prev => ({
        ...prev,
        loading: false,
        success: true,
        errors: {},
      }));

      setTimeout(() => {
        // redirect to dashboard
        window.location.href = role === "employer" ? "/employer-dashboard" : "/find-jobs";
      }, 1500);
    }
    catch (error) {
    setFormState(prev => ({
      ...prev,
      loading: false,
      errors: {
        submit: error.response?.data?.message || "Registration failed. Try again."
      }
    }));
  }
};



  if (formState.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-400 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
          <p className="text-gray-600 mb-4">Welcome to JobPortal!</p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Create Account</h2>
          <p className="text-sm text-gray-600">Join thousands of professionals finding their dream jobs</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your full name"
              />
            </div>
            {formState.errors.name && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Enter your email"
              />
            </div>
            {formState.errors.email && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={formState.showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${formState.errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setFormState(prev => ({ ...prev, showPassword: !prev.showPassword }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {formState.showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formState.errors.password && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.password}
              </p>
            )}
          </div>

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture (Optional)</label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formState.avatarPreview ? (
                  <img src={formState.avatarPreview} alt="Avatar preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <input type="file" id="avatar" accept=".jpg,.jpeg,.png" onChange={handleAvatarChange} className="hidden" />
                <label htmlFor="avatar" className="cursor-pointer bg-gray-50 border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload photo</span>
                </label>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 5MB</p>
              </div>
            </div>
            {formState.errors.avatar && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.avatar}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">I am a *</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleRoleChange("jobseeker")}
                className={`p-4 rounded-lg border-2 transition-all ${formData.role === "jobseeker" ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <UserCheck className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Job Seeker
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleRoleChange("employer")}
                className={`p-4 rounded-lg border-2 transition-all ${formData.role === "employer" ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Building2 className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">Employer</div>
              </button>
            </div>
            {formState.errors.role && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.role}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={formState.loading}
              className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${formState.loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {formState.loading ? (
                <Loader className="w-5 h-5 mx-auto animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
            {formState.errors.submit && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {formState.errors.submit}
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SignUp;
