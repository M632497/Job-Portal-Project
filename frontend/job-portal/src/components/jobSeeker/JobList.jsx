import { Search } from "lucide-react";
import JobCard from "../../components/Cards/JobCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const JobList = ({ jobs, loading, viewMode, clearAllFilters, navigate, toggleSaveJob, applyToJob }) => {
  if (loading) return <LoadingSpinner />;

  if (jobs.length === 0) {
    return (
      <div className='text-center py-16 lg:py-20 bg-white/60 backdrop-blur-xl rounded-2xl border border-white/20'>
        <div className='text-gray-400 mb-6'>
          <Search className='w-16 h-16 mx-auto' />
        </div>
        <h3 className='text-xl lg:text-2xl font-bold text-gray-900 mb-3'>
          No Jobs Found
        </h3>
        <p className='text-gray-600 mb-6'>
          Try adjusting your search criteria or filters
        </p>
        <button
          onClick={clearAllFilters}
          className='bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors'
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div className={viewMode === "grid" ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-4 lg:gap-6" : "space-y-4 lg:space-y-6"}>
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          job={job}
          onClick={() => navigate(`/job/${job._id}`)}
          onToggleSave={() => toggleSaveJob(job._id, job.isSaved)}
          onApply={() => applyToJob(job._id)}
        />
      ))}
    </div>
  );
};

export default JobList;
