"use client";

import { CheckCircle2, Circle, Loader2, Clock } from "lucide-react";

interface AgentWorkflowVisualizerProps {
    currentStep: string;
    executionMetrics?: {
        salesAgentTime?: number;
        technicalAgentTime?: number;
        pricingAgentTime?: number;
    };
}

const steps = [
    {
        id: "sales",
        name: "Sales Agent",
        description: "Analyzing RFP document and extracting requirements",
    },
    {
        id: "technical",
        name: "Technical Agent",
        description: "Matching specifications with OEM catalog",
    },
    {
        id: "pricing",
        name: "Pricing Agent",
        description: "Calculating costs and generating bid value",
    },
    {
        id: "completed",
        name: "Completed",
        description: "RFP response generated successfully",
    },
];

export default function AgentWorkflowVisualizer({ currentStep }: AgentWorkflowVisualizerProps) {
    const getStepStatus = (stepId: string) => {
        const currentIndex = steps.findIndex((s) => s.id === currentStep);
        const stepIndex = steps.findIndex((s) => s.id === stepId);

        if (currentStep === "error") return "error";
        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "active";
        return "pending";
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                    Processing RFP
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    Multi-agent AI system at work
                </p>

                <div className="space-y-6">
                    {steps.map((step, index) => {
                        const status = getStepStatus(step.id);

                        return (
                            <div key={step.id} className="relative">
                                {/* Connector Line */}
                                {index < steps.length - 1 && (
                                    <div
                                        className={`absolute left-5 top-12 w-0.5 h-12 ${status === "completed"
                                            ? "bg-purple-600"
                                            : "bg-gray-300"
                                            }`}
                                    />
                                )}

                                {/* Step Card */}
                                <div
                                    className={`flex items-start gap-4 p-4 rounded-lg transition-all ${status === "active"
                                        ? "bg-purple-50 border-2 border-purple-600"
                                        : status === "completed"
                                            ? "bg-green-50 border border-green-200"
                                            : "bg-gray-50 border border-gray-200"
                                        }`}
                                >
                                    {/* Icon */}
                                    <div className="flex-shrink-0 mt-1">
                                        {status === "active" ? (
                                            <Loader2 className="w-10 h-10 text-purple-600 animate-spin" />
                                        ) : status === "completed" ? (
                                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                                        ) : (
                                            <Circle className="w-10 h-10 text-gray-400" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3
                                            className={`text-lg font-semibold ${status === "active"
                                                ? "text-purple-900"
                                                : status === "completed"
                                                    ? "text-green-900"
                                                    : "text-gray-600"
                                                }`}
                                        >
                                            {step.name}
                                        </h3>
                                        <p
                                            className={`text-sm mt-1 ${status === "active"
                                                ? "text-purple-700"
                                                : status === "completed"
                                                    ? "text-green-700"
                                                    : "text-gray-500"
                                                }`}
                                        >
                                            {step.description}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    {status === "active" && (
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-600 text-white">
                                                In Progress
                                            </span>
                                        </div>
                                    )}
                                    {status === "completed" && (
                                        <div className="flex-shrink-0">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-600 text-white">
                                                Done
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
