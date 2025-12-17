"use client";

import { FinalRFPResponse } from "@/lib/schemas/rfp-schemas";
import {
    TrendingUp,
    FileText,
    Target,
    IndianRupee,
    Calendar,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

interface BusinessImpactDashboardProps {
    responses: FinalRFPResponse[];
    discoveredRFPs?: any[];
}

export default function BusinessImpactDashboard({
    responses,
    discoveredRFPs = [],
}: BusinessImpactDashboardProps) {
    // Calculate metrics
    const totalRFPs = responses.length + discoveredRFPs.length;
    const processedRFPs = responses.length;
    const pendingRFPs = discoveredRFPs.length;

    const avgMatchScore =
        responses.length > 0
            ? Math.round(
                responses.reduce((sum, r) => {
                    const avgMatch =
                        r.technicalMatches.reduce(
                            (s, m) =>
                                s +
                                (m.topMatches[0]?.specMatchPercentage || 0) /
                                r.technicalMatches.length,
                            0
                        );
                    return sum + avgMatch;
                }, 0) / responses.length
            )
            : 0;

    const totalBidValue = responses.reduce((sum, r) => sum + r.totalBidValue, 0);

    const highMatchCount = responses.filter((r) =>
        r.technicalMatches.some((m) => (m.topMatches[0]?.specMatchPercentage || 0) >= 90)
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Business Impact Dashboard</h2>
                <p className="text-gray-600 mt-1">
                    Real-time insights into RFP pipeline and response readiness
                </p>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total RFPs */}
                <MetricCard
                    icon={<FileText className="w-6 h-6" />}
                    label="Total RFPs"
                    value={totalRFPs.toString()}
                    subtitle={`${processedRFPs} processed, ${pendingRFPs} pending`}
                    color="purple"
                />

                {/* Average Match Score */}
                <MetricCard
                    icon={<Target className="w-6 h-6" />}
                    label="Avg Match Score"
                    value={`${avgMatchScore}%`}
                    subtitle={`${highMatchCount} high-quality matches`}
                    color="green"
                />

                {/* Total Bid Value */}
                <MetricCard
                    icon={<IndianRupee className="w-6 h-6" />}
                    label="Total Bid Value"
                    value={`₹${(totalBidValue / 100000).toFixed(1)}L`}
                    subtitle={`Across ${processedRFPs} RFPs`}
                    color="blue"
                />

                {/* Win Probability */}
                <MetricCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Win Probability"
                    value={avgMatchScore >= 85 ? "High" : avgMatchScore >= 70 ? "Medium" : "Low"}
                    subtitle={`Based on ${avgMatchScore}% match`}
                    color={avgMatchScore >= 85 ? "green" : avgMatchScore >= 70 ? "yellow" : "red"}
                />
            </div>

            {/* Match Score Distribution */}
            {responses.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Specification Match Distribution
                    </h3>
                    <MatchScoreChart responses={responses} />
                </div>
            )}

            {/* Pricing Breakdown */}
            {responses.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Pricing Breakdown by RFP
                    </h3>
                    <PricingBreakdownTable responses={responses} />
                </div>
            )}

            {/* Upcoming Deadlines */}
            {discoveredRFPs.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming RFP Deadlines
                    </h3>
                    <DeadlineTimeline rfps={discoveredRFPs} />
                </div>
            )}
        </div>
    );
}

// Metric Card Component
function MetricCard({
    icon,
    label,
    value,
    subtitle,
    color,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subtitle: string;
    color: string;
}) {
    const colorClasses = {
        purple: "bg-purple-100 text-purple-600",
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        yellow: "bg-yellow-100 text-yellow-600",
        red: "bg-red-100 text-red-600",
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-500">{subtitle}</div>
        </div>
    );
}

// Match Score Chart Component
function MatchScoreChart({ responses }: { responses: FinalRFPResponse[] }) {
    const ranges = [
        { label: "90-100%", min: 90, max: 100, color: "bg-green-500" },
        { label: "70-89%", min: 70, max: 89, color: "bg-yellow-500" },
        { label: "50-69%", min: 50, max: 69, color: "bg-orange-500" },
        { label: "<50%", min: 0, max: 49, color: "bg-red-500" },
    ];

    const distribution = ranges.map((range) => {
        const count = responses.filter((r) =>
            r.technicalMatches.some((m) => {
                const score = m.topMatches[0]?.specMatchPercentage || 0;
                return score >= range.min && score <= range.max;
            })
        ).length;
        return { ...range, count };
    });

    const maxCount = Math.max(...distribution.map((d) => d.count), 1);

    return (
        <div className="space-y-3">
            {distribution.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                    <div className="w-24 text-sm font-medium text-gray-700">{item.label}</div>
                    <div className="flex-1 bg-gray-100 rounded-full h-8 relative overflow-hidden">
                        <div
                            className={`${item.color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3`}
                            style={{ width: `${(item.count / maxCount) * 100}%` }}
                        >
                            {item.count > 0 && (
                                <span className="text-white text-sm font-semibold">{item.count}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// Pricing Breakdown Table
function PricingBreakdownTable({ responses }: { responses: FinalRFPResponse[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            RFP Name
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Material Cost
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Testing Cost
                        </th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Total Bid Value
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {responses.map((response, idx) => {
                        const materialCost = response.pricing.reduce((sum, p) => sum + p.materialCost, 0);
                        const testingCost = response.pricing.reduce(
                            (sum, p) => sum + p.totalTestingCost,
                            0
                        );
                        return (
                            <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="py-3 px-4 text-sm text-gray-900">
                                    {response.rfpSummary.rfpName}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                    ₹{materialCost.toLocaleString("en-IN")}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                    ₹{testingCost.toLocaleString("en-IN")}
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                                    ₹{response.totalBidValue.toLocaleString("en-IN")}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

// Deadline Timeline Component
function DeadlineTimeline({ rfps }: { rfps: any[] }) {
    const today = new Date();
    const sortedRFPs = [...rfps].sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    );

    return (
        <div className="space-y-3">
            {sortedRFPs.slice(0, 5).map((rfp, idx) => {
                const dueDate = new Date(rfp.dueDate);
                const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const isUrgent = daysUntil <= 7;
                const isProcessed = rfp.status === "processed";

                return (
                    <div
                        key={idx}
                        className={`flex items-center justify-between p-4 rounded-lg border ${isUrgent ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            {isProcessed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                                <AlertCircle className={`w-5 h-5 ${isUrgent ? "text-red-600" : "text-yellow-600"}`} />
                            )}
                            <div>
                                <div className="font-medium text-gray-900">{rfp.rfpName}</div>
                                <div className="text-sm text-gray-600">
                                    {rfp.products?.length || 0} products • {rfp.source}
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`font-semibold ${isUrgent ? "text-red-600" : "text-gray-900"}`}>
                                {daysUntil > 0 ? `${daysUntil} days` : "Overdue"}
                            </div>
                            <div className="text-sm text-gray-600">{dueDate.toLocaleDateString()}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
