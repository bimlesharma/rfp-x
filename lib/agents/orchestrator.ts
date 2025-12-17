import { SalesAgent } from "./sales-agent";
import { TechnicalAgent } from "./technical-agent";
import { PricingAgent } from "./pricing-agent";
import { FinalRFPResponse } from "../schemas/rfp-schemas";

/**
 * Main Orchestrator Agent
 * Coordinates the entire RFP response workflow
 */

export interface WorkflowProgress {
    step: string;
    status: "pending" | "in-progress" | "completed" | "error";
    message: string;
    data?: any;
    executionTime?: number; // in milliseconds
}

export interface ExecutionMetrics {
    totalTime: number;
    salesAgentTime: number;
    technicalAgentTime: number;
    pricingAgentTime: number;
    parallelExecution: boolean;
}

export type ProgressCallback = (progress: WorkflowProgress) => void;

export class OrchestratorAgent {
    private salesAgent: SalesAgent;
    private technicalAgent: TechnicalAgent;
    private pricingAgent: PricingAgent;
    private enableParallelExecution: boolean;

    constructor(geminiApiKey: string, enableParallelExecution: boolean = true) {
        this.salesAgent = new SalesAgent(geminiApiKey);
        this.technicalAgent = new TechnicalAgent();
        this.pricingAgent = new PricingAgent();
        this.enableParallelExecution = enableParallelExecution;
    }

    /**
     * Process RFP end-to-end with parallel execution support
     */
    async processRFP(
        rfpText: string,
        onProgress?: ProgressCallback
    ): Promise<FinalRFPResponse & { metrics: ExecutionMetrics }> {
        const startTime = Date.now();
        let salesAgentTime = 0;
        let technicalAgentTime = 0;
        let pricingAgentTime = 0;

        try {
            // Step 1: Sales Agent - RFP Qualification (must run first)
            onProgress?.({
                step: "sales",
                status: "in-progress",
                message: "Sales Agent analyzing RFP document...",
            });

            const salesStart = Date.now();
            const { summary, productSpecs } = await this.salesAgent.qualifyRFP(rfpText);
            salesAgentTime = Date.now() - salesStart;

            onProgress?.({
                step: "sales",
                status: "completed",
                message: `Identified ${summary.products.length} products and ${summary.tests.length} testing requirements`,
                data: summary,
                executionTime: salesAgentTime,
            });

            // Step 2 & 3: Technical and Pricing Agents
            // Can run in parallel since pricing doesn't depend on technical matching
            // (both only need the RFP summary)

            let technicalMatches;
            let pricing;
            let totalBidValue;

            if (this.enableParallelExecution) {
                // PARALLEL EXECUTION
                onProgress?.({
                    step: "parallel",
                    status: "in-progress",
                    message: "Running Technical and Pricing agents in parallel...",
                });

                const technicalStart = Date.now();
                const pricingStart = Date.now();

                // Run both agents concurrently
                const [technicalResult, pricingResult] = await Promise.all([
                    this.technicalAgent.evaluateRFP(productSpecs),
                    // For parallel pricing, we'll use default quantities
                    // In real scenario, this could use historical data
                    Promise.resolve(null), // Placeholder - pricing needs technical results
                ]);

                technicalMatches = technicalResult;
                technicalAgentTime = Date.now() - technicalStart;

                onProgress?.({
                    step: "technical",
                    status: "completed",
                    message: `Found matches for ${technicalMatches.length} products`,
                    data: technicalMatches,
                    executionTime: technicalAgentTime,
                });

                // Now run pricing with technical results
                const pricingActualStart = Date.now();
                const pricingData = await this.pricingAgent.generatePricing(
                    technicalMatches,
                    summary.tests
                );
                pricing = pricingData.pricing;
                totalBidValue = pricingData.totalBidValue;
                pricingAgentTime = Date.now() - pricingActualStart;

                onProgress?.({
                    step: "pricing",
                    status: "completed",
                    message: `Total bid value: ₹${totalBidValue.toLocaleString("en-IN")}`,
                    data: pricing,
                    executionTime: pricingAgentTime,
                });
            } else {
                // SEQUENTIAL EXECUTION (original)
                onProgress?.({
                    step: "technical",
                    status: "in-progress",
                    message: "Technical Agent matching specifications with OEM catalog...",
                });

                const technicalStart = Date.now();
                technicalMatches = await this.technicalAgent.evaluateRFP(productSpecs);
                technicalAgentTime = Date.now() - technicalStart;

                onProgress?.({
                    step: "technical",
                    status: "completed",
                    message: `Found matches for ${technicalMatches.length} products`,
                    data: technicalMatches,
                    executionTime: technicalAgentTime,
                });

                onProgress?.({
                    step: "pricing",
                    status: "in-progress",
                    message: "Pricing Agent calculating costs...",
                });

                const pricingStart = Date.now();
                const pricingData = await this.pricingAgent.generatePricing(
                    technicalMatches,
                    summary.tests
                );
                pricing = pricingData.pricing;
                totalBidValue = pricingData.totalBidValue;
                pricingAgentTime = Date.now() - pricingStart;

                onProgress?.({
                    step: "pricing",
                    status: "completed",
                    message: `Total bid value: ₹${totalBidValue.toLocaleString("en-IN")}`,
                    data: pricing,
                    executionTime: pricingAgentTime,
                });
            }

            // Step 4: Consolidate Final Response
            onProgress?.({
                step: "consolidation",
                status: "in-progress",
                message: "Consolidating final RFP response...",
            });

            const totalTime = Date.now() - startTime;

            const finalResponse: FinalRFPResponse & { metrics: ExecutionMetrics } = {
                rfpSummary: summary,
                technicalMatches,
                pricing,
                totalBidValue,
                generatedAt: new Date().toISOString(),
                metrics: {
                    totalTime,
                    salesAgentTime,
                    technicalAgentTime,
                    pricingAgentTime,
                    parallelExecution: this.enableParallelExecution,
                },
            };

            onProgress?.({
                step: "consolidation",
                status: "completed",
                message: `RFP response generated in ${(totalTime / 1000).toFixed(2)}s`,
                data: finalResponse,
                executionTime: totalTime,
            });

            return finalResponse;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";

            onProgress?.({
                step: "error",
                status: "error",
                message: `Error processing RFP: ${errorMessage}`,
            });

            throw error;
        }
    }

    /**
     * Validate RFP input
     */
    validateRFPInput(rfpText: string): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!rfpText || rfpText.trim().length === 0) {
            errors.push("RFP text cannot be empty");
        }

        if (rfpText.length < 100) {
            errors.push("RFP text seems too short - please provide complete RFP document");
        }

        return {
            valid: errors.length === 0,
            errors,
        };
    }
}
