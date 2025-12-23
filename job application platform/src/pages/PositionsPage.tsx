import DataGrid from "../components/DataGrid"
import { getPositions } from "../services/positions"
import { useQuery } from "@tanstack/react-query"

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

  const positions = data?.data ?? []

  return (
    <section className="w-full h-screen px-50 pt-20 flex flex-col items-center gap-10">
      <h1 className="text-4xl font-bold">
        Open Positions
      </h1>

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
    </section>
  )
}

export default ApplicationsPage