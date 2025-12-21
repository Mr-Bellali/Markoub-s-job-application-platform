import { UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getPaginatedAdmins, toggleAdminStatus } from '../services/admins';
import DataGrid, { type Column } from '../components/shared/Datagrid';
import Breadcrumb from '../components/shared/Breadcrumb';
import Pagination from '../components/shared/Pagination';
import CreateAdminDrawer from '../components/admins/CreateAdminDrawer';
import toast from 'react-hot-toast';

type Admin = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

const Admins = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const columns: Column<Admin>[] = [
    { 
      key: 'name', 
      header: 'Name',
      render: (admin) => `${admin.firstName} ${admin.lastName}`
    },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Role',
      render: (admin) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          admin.role === 'superadmin' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {admin.role === 'superadmin' ? 'Super Admin' : 'Standard'}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      header: 'Created',
      render: (admin) => formatDate(admin.createdAt)
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (admin) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleToggleStatus(admin.id);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            admin.status === 'active' ? 'bg-[#ff6804]' : 'bg-gray-300'
          }`}
          title={admin.status === 'active' ? 'Active - Click to deactivate' : 'Inactive - Click to activate'}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              admin.status === 'active' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      )
    },
  ];

  const fetchAdmins = async (page: number = 1) => {
    try {
      const response = await getPaginatedAdmins(page, limit, 'all');
      console.log('Fetched admins:', response);
      setAdmins(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.page || 1);
    } catch (err) {
      console.error('Error fetching admins:', err);
      toast.error('Failed to load admins');
    }
  };

  const handlePageChange = (page: number) => {
    fetchAdmins(page);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await toggleAdminStatus(id);
      toast.success(response.message || 'Admin status updated successfully');
      fetchAdmins(currentPage);
    } catch (err: any) {
      console.error('Error toggling admin status:', err);
      toast.error(err.response?.data?.error || 'Failed to update admin status');
    }
  };

  const handleRowClick = (admin: Admin) => {
    setSelectedAdmin(admin);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedAdmin(null);
  };

  const handleDrawerSuccess = () => {
    fetchAdmins(currentPage);
    const message = selectedAdmin ? 'Admin updated successfully' : 'Admin created successfully';
    toast.success(message);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="w-full mx-auto px-12 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Admins' },
        ]}
      />

      {/* Header */}
      <div className='w-full flex flex-row justify-between items-center'>
        <div>
        </div>
        <button
          onClick={() => {
            setSelectedAdmin(null);
            setIsDrawerOpen(true);
          }}
          className='flex items-center gap-2 px-6 py-3 bg-[#ff6804] text-white rounded-lg hover:bg-[#e55d03] transition-colors font-semibold'
        >
          <UserPlus size={20} />
          Add Admin
        </button>
      </div>

      <DataGrid 
        data={admins} 
        columns={columns}
        onRowClick={handleRowClick}
      />

      {totalPages > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <CreateAdminDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        onSuccess={handleDrawerSuccess}
        editAdmin={selectedAdmin}
      />
    </div>
  );
};

export default Admins;
