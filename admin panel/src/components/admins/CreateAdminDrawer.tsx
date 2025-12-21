import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { createAdmin, updateAdmin } from '../../services/admins';
import { createAdminSchema } from '../../types/admin.validator';
import CustomSelect from '../shared/CustomSelect';

interface Admin {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
}

interface CreateAdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editAdmin?: Admin | null;
}

const CreateAdminDrawer = ({ isOpen, onClose, onSuccess, editAdmin }: CreateAdminDrawerProps) => {
  const [isClosing, setIsClosing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'standard',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    role?: string;
  }>({});

  useEffect(() => {
    if (editAdmin) {
      setFormData({
        firstName: editAdmin.firstName,
        lastName: editAdmin.lastName,
        email: editAdmin.email,
        password: '',
        role: editAdmin.role,
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'standard',
      });
    }
    setErrors({});
    setError(null);
  }, [editAdmin, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // For edit mode, allow empty password
    const dataToValidate = editAdmin && !formData.password 
      ? { ...formData, password: 'dummypassword123' } 
      : formData;

    // Validate with Zod
    const validation = createAdminSchema.safeParse(dataToValidate);

    if (!validation.success) {
      const fieldErrors: {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        role?: string;
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
      if (editAdmin) {
        // Update existing admin
        const updateData: any = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        };
        // Only include password if it was changed
        if (formData.password) {
          updateData.password = formData.password;
        }
        await updateAdmin(editAdmin.id, updateData);
      } else {
        // Create new admin
        await createAdmin(formData);
      }
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'standard',
      });
      onSuccess();
      handleClose();
    } catch (err: any) {
      console.error(`Error ${editAdmin ? 'updating' : 'creating'} admin:`, err);
      setError(err.response?.data?.error || err.message || `Failed to ${editAdmin ? 'update' : 'create'} admin`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 transition-opacity z-40 ${
          isClosing ? 'bg-opacity-0' : 'bg-opacity-30'
        }`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto transition-transform duration-300 ${
        isClosing ? 'translate-x-full' : 'animate-slide-left'
      }`}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{editAdmin ? 'Edit Admin' : 'Create New Admin'}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="text-gray-700 font-medium mb-2 block">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                errors.firstName
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
              }`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mb-4">{errors.firstName}</p>
            )}
            {!errors.firstName && <div className="mb-4" />}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="text-gray-700 font-medium mb-2 block">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                errors.lastName
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
              }`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mb-4">{errors.lastName}</p>
            )}
            {!errors.lastName && <div className="mb-4" />}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-gray-700 font-medium mb-2 block">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                  : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
              }`}
              placeholder="john.doe@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-4">{errors.email}</p>
            )}
            {!errors.email && <div className="mb-4" />}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-gray-700 font-medium mb-2 block">
              Password {editAdmin ? '(leave blank to keep current)' : '*'}
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full border rounded-xl p-4 pr-12 mb-2 focus:outline-none focus:ring-2 transition-colors ${
                  errors.password
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                }`}
                placeholder="SecurePassword123"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mb-4">{errors.password}</p>
            )}
            {!errors.password && <div className="mb-4" />}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="text-gray-700 font-medium mb-2 block">
              Role *
            </label>
            <CustomSelect
              value={formData.role}
              onChange={(value) => handleSelectChange('role', value)}
              options={[
                { value: 'standard', label: 'Standard Admin' },
                { value: 'superadmin', label: 'Super Admin' },
              ]}
              error={!!errors.role}
            />
            {errors.role && (
              <p className="text-red-500 text-sm mb-4">{errors.role}</p>
            )}
            {!errors.role && <div className="mb-4" />}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#ff6804] text-white rounded-lg hover:bg-[#e55d03] transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (editAdmin ? 'Updating...' : 'Creating...') : (editAdmin ? 'Update Admin' : 'Create Admin')}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAdminDrawer;
