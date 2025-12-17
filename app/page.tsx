"use client";

import { useState, useEffect } from "react";
import { FileText, Sparkles, LayoutDashboard } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { showSuccess, showError, showLoading, dismissToast } from "@/lib/utils/toast";
import { FinalRFPResponse } from "@/lib/schemas/rfp-schemas";
import { DiscoveredRFP, RFPDiscoveryAgent } from "@/lib/services/rfp-discovery-service";
import RFPInputForm from "@/components/rfp-input-form";
import AgentWorkflowVisualizer from "@/components/agent-workflow-visualizer";
import RFPResponseDisplay from "@/components/rfp-response-display";
import BusinessImpactDashboard from "@/components/dashboard/business-impact-dashboard";
import DiscoveredRFPsDisplay from "@/components/dashboard/discovered-rfps-display";

type ViewMode = "input" | "dashboard" | "discovery";

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [result, setResult] = useState<FinalRFPResponse | null>(null);
  const [processedRFPs, setProcessedRFPs] = useState<FinalRFPResponse[]>([]);
  const [discoveredRFPs, setDiscoveredRFPs] = useState<DiscoveredRFP[]>([]);
  const [isLoadingDiscovery, setIsLoadingDiscovery] = useState(true);
  const [error, setError] = useState<string>("");

  // Load discovered RFPs on mount
  useEffect(() => {
    const loadDiscoveredRFPs = async () => {
      setIsLoadingDiscovery(true);
      try {
        const discoveryAgent = new RFPDiscoveryAgent();
        const rfps = await discoveryAgent.getActionableRFPs();
        setDiscoveredRFPs(rfps);
        showSuccess(`Discovered ${rfps.length} RFPs from multiple sources`);
      } catch (error) {
        console.error("Failed to load discovered RFPs:", error);
        showError("Failed to load discovered RFPs", "Using cached data");
        // Set empty array as fallback
        setDiscoveredRFPs([]);
      } finally {
        setIsLoadingDiscovery(false);
      }
    };
    loadDiscoveredRFPs();
  }, []);

  const handleProcessRFP = async (rfpText: string) => {
    setIsProcessing(true);
    setError("");
    setResult(null);
    setCurrentStep("sales");
    setViewMode("input"); // Switch to input view to show progress

    const loadingToast = showLoading("Processing RFP with AI agents...");

    try {
      const response = await fetch("/api/process-rfp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rfpText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process RFP");
      }

      // Simulate progress steps for visualization
      setCurrentStep("technical");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCurrentStep("pricing");
      await new Promise((resolve) => setTimeout(resolve, 500));

      setCurrentStep("completed");
      setResult(data.result);

      // Add to processed RFPs
      setProcessedRFPs((prev) => [...prev, data.result]);

      dismissToast(loadingToast);
      showSuccess("RFP response generated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setCurrentStep("error");
      dismissToast(loadingToast);
      showError("Failed to process RFP", errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectDiscoveredRFP = (rfp: DiscoveredRFP) => {
    // Create a mock RFP text from discovered RFP
    const mockRFPText = `
RFP Name: ${rfp.rfpName}
Due Date: ${rfp.dueDate}
Source: ${rfp.source}

Products Required:
${rfp.products.map((p, i) => `${i + 1}. ${p}`).join("\n")}

Estimated Value: ₹${rfp.estimatedValue.toLocaleString("en-IN")}

Please provide technical specifications and pricing for the above products.
    `.trim();

    showSuccess(`Processing RFP: ${rfp.rfpName}`);
    setViewMode("input");
    // You would typically populate the form here
    // For now, we'll just process it directly
    handleProcessRFP(mockRFPText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      {/* Toast Notifications */}
      <Toaster />

      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg gradient-purple flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">RFP-X</h1>
                <p className="text-xs sm:text-sm text-gray-600">AI-Powered RFP Response Automation</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => setViewMode("dashboard")}
                className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${viewMode === "dashboard"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              <button
                onClick={() => setViewMode("discovery")}
                className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${viewMode === "discovery"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Discovered RFPs</span>
                <span className="sm:hidden">RFPs</span>
              </button>
              <button
                onClick={() => setViewMode("input")}
                className={`flex-1 sm:flex-none px-2 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm ${viewMode === "input"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Process RFP</span>
                <span className="sm:hidden">Process</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
        {/* Dashboard View */}
        {viewMode === "dashboard" && (
          <BusinessImpactDashboard
            responses={processedRFPs}
            discoveredRFPs={discoveredRFPs}
          />
        )}

        {/* Discovery View */}
        {viewMode === "discovery" && (
          <DiscoveredRFPsDisplay
            rfps={discoveredRFPs}
            onSelectRFP={handleSelectDiscoveredRFP}
          />
        )}

        {/* Input/Processing View */}
        {viewMode === "input" && (
          <>
            {/* Hero Section */}
            {!result && !isProcessing && (
              <div className="text-center mb-8 sm:mb-12 px-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                  Automate Your RFP Response Workflow
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
                  Multi-agent AI system that analyzes RFPs, matches specifications, and generates
                  pricing—all in seconds.
                </p>
              </div>
            )}

            {/* RFP Input Form */}
            {!result && !isProcessing && (
              <div className="mb-8">
                <RFPInputForm onSubmit={handleProcessRFP} />
              </div>
            )}

            {/* Workflow Visualization */}
            {isProcessing && (
              <div className="mb-8">
                <AgentWorkflowVisualizer currentStep={currentStep} />
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Error Processing RFP</h3>
                <p className="text-red-700">{error}</p>
                <button
                  onClick={() => {
                    setError("");
                    setCurrentStep("");
                  }}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div>
                <RFPResponseDisplay
                  response={result}
                  onReset={() => {
                    setResult(null);
                    setCurrentStep("");
                    setViewMode("dashboard");
                  }}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p className="text-sm">
            RFP-X • Agentic AI-Driven B2B RFP Response Automation System
          </p>
          <p className="text-xs mt-1 text-gray-500">
            {processedRFPs.length} RFPs Processed • {discoveredRFPs.length} RFPs Discovered
          </p>
        </div>
      </footer>
    </div>
  );
}
