import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import DataGrid from "../components/DataGrid"
import ApplySpontaneouslyModal from "../components/ApplySpontaneouslyModal"
import { getPositions } from "../services/positions"
import CustomSelect from "../components/customSelect"

const PositionsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [openModal, setOpenModal] = useState(false)

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["positions", { page: 1, limit: 50, category: selectedCategory === "all" ? undefined : selectedCategory }],
    queryFn: () => getPositions(1, 50, selectedCategory === "all" ? undefined : selectedCategory),
  })

  const positions = data?.data ?? []

  // Extract unique categories from positions
  const categoryOptions = useMemo(() => {
    // Get all unique categories from the fetched positions
    const allPositionsData = positions
    const uniqueCategories = new Set<string>()
    
    allPositionsData.forEach((position) => {
      if (position.category) {
        uniqueCategories.add(position.category)
      }
    })

    // Create options array with "All Departments" first
    const options = [
      { value: "all", label: "All Departments" },
      ...Array.from(uniqueCategories)
        .sort()
        .map((category) => ({
          value: category,
          label: category,
        })),
    ]

    return options
  }, [positions])

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
          <div className="w-64">
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="Filter by department"
            />
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

export default PositionsPage