import React, { useEffect, useState } from 'react'
import { getPositions } from '../services/positions'
import { applyToPosition } from '../services/applications'

const DataGrid = () => {
    const [positions, setPositions] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [showFormFor, setShowFormFor] = useState<number | null>(null)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [applying, setApplying] = useState(false)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const res = await getPositions(1, 50)
                setPositions(res.data || [])
            } catch (err: any) {
                setError(err?.message || 'Failed to load positions')
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const handleApplyClick = (id: number) => {
        setShowFormFor(id)
        setName('')
        setEmail('')
        setFile(null)
    }

    const handleSubmit = async (positionId: number) => {
        if (!file) return alert('Please select a PDF resume')
        setApplying(true)
        try {
            await applyToPosition(positionId, name, email, file)
            alert('Application submitted — thank you!')
            setShowFormFor(null)
        } catch (err: any) {
            alert(err?.response?.data?.error || err?.message || 'Failed to submit')
        } finally {
            setApplying(false)
        }
    }

    if (loading) return <div>Loading positions…</div>
    if (error) return <div className='text-red-600'>{error}</div>

    return (
        <div className='w-full flex flex-col'>
            {positions.map((pos) => (
                <div key={pos.id} className='flex w-full justify-between flex-row items-center py-4 border-b border-b-gray-300'>
                    <div className='w-1/2'>
                        <p className='font-medium'>{pos.title}</p>
                        <p className='text-sm text-gray-600'>{pos.category}</p>
                    </div>
                    <div>{pos.workType}</div>
                    <div>{pos.location || ''}</div>
                    <div>
                        <button onClick={() => handleApplyClick(pos.id)} className='px-4 py-2 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50'>
                            Apply
                        </button>
                    </div>
                </div>
            ))}
            {positions.length === 0 && <div className='py-6 text-center text-gray-500'>No open positions right now.</div>}
        </div>
    )
}

export default DataGrid