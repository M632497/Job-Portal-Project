import { useState, useEffect } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import axiosInstance from '../../utils/axiosinstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

import FilterContent from '../../components/jobSeeker/FilterContent';
import SeachHeader from '../../components/jobSeeker/SeachHeader';
import Navbar from '../../components/layout/Navbar';
import ResumeRequiredModal from "../../components/common/ResumeRequiredModal";
import JobList from "../../components/jobSeeker/JobList"; 

const JobSeekerDashboard = () => {
  const [showResumeModal, setShowResumeModal] = useState(false);
  const { user } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: [],
    type: [],
    minSalary: "",
    maxSalary: "",
    experience: "",
    remoteOnly: false,
  });

  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  // 🔹 Fetch jobs
  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location) params.append("location", filterParams.location);
      if (filterParams.minSalary) params.append("minSalary", filterParams.minSalary);
      if (filterParams.maxSalary) params.append("maxSalary", filterParams.maxSalary);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.category) params.append("category", filterParams.category);

      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`
      );

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs. Please try again later.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch jobs when filters or user changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const apiFilters = {
        keyword: filters.keyword,
        location: filters.location,
        minSalary: filters.minSalary,
        maxSalary: filters.maxSalary,
        category: filters.category,
        type: filters.type,
        experience: filters.experience,
        remoteOnly: filters.remoteOnly,
      };

      const hasFilters = Object.values(apiFilters).some(
        (value) => value !== "" && value !== false && value !== null && value !== undefined
      );

      if (hasFilters) {
        fetchJobs(apiFilters);
      } else {
        fetchJobs();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  // 🔹 Handlers
  const handleFilterChange = (key, value, isMulti = false) => {
  if (isMulti) {
    setFilters((prev) => {
      const prevValues = prev[key] || [];
      // toggle selection
      const newValues = prevValues.includes(value)
        ? prevValues.filter((v) => v !== value) // remove if already selected
        : [...prevValues, value]; // add if not selected
      return { ...prev, [key]: newValues };
    });
  } else {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }
};

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: [],
      type: [],
      minSalary: "",
      maxSalary: "",
      experience: "",
      remoteOnly: ""
    });
  };

  const toggleSaveJob = async (jobId, isSaved) => {
    try {
      if (isSaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job unsaved successfully!");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully!");
      }
      fetchJobs();
    } catch (err) {
      toast.success("Job already saved!");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      if (!user?.resume) {
        setShowResumeModal(true);
        return;
      }

      if (jobId) {
        await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
        toast.success("Applied to job successfully!");
      }
      fetchJobs();
    } catch (err) {
      const errorMsg = err?.response?.data?.message;
      toast.error(errorMsg || "Something went wrong! Try again later");
    }
  };

  return (
    <div className='bg-gradient-to-br from-blue-50 via-white to-purple-50'>
      <Navbar />
      <div className='min-h-screen mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8'>
          {/* Search bar */}
          <SeachHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
          />

          <div className='flex gap-6 lg:gap-8'>
            {/* Sidebar filters */}
            <div className='hidden lg:block w-80 flex-shrink-0'>
              <div className='bg-white/80 backdrp-blur-xl rounded-2xl shadow-lg border border-white/20 p-6 sticky top-20'>
                <h3 className='font-bold text-gray-900 text-xl mb-6'>
                  Filter Jobs
                </h3>
                <FilterContent
                  toggleSection={toggleSection}
                  clearAllFilters={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Job listings */}
            <div className='flex-1 min-w-0'>
              <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4'>
                <div>
                  <p className='text-gray-600 text-sm lg:text-base'>
                    showing{" "}
                    <span className='font-bold text-gray-900'>
                      {jobs.length}
                    </span>{" "}
                    jobs
                  </p>
                </div>

                <div className='flex items-center justify-between lg:justify-end gap-4'>
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className='lg:hidden flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50 transition-colors'
                  >
                    <Filter className='w-4 h-4' />
                    Filters
                  </button>

                  <div className='flex items-center gap-3 lg:gap-4'>
                    <div className='flex items-center border border-gray-200 rounded-xl p-1 bg-white'>
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                      >
                        <Grid className='w-4 h-4' />
                      </button>

                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
                      >
                        <List className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <JobList
                jobs={jobs}
                loading={loading}
                viewMode={viewMode}
                clearAllFilters={clearAllFilters}
                navigate={navigate}
                toggleSaveJob={toggleSaveJob}
                applyToJob={applyToJob}
              />
            </div>
          </div>
        </div>
      </div>

      <ResumeRequiredModal
        open={showResumeModal}
        onClose={() => setShowResumeModal(false)}
      />
    </div>
  );
};

export default JobSeekerDashboard;
