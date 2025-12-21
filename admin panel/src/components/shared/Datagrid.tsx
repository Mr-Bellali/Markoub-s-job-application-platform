import React from 'react'

interface DataGridProps {
  data: any,
}

const DataGrid = ({ data }: DataGridProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-full rounded-xl overflow-hidden border border-gray-300 bg-white'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='w-full h-12 bg-[#ff6804] text-white'>
              <th className='pl-3 text-start border-r border-b border-gray-300'>Title</th>
              <th className='pl-3 text-start border-r border-b border-gray-300'>Category</th>
              <th className='pl-3 text-start border-r border-b border-gray-300'>Work type</th>
              <th className='pl-3 text-start border-r border-b border-gray-300'>Location</th>
              <th className='pl-3 text-start border-b border-gray-300'>Creation date</th>
            </tr>
          </thead>
          <tbody>
            {data.map((position: any, index: number) => {
              const isLastRow = index === data.length - 1;
              return (
                <tr key={position.id} className='hover:bg-gray-50 transition-colors'>
                  <td className={`pl-3 py-3 border-r ${!isLastRow ? 'border-b' : ''} border-gray-300`}>{position.title}</td>
                  <td className={`pl-3 py-3 border-r ${!isLastRow ? 'border-b' : ''} border-gray-300`}>{position.category}</td>
                  <td className={`pl-3 py-3 border-r ${!isLastRow ? 'border-b' : ''} border-gray-300`}>{position.workType}</td>
                  <td className={`pl-3 py-3 border-r ${!isLastRow ? 'border-b' : ''} border-gray-300`}>{position.location || 'N/A'}</td>
                  <td className={`pl-3 py-3 ${!isLastRow ? 'border-b' : ''} border-gray-300`}>{formatDate(position.createdAt)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataGrid