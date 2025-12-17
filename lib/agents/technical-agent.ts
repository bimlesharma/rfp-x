import { ProductSpec, TopMatches, SpecMatchResult } from "../schemas/rfp-schemas";
import { oemCatalog } from "../data/oem-catalog";
import { findTopMatches } from "../engines/spec-matcher";

/**
 * Technical Specification Agent
 * Core innovation: Intelligent spec matching with equal-weight scoring
 */

export class TechnicalAgent {
    /**
     * Find matching OEM SKUs for RFP product specifications
     */
    async findMatches(productSpecs: ProductSpec[]): Promise<TopMatches[]> {
        const allMatches: TopMatches[] = [];

        for (const productSpec of productSpecs) {
            // Find top 3 matching SKUs
            const topMatches = findTopMatches(productSpec, oemCatalog, 3);

            // Select best matching SKU
            const selectedSKU = topMatches.length > 0 ? topMatches[0].sku : "";

            allMatches.push({
                productName: productSpec.productName,
                topMatches,
                selectedSKU,
            });
        }

        return allMatches;
    }

    /**
     * Get detailed match analysis for a specific product
     */
    async analyzeMatch(productSpec: ProductSpec): Promise<{
        topMatches: SpecMatchResult[];
        recommendation: string;
    }> {
        const topMatches = findTopMatches(productSpec, oemCatalog, 3);

        let recommendation = "";

        if (topMatches.length === 0) {
            recommendation = "No matching products found in OEM catalog.";
        } else if (topMatches[0].specMatchPercentage >= 90) {
            recommendation = `Excellent match found: ${topMatches[0].productName} with ${topMatches[0].specMatchPercentage}% specification match.`;
        } else if (topMatches[0].specMatchPercentage >= 70) {
            recommendation = `Good match found: ${topMatches[0].productName} with ${topMatches[0].specMatchPercentage}% specification match. Minor differences exist.`;
        } else {
            recommendation = `Partial match found: ${topMatches[0].productName} with ${topMatches[0].specMatchPercentage}% specification match. Significant differences exist - review required.`;
        }

        return {
            topMatches,
            recommendation,
        };
    }

    /**
     * Complete technical evaluation workflow
     */
    async evaluateRFP(productSpecs: ProductSpec[]): Promise<TopMatches[]> {
        return this.findMatches(productSpecs);
    }
}
