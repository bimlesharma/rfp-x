/**
 * Loading skeleton components for better UX
 */

export function MetricCardSkeleton() {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
    );
}

export function RFPCardSkeleton() {
    return (
        <div className="bg-white rounded-lg border-2 border-gray-200 p-5 animate-pulse">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="p-2 bg-gray-50 rounded">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                    <div className="h-3 bg-gray-200 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-12"></div>
                </div>
            </div>
            <div className="mb-4">
                <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="flex flex-wrap gap-1">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-28"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="h-3 bg-gray-200 rounded w-24"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
            </div>
        </div>
    );
}

export function TableSkeleton({ rows = 3 }: { rows?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded animate-pulse">
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                </div>
            ))}
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            {[80, 60, 40, 20].map((width, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8">
                        <div
                            className="bg-gray-200 h-full rounded-full"
                            style={{ width: `${width}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}
