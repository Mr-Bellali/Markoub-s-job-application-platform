import { useEffect, useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { Loader } from "lucide-react"
import toast from "react-hot-toast"
import { applyToPosition } from "../services/applications"
import { applicationSchema } from "../@types/application.validator"
import fileToBase64 from "../utils/convertToBase64"

type Props = {
    open: boolean
    onClose: () => void
    positions: any[]
}

type Errors = {
    fullName?: string
    email?: string
    position?: string
    resume?: string
}

const ApplySpontaneouslyModal = ({ open, onClose, positions }: Props) => {
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [position, setPosition] = useState("")
    const [resume, setResume] = useState<File | null>(null)
    const [errors, setErrors] = useState<Errors>({})

    useEffect(() => {
        if (!open) return

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }

        document.addEventListener("keydown", handleEsc)
        document.body.style.overflow = "hidden"

        return () => {
            document.removeEventListener("keydown", handleEsc)
            document.body.style.overflow = "auto"
        }
    }, [open, onClose])

    const applyMutation = useMutation({
        mutationFn: (payload: {
            fullName: string
            email: string
            fileB64: string
            fileName: string
        }) => applyToPosition(Number(position), payload),

        onSuccess: () => {
            toast.success("Application sent successfully")
            // Reset form
            setFullName("")
            setEmail("")
            setPosition("")
            setResume(null)
            setErrors({})
            onClose()
        },

        onError: (err: any) => {
            toast.error(err?.response?.data?.error || "Submission failed")
        },
    })

    if (!open) return null

    const handleSubmit = async () => {
        setErrors({})

        const result = applicationSchema.safeParse({
            fullName,
            email,
            resume,
        })

        if (!result.success) {
            const fieldErrors: Errors = {}

            result.error.issues.forEach((err) => {
                const field = err.path[0] as keyof Errors
                fieldErrors[field] = err.message
            })

            setErrors(fieldErrors)
            return
        }

        if (!position) {
            setErrors({ position: "Position is required" })
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

    return (
        <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 px-4 cursor-pointer"
            onClick={onClose}
        >
            {/* Modal */}
            <div
                className="bg-white w-full max-w-md rounded-2xl shadow-xl p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Apply spontaneously
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <div>
                    {/* Full name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Full name *
                        </label>
                        <input
                            value={fullName}
                            placeholder="Yassine Aloui"
                            onChange={(e) => setFullName(e.target.value)}
                            className={`w-full rounded-lg px-4 py-2 border focus:ring-2 ${errors.fullName
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-orange-500"
                                }`}
                        />
                        {errors.fullName && (
                            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Email address *
                        </label>
                        <input
                            type="email"
                            placeholder="yassine@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full rounded-lg px-4 py-2 border focus:ring-2 ${errors.email
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-orange-500"
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Position */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Position applying for *
                        </label>
                        <select
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            className={`w-full rounded-lg px-4 py-2 border bg-white focus:ring-2 ${errors.position
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-orange-500"
                                }`}
                        >
                            <option value="">Select a position</option>
                            {positions.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.title}
                                </option>
                            ))}
                        </select>
                        {errors.position && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.position}
                            </p>
                        )}
                    </div>

                    {/* Resume */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">
                            Resume *
                        </label>

                        <label
                            className={`flex justify-center px-4 py-3 border rounded-lg cursor-pointer ${errors.resume ? "border-red-400" : "border-gray-300"
                                }`}
                        >
                            {resume ? resume.name : "Resume"}
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => setResume(e.target.files?.[0] || null)}
                            />
                        </label>
                        <p className="text-sm pt-1 text-gray-500">
                            PDF Only, 2MB Max
                        </p>
                        {errors.resume && (
                            <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={applyMutation.isPending}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition cursor-pointer disabled:opacity-50 flex items-center justify-center"
                    >
                        {applyMutation.isPending ? (
                            <Loader className="animate-spin" size={20} />
                        ) : (
                            "Submit application"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ApplySpontaneouslyModal