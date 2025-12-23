import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import Breadcrumb from '../components/shared/Breadcrumb';
import { ArrowLeft, Download, Briefcase, MapPin, Calendar, FileText } from 'lucide-react';
import { getApplicationById } from '../services/applications';

const ApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Fetch application details using React Query
  const { data: application, isLoading, isError, error } = useQuery({
    queryKey: ['application', id],
    queryFn: () => getApplicationById(Number(id)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const handleDownloadResume = () => {
    if (application?.resumeFileB64) {
      // Convert base64 to blob
      const byteCharacters = atob(application.resumeFileB64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = application.resumeFileName || 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleViewResume = () => {
    if (application?.resumeFileB64) {
      // Open PDF in new tab
      const byteCharacters = atob(application.resumeFileB64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full mx-auto px-12 py-8 flex justify-center items-center">
        <p>Loading application details...</p>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="w-full mx-auto px-12 py-8 flex justify-center items-center">
        <p className="text-red-500">
          Error loading application: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="w-full mx-auto px-12 py-8 flex justify-center items-center">
        <p>Application not found</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto px-12 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Applications', onClick: () => navigate('/applications') },
          { label: `Application #${id}` },
        ]}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate('/applications')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors w-fit"
      >
        <ArrowLeft size={20} />
        Back to Applications
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Profile Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {/* Candidate Profile Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ff6804] to-[#ff8a3d] mb-6">
              {/* Decorative blur */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/20 rounded-full blur-3xl" />

              <div className="relative flex flex-col items-center gap-4 px-6 py-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center ring-8 ring-white/30">
                    <span className="text-5xl font-extrabold text-[#ff6804]">
                      {application.candidate.fullName.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* User info */}
                <div className="flex flex-col gap-2 text-white text-center">
                  <div>
                    <h2 className="text-2xl font-bold leading-tight">
                      {application.candidate.fullName}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      {application.candidate.email}
                    </p>
                  </div>

                  {/* Applied date badge */}
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur text-sm font-semibold">
                      <Calendar size={14} />
                      Applied {formatDate(application.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Aliases if exist */}
                {application.candidate.aliases && (
                  <div className="w-full mt-2 px-4 py-3 bg-white/10 backdrop-blur rounded-lg">
                    <p className="text-white/70 text-xs font-medium mb-1">Also known as:</p>
                    <p className="text-white text-sm">{application.candidate.aliases}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#ff6804]/10 rounded-lg flex items-center justify-center">
                  <FileText className="text-[#ff6804]" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Resume</h3>
                  <p className="text-sm text-gray-500">{application.resumeFileName}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={handleViewResume}
                  disabled={!application.resumeFileB64}
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  View Resume
                </button>
                <button
                  onClick={handleDownloadResume}
                  disabled={!application.resumeFileB64}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#ff6804] text-white rounded-lg hover:bg-[#e55d03] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                >
                  <Download size={18} />
                  Download Resume
                </button>
              </div>

              {!application.resumeFileB64 && (
                <p className="text-sm text-red-500 mt-3 text-center">Resume file not available</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Application Details */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg p-8 flex flex-col gap-6">
            <h1 className="text-2xl font-bold text-gray-900">Application Details</h1>

            {/* Position Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Position Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Position Title</p>
                    <p className="font-medium text-gray-900">{application.position.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium text-gray-900">{application.position.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Work Type</p>
                    <p className="font-medium text-gray-900 capitalize">{application.position.workType}</p>
                  </div>
                </div>
                {application.position.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="text-gray-400" size={20} />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{application.position.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description in Markdown */}
            {application.position.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Job Description</h2>
                <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-strong:text-gray-900 prose-a:text-[#ff6804] hover:prose-a:text-[#e55d03]">
                  <ReactMarkdown>{application.position.description}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;