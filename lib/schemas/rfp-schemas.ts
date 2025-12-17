import { z } from "zod";

/**
 * RFP Summary Schema - Output from Sales Agent
 */
export const RFPSummarySchema = z.object({
  rfpName: z.string().describe("Name of the RFP"),
  dueDate: z.string().describe("Due date in YYYY-MM-DD format"),
  products: z.array(z.string()).describe("List of products in scope"),
  tests: z.array(z.string()).describe("Testing and acceptance requirements"),
  rawText: z.string().optional().describe("Original RFP text"),
});

export type RFPSummary = z.infer<typeof RFPSummarySchema>;

/**
 * Technical Specification Schema
 */
export const TechnicalSpecSchema = z.object({
  parameter: z.string().describe("Specification parameter name"),
  value: z.string().describe("Parameter value"),
  unit: z.string().optional().describe("Unit of measurement"),
});

export type TechnicalSpec = z.infer<typeof TechnicalSpecSchema>;

/**
 * Product Specification Schema
 */
export const ProductSpecSchema = z.object({
  productName: z.string().describe("Product name from RFP"),
  specifications: z.array(TechnicalSpecSchema).describe("List of specifications"),
});

export type ProductSpec = z.infer<typeof ProductSpecSchema>;

/**
 * OEM SKU Schema
 */
export const OEMSKUSchema = z.object({
  sku: z.string().describe("SKU identifier"),
  productName: z.string().describe("Product name"),
  specifications: z.array(TechnicalSpecSchema).describe("Product specifications"),
  category: z.string().describe("Product category"),
});

export type OEMSKU = z.infer<typeof OEMSKUSchema>;

/**
 * Spec Match Result Schema - Output from Technical Agent
 */
export const SpecMatchResultSchema = z.object({
  sku: z.string().describe("Matched SKU"),
  productName: z.string().describe("Product name"),
  specMatchPercentage: z.number().describe("Match percentage (0-100)"),
  matchingParams: z.number().describe("Number of matching parameters"),
  totalParams: z.number().describe("Total number of parameters"),
  comparisonTable: z.array(
    z.object({
      parameter: z.string(),
      rfpValue: z.string(),
      oemValue: z.string(),
      matches: z.boolean(),
    })
  ).describe("Detailed parameter comparison"),
});

export type SpecMatchResult = z.infer<typeof SpecMatchResultSchema>;

/**
 * Top Matches Schema
 */
export const TopMatchesSchema = z.object({
  productName: z.string().describe("RFP product name"),
  topMatches: z.array(SpecMatchResultSchema).describe("Top 3 matching SKUs"),
  selectedSKU: z.string().describe("Best matching SKU selected"),
});

export type TopMatches = z.infer<typeof TopMatchesSchema>;

/**
 * Pricing Result Schema - Output from Pricing Agent
 */
export const PricingResultSchema = z.object({
  sku: z.string().describe("SKU identifier"),
  productName: z.string().describe("Product name"),
  unitPrice: z.number().describe("Unit price"),
  quantity: z.number().describe("Quantity"),
  materialCost: z.number().describe("Total material cost"),
  testingCosts: z.array(
    z.object({
      testName: z.string(),
      cost: z.number(),
    })
  ).describe("Testing costs breakdown"),
  totalTestingCost: z.number().describe("Total testing cost"),
  totalCost: z.number().describe("Total cost (material + testing)"),
});

export type PricingResult = z.infer<typeof PricingResultSchema>;

/**
 * Final RFP Response Schema - Consolidated output
 */
export const FinalRFPResponseSchema = z.object({
  rfpSummary: RFPSummarySchema.describe("RFP summary"),
  technicalMatches: z.array(TopMatchesSchema).describe("Technical specification matches"),
  pricing: z.array(PricingResultSchema).describe("Pricing breakdown"),
  totalBidValue: z.number().describe("Total bid value"),
  generatedAt: z.string().describe("Timestamp of generation"),
});

export type FinalRFPResponse = z.infer<typeof FinalRFPResponseSchema>;

/**
 * Agent State Schema - For LangGraph workflow
 */
export const AgentStateSchema = z.object({
  rfpInput: z.string().optional().describe("Raw RFP input"),
  rfpSummary: RFPSummarySchema.optional().describe("Parsed RFP summary"),
  productSpecs: z.array(ProductSpecSchema).optional().describe("Extracted product specs"),
  technicalMatches: z.array(TopMatchesSchema).optional().describe("Technical matches"),
  pricing: z.array(PricingResultSchema).optional().describe("Pricing results"),
  finalResponse: FinalRFPResponseSchema.optional().describe("Final consolidated response"),
  currentStep: z.string().optional().describe("Current workflow step"),
  errors: z.array(z.string()).optional().describe("Error messages"),
});

export type AgentState = z.infer<typeof AgentStateSchema>;
