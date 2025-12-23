import { Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface DataGridProps {
    positions: any, 
    loading: boolean,
    error: string | null
}

const DataGrid = ({
    positions,
    loading,
    error
}: DataGridProps) => {
    const navigate = useNavigate()

    const handleApplyClick = (id: number) => {
        navigate(`/positions/${id}`)
    }

    if (loading) return <Loader className='animate-spin' size={24}/>
    if (error) return <div className="text-red-600">{error}</div>

    return (
        <div className="w-full flex flex-col">
            {positions.map((pos: any) => (
                <div
                    key={pos.id}
                    className="flex w-full justify-between items-center py-4 border-b border-b-gray-300"
                >
                    <div className="w-1/2">
                        <p className="font-medium">{pos.title}</p>
                        <p className="text-sm text-gray-600">{pos.category}</p>
                    </div>
                    <div>{pos.workType}</div>
                    <div>{pos.location || ''}</div>
                    <div>
                        <button
                            onClick={() => handleApplyClick(pos.id)}
                            className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            ))}

            {positions.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                    No open positions right now.
                </div>
            )}
        </div>
    )
}

export default DataGrid
