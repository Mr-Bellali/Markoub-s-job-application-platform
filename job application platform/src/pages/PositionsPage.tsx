import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import DataGrid from "../components/DataGrid"
import ApplySpontaneouslyModal from "../components/ApplySpontaneouslyModal"
import { getPositions } from "../services/positions"

const ApplicationsPage = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["positions", { page: 1, limit: 50 }],
    queryFn: () => getPositions(1, 50),
  })

  const [openModal, setOpenModal] = useState(false)

  const positions = data?.data ?? []

  return (
    <section className="w-full min-h-screen px-50 pt-20 flex flex-col items-center">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-10">
        Open Positions
      </h1>

      {/* Content */}
      <div className="w-full flex flex-col gap-10 flex-1">
        <div className="w-full flex flex-row items-center justify-between text-xl font-semibold">
          <h2>
            We have {positions.length} open positions
          </h2>
          <div>
            dropDown
          </div>
        </div>

        <DataGrid
          positions={positions}
          loading={isLoading}
          error={isError ? (error as Error).message : null}
        />
      </div>

      {/* Bottom CTA */}
      <div className="flex flex-col items-center gap-4 py-10">
        <p className="text-gray-600 text-lg">
          No matching role right now?
        </p>

        <button
          onClick={() => setOpenModal(true)}
          className="px-6 py-3 bg-[#ff6804] text-white rounded-xl font-semibold hover:bg-orange-400 transition-colors"
        >
          Apply spontaneously
        </button>
      </div>

      {/* Modal */}
      <ApplySpontaneouslyModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        positions={positions}
      />
    </section>
  )
}

export default ApplicationsPage
