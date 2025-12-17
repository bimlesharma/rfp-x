"use client";

import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { getAllMockRFPs } from "@/lib/data/mock-rfps";

interface RFPInputFormProps {
    onSubmit: (rfpText: string) => void;
}

export default function RFPInputForm({ onSubmit }: RFPInputFormProps) {
    const [selectedMockRFP, setSelectedMockRFP] = useState("");
    const [customRFPText, setCustomRFPText] = useState("");
    const [inputMode, setInputMode] = useState<"mock" | "custom">("mock");

    const mockRFPs = getAllMockRFPs();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const rfpText = inputMode === "mock"
            ? mockRFPs.find(rfp => rfp.id === selectedMockRFP)?.content || ""
            : customRFPText;

        if (rfpText.trim()) {
            onSubmit(rfpText);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="gradient-purple p-4 sm:p-6 text-white">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                        <h2 className="text-lg sm:text-xl font-semibold">Input RFP Document</h2>
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-purple-100">
                        Select a sample RFP or paste your own document
                    </p>
                </div>

                {/* Input Mode Toggle */}
                <div className="p-4 sm:p-6 border-b">
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <button
                            onClick={() => setInputMode("mock")}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${inputMode === "mock"
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Sample RFPs
                        </button>
                        <button
                            onClick={() => setInputMode("custom")}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm sm:text-base ${inputMode === "custom"
                                ? "bg-purple-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                        >
                            Custom Input
                        </button>
                    </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    {inputMode === "mock" ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Sample RFP
                            </label>
                            <select
                                value={selectedMockRFP}
                                onChange={(e) => setSelectedMockRFP(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                required
                            >
                                <option value="">Choose an RFP...</option>
                                {mockRFPs.map((rfp) => (
                                    <option key={rfp.id} value={rfp.id}>
                                        {rfp.name}
                                    </option>
                                ))}
                            </select>

                            {selectedMockRFP && (
                                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600 mb-2 font-medium">Preview:</p>
                                    <p className="text-sm text-gray-700 line-clamp-4">
                                        {mockRFPs.find(rfp => rfp.id === selectedMockRFP)?.content.slice(0, 300)}...
                                    </p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Paste RFP Document
                            </label>
                            <textarea
                                value={customRFPText}
                                onChange={(e) => setCustomRFPText(e.target.value)}
                                placeholder="Paste your RFP document here..."
                                rows={10}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-xs sm:text-sm"
                                required
                            />
                            <p className="mt-2 text-sm text-gray-500">
                                Minimum 100 characters required
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="mt-6 w-full py-3 sm:py-4 gradient-purple text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                        Process RFP with AI Agents
                    </button>
                </form>
            </div>
        </div>
    );
}
