import { Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPaginatedPositions } from '../services/positions';
import DataGrid from '../components/shared/Datagrid';
import Breadcrumb from '../components/shared/Breadcrumb';
import Pagination from '../components/shared/Pagination';

type Position = {
  id: number;
  title: string;
  category: string;
  workType: string;
  location: string | null;
  createdAt: Date;
  updatedAt: Date;
};

const Positions = () => {
  const navigate = useNavigate();
  // State to fill with gotten positions
  const [positions, setPositions] = useState<Position[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);

  const fetchPositions = async (page: number = 1) => {
    try {
      // setIsLoading(true);
      const response = await getPaginatedPositions(page, limit);
      console.log('Fetched positions:', response);
      setPositions(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(response.page || 1);
    } catch (err) {
      console.error('Error fetching positions:', err);
      // setError(err instanceof Error ? err.message : 'Failed to load positions');
    } finally {
      // setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    fetchPositions(page);
  };

  useEffect(() => {
    // Fetch positions
    fetchPositions();
  }, []);

  return (
    <div className="w-full mx-auto px-12 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Positions' },
        ]}
      />

      {/* Header for the create position button and filter  */}
      <div className='w-full flex flex-row justify-between items-center'>
        <div
        // className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg'
        >
          {/* <Search size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search positions...'
            className='outline-none'
          /> */}
        </div>
        <button
          onClick={() => navigate('/positions/create')}
          className='flex items-center gap-2 px-6 py-3 bg-[#ff6804] text-white rounded-lg hover:bg-[#e55d03] transition-colors font-semibold'
        >
          <Plus size={20} />
          Create Position
        </button>
      </div>
      <DataGrid data={positions} />
      {totalPages > 0 && (
        <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Positions;