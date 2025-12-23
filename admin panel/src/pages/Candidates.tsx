import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPaginatedCandidates } from '../services/candidates';
import DataGrid, { type Column } from '../components/shared/Datagrid';
import Breadcrumb from '../components/shared/Breadcrumb';
import Pagination from '../components/shared/Pagination';

type Candidate = {
  id: number;
  fullName: string;
  email: string;
  aliases: string | null;
  applicationCount: number;
};

const Candidates = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch candidates using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['candidates', currentPage, limit],
    queryFn: () => getPaginatedCandidates(currentPage, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const columns: Column<Candidate>[] = [
    { key: 'fullName', header: 'Full Name' },
    { key: 'email', header: 'Email' },
    { 
      key: 'aliases', 
      header: 'Aliases',
      render: (candidate) => candidate.aliases || 'N/A'
    },
    { 
      key: 'applicationCount', 
      header: 'Applications',
      render: (candidate) => candidate.applicationCount.toString()
    },
  ];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full mx-auto px-12 py-8 flex justify-center items-center">
        <p>Loading candidates...</p>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="w-full mx-auto px-12 py-8 flex justify-center items-center">
        <p className="text-red-500">
          Error loading candidates: {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    );
  }

  const candidates = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="w-full mx-auto px-12 py-8 flex flex-col gap-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Candidates' },
        ]}
      />

      {/* Header for search and filters  */}
      <div className='w-full flex flex-row justify-between items-center'>
        <div
        // className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg'
        >
          {/* <Search size={20} className='text-gray-400' />
          <input
            type='text'
            placeholder='Search candidates...'
            className='outline-none'
          /> */}
        </div>
      </div>
      <DataGrid data={candidates} columns={columns} />
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

export default Candidates;