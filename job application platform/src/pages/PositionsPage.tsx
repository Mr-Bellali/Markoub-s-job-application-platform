import React, { useEffect, useState } from 'react'
import DataGrid from '../components/DataGrid'
import { getPositions } from '../services/positions';

const ApplicationsPage = () => {
    const [positions, setPositions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    console.log("positions ?", positions);

    return (
        <section className='w-full h-screen px-50 pt-20 flex flex-col items-center gap-10'>
            <h1 className='text-4xl font-bold'>
                Open Positions
            </h1>
            <div className='w-full flex flex-row items-center justify-between text-xl font-semibold'>
                <h2 className=''>
                    We have {positions.length} open positions
                </h2>
                <div>
                    dropDown
                </div>
            </div>
            <DataGrid positions={positions} error={error} loading={loading} />
        </section>
    )
}

export default ApplicationsPage