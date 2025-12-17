import { TopMatches, PricingResult } from "../schemas/rfp-schemas";
import { getProductBySKU } from "../data/oem-catalog";
import {
    getUnitPrice,
    getTestingCost,
    getDefaultQuantity,
    calculateMaterialCost,
} from "../data/pricing-tables";

/**
 * Pricing Agent
 * Responsible for cost estimation and bid value calculation
 */

export class PricingAgent {
    /**
     * Calculate pricing for matched products
     */
    async calculatePricing(
        technicalMatches: TopMatches[],
        testingRequirements: string[]
    ): Promise<PricingResult[]> {
        const pricingResults: PricingResult[] = [];

        for (const match of technicalMatches) {
            const sku = match.selectedSKU;
            const product = getProductBySKU(sku);

            if (!product) {
                console.error(`Product not found for SKU: ${sku}`);
                continue;
            }

            // Get unit price
            const unitPrice = getUnitPrice(sku);

            // Get default quantity based on category
            const quantity = getDefaultQuantity(product.category);

            // Calculate material cost
            const materialCost = calculateMaterialCost(sku, quantity);

            // Calculate testing costs
            const testingCosts = testingRequirements.map((testName) => ({
                testName,
                cost: getTestingCost(testName),
            }));

            const totalTestingCost = testingCosts.reduce(
                (sum, test) => sum + test.cost,
                0
            );

            // Total cost
            const totalCost = materialCost + totalTestingCost;

            pricingResults.push({
                sku,
                productName: product.productName,
                unitPrice,
                quantity,
                materialCost,
                testingCosts,
                totalTestingCost,
                totalCost,
            });
        }

        return pricingResults;
    }

    /**
     * Calculate total bid value
     */
    calculateTotalBidValue(pricingResults: PricingResult[]): number {
        return pricingResults.reduce((sum, result) => sum + result.totalCost, 0);
    }

    /**
     * Generate pricing breakdown summary
     */
    generatePricingSummary(pricingResults: PricingResult[]): {
        totalMaterialCost: number;
        totalTestingCost: number;
        totalBidValue: number;
        breakdown: Array<{
            product: string;
            materialCost: number;
            testingCost: number;
            subtotal: number;
        }>;
    } {
        const breakdown = pricingResults.map((result) => ({
            product: result.productName,
            materialCost: result.materialCost,
            testingCost: result.totalTestingCost,
            subtotal: result.totalCost,
        }));

        const totalMaterialCost = pricingResults.reduce(
            (sum, r) => sum + r.materialCost,
            0
        );
        const totalTestingCost = pricingResults.reduce(
            (sum, r) => sum + r.totalTestingCost,
            0
        );
        const totalBidValue = totalMaterialCost + totalTestingCost;

        return {
            totalMaterialCost,
            totalTestingCost,
            totalBidValue,
            breakdown,
        };
    }

    /**
     * Complete pricing workflow
     */
    async generatePricing(
        technicalMatches: TopMatches[],
        testingRequirements: string[]
    ): Promise<{
        pricing: PricingResult[];
        totalBidValue: number;
    }> {
        const pricing = await this.calculatePricing(
            technicalMatches,
            testingRequirements
        );
        const totalBidValue = this.calculateTotalBidValue(pricing);

        return {
            pricing,
            totalBidValue,
        };
    }
}
