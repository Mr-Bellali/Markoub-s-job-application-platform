import { ChevronLeft, Loader } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query"
import ReactMarkdown from 'react-markdown';
import { getPosition } from "../services/positions";
import PositionSkeleton from "../components/PositionDetailSkeleton";
import { useState, useRef } from "react";
import fileToBase64 from "../utils/convertToBase64";
import { applyToPosition } from "../services/applications";
import toast from "react-hot-toast";
import { applicationSchema } from "../@types/application.validator";

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
  // Fill the states we will send 
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [resume, setResume] = useState<File | null>(null)

  // Validation state
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    resume?: string
  }>({})

  const formRef = useRef<HTMLFormElement | null>(null)

  const handleBackClick = () => {
    navigate('/');
  }

  const applyMutation = useMutation({
    mutationFn: (payload: {
      fullName: string
      email: string
      fileB64: string
      fileName: string
    }) => applyToPosition(Number(id), payload),

    onSuccess: () => {
      toast.success("Application sent successfully")
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.error || "Submission failed")
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const result = applicationSchema.safeParse({
      fullName,
      email,
      resume,
    })

    if (!result.success) {
      const fieldErrors: typeof errors = {}

      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof typeof errors
        fieldErrors[field] = err.message
      })

      setErrors(fieldErrors)
      return
    }

    try {
      const fileB64 = await fileToBase64(resume!)

      applyMutation.mutate({
        fullName,
        email,
        fileB64,
        fileName: resume!.name,
      })
    } catch {
      toast.error("Failed to read resume file")
    }
  }

  if (isLoading) {
    return <PositionSkeleton />
  }

  if (isError || !position) {
    return <p className="p-10 text-red-500">Position not found</p>
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
        <div
          className="
            sticky
            top-20
            self-start
            flex
            flex-col
            justify-between
            gap-2
            items-start
            px-4
            py-5
            bg-[#fafbfc]
            rounded-xl
            min-w-100
            h-40
          "
        >
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
          <button
            className="px-2 py-1 bg-[#fe6a00] text-white rounded-sm cursor-pointer"
            onClick={() => {
              formRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              })
            }}
          >
            Apply
          </button>
        </div>
        {/* Job detail & apply form */}
        <div className="w-full p-5 flex flex-col gap-5">
          <ReactMarkdown>
            {position.description || "_No description provided_"}
          </ReactMarkdown>
          {/* Application form */}
          <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="w-full border border-[#ebebeb] rounded-xl px-6 py-6 flex flex-col gap-4"
          >

            <p className="text-xl font-bold">Application</p>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="font-bold mb-2 block">Full name*</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Yassine Alaoui"
                  className={`w-full rounded-xl p-4 border focus:outline-none focus:ring-2 transition-colors ${errors.fullName
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                    }`}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div className="flex-1">
                <label className="font-bold mb-2 block">Email*</label>
                <input
                  type="email"
                  value={email}
                  placeholder="yassine@gmail.com"
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full rounded-xl p-4 border focus:outline-none focus:ring-2 transition-colors ${errors.email
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                    : 'border-[#e7e7e7] focus:border-orange-400 focus:ring-orange-400'
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}

              </div>
            </div>

            <div>
              <label className="font-bold mb-2 block">Resume*</label>

              <label
                htmlFor="resume"
                className={`w-full rounded-xl p-4 flex justify-center cursor-pointer font-bold border ${errors.resume ? 'border-red-400' : 'border-[#e7e7e7]'
                  }`}
              >
                {resume ? resume.name : "Resume"}
              </label>

              <input
                id="resume"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => setResume(e.target.files?.[0] || null)}
              />
              <p className="text-sm pt-1 text-gray-500">
                PDF Only, 2MB Max
              </p>

              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
              )}

            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={applyMutation.isPending}
                className="p-4 bg-[#ff6804] text-white rounded-xl disabled:opacity-50 cursor-pointer"
              >
                {applyMutation.isPending ? <Loader className="animate-spin" size={24} /> : "Submit application"}
              </button>
            </div>
          </form>

        </div>
      </section>
    </div>
  )
}

export default ApplicationDetailPage