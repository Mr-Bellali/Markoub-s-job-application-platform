import { useEffect, useState } from "react"

type Props = {
    open: boolean
    onClose: () => void
    positions: any[]
}

type Errors = {
    name?: string
    email?: string
    position?: string
    file?: string
}

const ApplySpontaneouslyModal = ({ open, onClose, positions }: Props) => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [position, setPosition] = useState("")
    const [file, setFile] = useState<File | null>(null)
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

    if (!open) return null

    const validate = () => {
        const newErrors: Errors = {}

        if (!name.trim()) newErrors.name = "Full name is required"
        if (!email.trim()) newErrors.email = "Email is required"
        if (!position) newErrors.position = "Position is required"
        if (!file) newErrors.file = "Resume is required"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        console.log({ name, email, position, file })
        onClose()
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

                <form onSubmit={handleSubmit} noValidate>
                    {/* Full name */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                            Full name *
                        </label>
                        <input
                            value={name}
                            placeholder="Yassine Aloui"
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full rounded-lg px-4 py-2 border focus:ring-2 ${errors.name
                                    ? "border-red-400 focus:ring-red-400"
                                    : "border-gray-300 focus:ring-orange-500"
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
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
                            className={`flex justify-center px-4 py-3 border rounded-lg cursor-pointer ${errors.file ? "border-red-400" : "border-gray-300"
                                }`}
                        >
                            {file ? file.name : "Resume"}
                            <input
                                type="file"
                                accept="application/pdf"
                                className="hidden"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                        </label>
                        <p className="text-sm pt-1 text-gray-500">
                            PDF Only, 2MB Max
                        </p>
                        {errors.file && (
                            <p className="text-red-500 text-sm mt-1">{errors.file}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2.5 rounded-lg transition cursor-pointer"
                    >
                        Submit application
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ApplySpontaneouslyModal
