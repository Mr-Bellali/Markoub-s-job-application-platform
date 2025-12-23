const PositionSkeleton = () => {
    return (
        <div className="w-full h-screen px-50 pt-10 flex flex-col items-center gap-10 animate-pulse">
            {/* Header */}
            <div className="w-full h-6 bg-gray-200 rounded" />

            <section className="w-full flex flex-row gap-5">
                {/* Left card skeleton */}
                <div className="flex flex-col justify-between px-4 py-5 bg-gray-100 rounded-xl min-w-100 h-40">
                    <div className="space-y-2">
                        <div className="h-6 w-48 bg-gray-200 rounded" />
                        <div className="h-4 w-36 bg-gray-200 rounded" />
                    </div>
                    <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>

                {/* Right content skeleton */}
                <div className="w-full p-5 flex flex-col gap-5">
                    {/* Markdown content */}
                    <div className="space-y-3">
                        <div className="h-6 w-2/3 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-4 w-5/6 bg-gray-200 rounded" />
                        <div className="h-4 w-4/6 bg-gray-200 rounded" />
                    </div>

                    {/* Form skeleton */}
                    <div className="w-full border border-gray-200 rounded-xl px-6 py-6 space-y-4">
                        <div className="h-6 w-32 bg-gray-200 rounded" />

                        <div className="flex gap-4">
                            <div className="flex-1 h-14 bg-gray-200 rounded-xl" />
                            <div className="flex-1 h-14 bg-gray-200 rounded-xl" />
                        </div>

                        <div className="h-14 bg-gray-200 rounded-xl" />

                        <div className="flex justify-end">
                            <div className="h-12 w-48 bg-gray-200 rounded-xl" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PositionSkeleton;