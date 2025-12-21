import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Loader, Save, X } from 'lucide-react';
import Breadcrumb from '../components/shared/Breadcrumb';
import CustomSelect from '../components/shared/CustomSelect';
import { createPosition } from '../services/positions';
import { createPositionSchema } from '../types/position.validator';

const CreatePosition = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    workType: 'onsite',
    location: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    workType?: string;
    location?: string;
    description?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error when user changes selection
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrors({});

    // Validate with Zod
    const validation = createPositionSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: {
        title?: string;
        category?: string;
        workType?: string;
        location?: string;
        description?: string;
      } = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof fieldErrors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      await createPosition(formData);
      navigate('/positions');
    } catch (err) {
      console.error('Error creating position:', err);
      setError(err instanceof Error ? err.message : 'Failed to create position');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full px-12 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb
          items={[
            { label: 'Positions', path: '/positions' },
            { label: 'Create Position' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Position</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to create a new job position</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>

          {/* Title */}
          <div>
            <label htmlFor="title" className="text-gray-700 font-medium mb-2 block">
              Position Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                errors.title
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
              }`}
              placeholder="e.g., Junior Full-Stack Developer"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mb-4">{errors.title}</p>
            )}
            {!errors.title && <div className="mb-4" />}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="text-gray-700 font-medium mb-2 block">
              Category *
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                errors.category
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
              }`}
              placeholder="e.g., Software Engineering"
            />
            {errors.category && (
              <p className="text-red-500 text-sm mb-4">{errors.category}</p>
            )}
            {!errors.category && <div className="mb-4" />}
          </div>

          {/* Work Type and Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="workType" className="text-gray-700 font-medium mb-2 block">
                Work Type *
              </label>
              <CustomSelect
                value={formData.workType}
                onChange={(value) => handleSelectChange('workType', value)}
                options={[
                  { value: 'onsite', label: 'On-site' },
                  { value: 'remote', label: 'Remote' },
                  { value: 'hybrid', label: 'Hybrid' },
                  { value: 'freelancer', label: 'Freelancer' },
                ]}
                error={!!errors.workType}
              />
              {errors.workType && (
                <p className="text-red-500 text-sm mb-4">{errors.workType}</p>
              )}
              {!errors.workType && <div className="mb-4" />}
            </div>

            <div>
              <label htmlFor="location" className="text-gray-700 font-medium mb-2 block">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                  errors.location
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                }`}
                placeholder="e.g., Casablanca, Morocco"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mb-4">{errors.location}</p>
              )}
              {!errors.location && <div className="mb-4" />}
            </div>
          </div>
        </div>

        {/* Description Section - Split View */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Editor */}
            <div className="flex flex-col">
              <label htmlFor="description" className="text-gray-700 font-medium mb-2 block">
                Markdown Editor *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`w-full h-[500px] border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors font-mono text-sm resize-none ${
                  errors.description
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                }`}
                placeholder="## About the Role&#10;&#10;Describe the position here...&#10;&#10;## Responsibilities&#10;&#10;- First responsibility&#10;- Second responsibility&#10;&#10;## Requirements&#10;&#10;- First requirement&#10;- Second requirement"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
            </div>

            {/* Preview */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-2 block">
                Preview
              </label>
              <div className="w-full h-[500px] border border-[#e7e7e7] rounded-xl p-4 overflow-y-auto bg-gray-50">
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown>{formData.description || ''}</ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-[#ff6804] text-white rounded-lg hover:bg-[#e55d03] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed mb-5 cursor-pointer hover:bg-orange-300"
          >
            {isSubmitting ? <Loader className="animate-spin" size={24} />  : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePosition;
