import { NextRequest, NextResponse } from "next/server";
import { OrchestratorAgent, WorkflowProgress } from "@/lib/agents/orchestrator";

export const maxDuration = 60; // 60 seconds timeout

export async function POST(request: NextRequest) {
    try {
        const { rfpText } = await request.json();

        if (!rfpText) {
            return NextResponse.json(
                { error: "RFP text is required" },
                { status: 400 }
            );
        }

        // Get Groq API key from environment
        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json(
                { error: "Groq API key not configured" },
                { status: 500 }
            );
        }

        // Initialize orchestrator
        const orchestrator = new OrchestratorAgent(apiKey);

        // Validate input
        const validation = orchestrator.validateRFPInput(rfpText);
        if (!validation.valid) {
            return NextResponse.json(
                { error: "Invalid RFP input", details: validation.errors },
                { status: 400 }
            );
        }

        // Process RFP with progress tracking
        const progressUpdates: WorkflowProgress[] = [];

        const result = await orchestrator.processRFP(rfpText, (progress) => {
            progressUpdates.push(progress);
        });

        return NextResponse.json({
            success: true,
            result,
            progress: progressUpdates,
        });
    } catch (error) {
        console.error("Error processing RFP:", error);

        return NextResponse.json(
            {
                error: "Failed to process RFP",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
