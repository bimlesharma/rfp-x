"use client";

import { DiscoveredRFP } from "@/lib/services/rfp-discovery-service";
import { Search, TrendingUp, Calendar, Package, AlertCircle } from "lucide-react";

interface DiscoveredRFPsDisplayProps {
    rfps: DiscoveredRFP[];
    onSelectRFP?: (rfp: DiscoveredRFP) => void;
}

export default function DiscoveredRFPsDisplay({
    rfps,
    onSelectRFP,
}: DiscoveredRFPsDisplayProps) {
    const qualifiedRFPs = rfps.filter((r) => r.status === "qualified");
    const discoveredRFPs = rfps.filter((r) => r.status === "discovered");

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Search className="w-6 h-6 text-purple-600" />
                        Discovered RFPs
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Autonomous monitoring of {rfps.length} RFPs from multiple sources
                    </p>
                </div>
                <div className="flex gap-3">
                    <div className="text-center px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-600">{qualifiedRFPs.length}</div>
                        <div className="text-xs text-green-700">Qualified</div>
                    </div>
                    <div className="text-center px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="text-2xl font-bold text-gray-600">{discoveredRFPs.length}</div>
                        <div className="text-xs text-gray-700">Under Review</div>
                    </div>
                </div>
            </div>

            {/* Filters Info */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5" />
                    <div>
                        <h3 className="font-semibold text-purple-900">Active Filters</h3>
                        <p className="text-sm text-purple-700 mt-1">
                            Showing RFPs due within <strong>90 days</strong> with relevance score ≥ 60%
                        </p>
                    </div>
                </div>
            </div>

            {/* RFP Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {rfps.map((rfp) => (
                    <RFPCard key={rfp.id} rfp={rfp} onSelect={onSelectRFP} />
                ))}
            </div>
        </div>
    );
}

function RFPCard({
    rfp,
    onSelect,
}: {
    rfp: DiscoveredRFP;
    onSelect?: (rfp: DiscoveredRFP) => void;
}) {
    const isUrgent = rfp.daysUntilDue <= 7;
    const isHighRelevance = rfp.relevanceScore >= 80;

    return (
        <div
            className={`bg-white rounded-lg border-2 p-5 transition-all hover:shadow-lg ${rfp.status === "qualified"
                    ? "border-green-200 hover:border-green-300"
                    : "border-gray-200 hover:border-gray-300"
                }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 line-clamp-1">{rfp.rfpName}</h3>
                        {rfp.status === "qualified" && (
                            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
                                Qualified
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600">{rfp.source}</p>
                </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                {/* Relevance Score */}
                <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-600">Relevance</span>
                    </div>
                    <div
                        className={`text-lg font-bold ${isHighRelevance ? "text-green-600" : "text-gray-900"
                            }`}
                    >
                        {rfp.relevanceScore}%
                    </div>
                </div>

                {/* Days Until Due */}
                <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Calendar className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-600">Due In</span>
                    </div>
                    <div className={`text-lg font-bold ${isUrgent ? "text-red-600" : "text-gray-900"}`}>
                        {rfp.daysUntilDue}d
                    </div>
                </div>

                {/* Estimated Value */}
                <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Package className="w-3 h-3 text-gray-600" />
                        <span className="text-xs text-gray-600">Value</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                        ₹{(rfp.estimatedValue / 100000).toFixed(1)}L
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="mb-4">
                <div className="text-xs font-medium text-gray-600 mb-2">Products in Scope:</div>
                <div className="flex flex-wrap gap-1">
                    {rfp.products.slice(0, 3).map((product, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200"
                        >
                            {product}
                        </span>
                    ))}
                    {rfp.products.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{rfp.products.length - 3} more
                        </span>
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-xs text-gray-500">
                    Discovered: {new Date(rfp.discoveredDate).toLocaleDateString()}
                </div>
                {onSelect && (
                    <button
                        onClick={() => onSelect(rfp)}
                        className="px-3 py-1.5 bg-purple-600 text-white text-sm font-medium rounded hover:bg-purple-700 transition-colors"
                    >
                        Process RFP
                    </button>
                )}
            </div>
        </div>
    );
}
