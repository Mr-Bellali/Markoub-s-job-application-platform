import React from 'react'

export interface Column<T = any> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  width?: string;
}

interface DataGridProps<T = any> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
}

const DataGrid = <T extends { id: number | string }>({ 
  data, 
  columns, 
  onRowClick 
}: DataGridProps<T>) => {
  return (
    <div className='w-full h-full flex justify-center items-center'>
      <div className='w-full rounded-xl overflow-hidden border border-gray-300 bg-white'>
        <table className='w-full border-collapse'>
          <thead>
            <tr className='w-full h-12 bg-[#ff6804] text-white'>
              {columns.map((column, index) => (
                <th 
                  key={column.key}
                  className={`pl-3 text-start border-b border-gray-300 ${
                    index < columns.length - 1 ? 'border-r' : ''
                  }`}
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length} 
                  className="text-center py-8 text-gray-500"
                >
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => {
                const isLastRow = rowIndex === data.length - 1;
                return (
                  <tr 
                    key={row.id} 
                    onClick={() => onRowClick?.(row)}
                    className={`transition-colors ${
                      onRowClick ? 'hover:bg-gray-50 cursor-pointer' : 'hover:bg-gray-50'
                    }`}
                  >
                    {columns.map((column, colIndex) => (
                      <td 
                        key={column.key}
                        className={`pl-3 py-3 ${
                          colIndex < columns.length - 1 ? 'border-r' : ''
                        } ${!isLastRow ? 'border-b' : ''} border-gray-300`}
                      >
                        {column.render 
                          ? column.render(row) 
                          : (row as any)[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataGrid