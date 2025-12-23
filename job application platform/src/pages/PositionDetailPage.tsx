import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown';
import { getPosition } from "../services/positions";
import PositionSkeleton from "../components/PositionDetailSkeleton";

const ApplicationDetailPage = () => {
  const navigate = useNavigate();
  // Get the id from param
  const { id } = useParams<{ id: string }>()

  const {
    data: position,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["position", id],
    queryFn: () => getPosition(Number(id)),
    enabled: !!id, // 👈 important
  })

  if(isLoading){
    return <PositionSkeleton />
  }

  if (isError || !position) {
    return <p className="p-10 text-red-500">Position not found</p>
  }

  const handleBackClick = () => {
    navigate('/');
  }

  const handleSubmit = () => {

  }

  return (
    <div className="w-full h-screen px-50 pt-10 flex flex-col items-center gap-10">
      {/* Header */}
      <div className="w-full flex flex-row justify-start items-center">
        <p className="cursor-pointer flex flex-row gap-2 font-semibold"
          onClick={() => handleBackClick()}
        >
          <ChevronLeft size={24} />
          <span>Browse all open positions</span>
        </p>
      </div>
      {/* Main container */}
      <section className="w-full flex flex-row gap-5">
        {/* position card */}
        <div className="flex flex-col justify-between gap-2 items-start px-4 py-5 bg-[#fafbfc] rounded-xl min-w-100 h-40">
          <div>
            {/* Job title */}
            <h1 className="text-2xl font-bold">
              {position.title}
            </h1>
            {/* Job type and location */}
            <p className="text-sm text-gray-600">
              {position.workType} {position.location && `- ${position.location}`}
            </p>
          </div>
          {/* Apply button */}
          <button className="px-2 py-1 bg-[#fe6a00] text-white rounded-sm cursor-pointer">
            Apply
          </button>
        </div>
        {/* Job detail & apply form */}
        <div className="w-full p-5 flex flex-col gap-5">
          <ReactMarkdown>
            {position.description || "_No description provided_"}
          </ReactMarkdown>
          {/* Application form */}
          <form className="flex flex-col items-center justify-center w-full border border-[#ebebeb] rounded-xl px-6 py-6 gap-4" onSubmit={handleSubmit}>
            <p className="w-full text-xl font-bold">
              Application
            </p>
            <div className="w-full flex flex-row items-center gap-4 ">
              <div className="flex-1">
                <label className="text-gray-700 font-bold mb-2 block">Full name*</label>
                <input
                  type="fullname"
                  placeholder="yassine@gmail.com"
                  className="w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400"
                />
              </div>

              <div className="flex-1">
                <label className="text-gray-700 font-bold mb-2 block">Email address*</label>
                <input
                  type="email"
                  placeholder="yassine@gmail.com"
                  className="w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400"
                />
              </div>
            </div>

            <div className="w-full">
              <label className="text-gray-700 font-bold mb-2 block">
                Resume *
              </label>

              <label
                htmlFor="resume"
                className="w-full border border-[#e7e7e7] rounded-xl p-4 flex items-center justify-center cursor-pointer
               text-gray-600 hover:border-orange-400 hover:text-orange-500 transition font-bold"
              >
                Resume
              </label>

              <input
                id="resume"
                type="file"
                accept=".pdf"
                className="hidden"
              />

              <p className="text-sm text-gray-400 mt-1">PDF only, 2MB max</p>
            </div>


            <div className="w-full flex flex-row justify-end items-center">
              <button type="submit"
                className="p-4 bg-[#ff6804] rounded-xl text-base text-white cursor-pointer hover:bg-orange-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              // disabled={loginMutation.isPending}
              >
                {/* {loginMutation.isPending ? <Loader className="animate-spin" size={24} /> : 'Login'} */}
                Submit application
              </button>
            </div>

            {/* <label htmlFor="email" className="text-gray-700 font-medium mb-2">Email</label>
            <input type="email" id="email" name="email"
              placeholder="yassine@gmail.com"
              className="w-full border rounded-xl p-4 mb-2 focus:outline-none focus:ring-2 transition-colors border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400"
            /> */}


          </form>
        </div>
      </section>
    </div>
  )
}

export default ApplicationDetailPage