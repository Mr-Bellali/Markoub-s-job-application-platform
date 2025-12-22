import React from 'react'
import DataGrid from '../components/DataGrid'

const ApplicationsPage = () => {
    return (
        <section className='w-full h-screen px-50 pt-20 flex flex-col items-center gap-10'>
            <h1 className='text-4xl font-bold'>
                Open Positions
            </h1>
            <div className='w-full flex flex-row items-center justify-between text-xl font-semibold'>
                <h2 className=''>
                    We have x open positions
                </h2>
                <div>
                    dropDown
                </div>
            </div>
            <DataGrid />
        </section>
    )
}

export default ApplicationsPage