import { OEMSKU, ProductSpec, SpecMatchResult, TechnicalSpec } from "../schemas/rfp-schemas";

/**
 * Specification Matching Engine
 * Core innovation: Equal-weight parameter matching with detailed comparison
 */

interface ParameterMatch {
    parameter: string;
    rfpValue: string;
    oemValue: string;
    matches: boolean;
}

/**
 * Normalize parameter values for comparison
 */
function normalizeValue(value: string): string {
    return value.toLowerCase().trim().replace(/\s+/g, " ");
}

/**
 * Extract numeric value from string (handles units)
 */
function extractNumericValue(value: string): number | null {
    const match = value.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
}

/**
 * Check if two parameter values match
 * Handles exact matches, numeric comparisons, and fuzzy matching
 */
function valuesMatch(rfpValue: string, oemValue: string, parameter: string): boolean {
    const rfpNorm = normalizeValue(rfpValue);
    const oemNorm = normalizeValue(oemValue);

    // Exact match
    if (rfpNorm === oemNorm) {
        return true;
    }

    // Numeric comparison (for values with units)
    const rfpNum = extractNumericValue(rfpValue);
    const oemNum = extractNumericValue(oemValue);

    if (rfpNum !== null && oemNum !== null) {
        // Allow 5% tolerance for numeric values
        const tolerance = 0.05;
        const diff = Math.abs(rfpNum - oemNum) / rfpNum;
        return diff <= tolerance;
    }

    // Synonym matching for common terms
    const synonyms: Record<string, string[]> = {
        "xlpe": ["cross-linked polyethylene", "xlpe", "cross linked polyethylene"],
        "pvc": ["polyvinyl chloride", "pvc"],
        "lszh": ["low smoke zero halogen", "lszh", "ls0h"],
        "aluminum": ["aluminium", "aluminum", "al"],
        "copper": ["copper", "cu"],
        "onan": ["oil natural air natural", "onan"],
    };

    for (const [key, values] of Object.entries(synonyms)) {
        if (values.includes(rfpNorm) && values.includes(oemNorm)) {
            return true;
        }
    }

    return false;
}

/**
 * Find matching parameter in OEM specifications
 */
function findMatchingParameter(
    rfpParam: TechnicalSpec,
    oemSpecs: TechnicalSpec[]
): TechnicalSpec | null {
    // Try exact parameter name match first
    let match = oemSpecs.find(
        (spec) => normalizeValue(spec.parameter) === normalizeValue(rfpParam.parameter)
    );

    if (match) return match;

    // Try fuzzy parameter name matching
    const rfpParamNorm = normalizeValue(rfpParam.parameter);
    match = oemSpecs.find((spec) => {
        const oemParamNorm = normalizeValue(spec.parameter);
        return (
            rfpParamNorm.includes(oemParamNorm) ||
            oemParamNorm.includes(rfpParamNorm)
        );
    });

    return match || null;
}

/**
 * Calculate specification match between RFP product and OEM SKU
 * Returns match percentage and detailed comparison
 */
export function calculateSpecMatch(
    rfpProduct: ProductSpec,
    oemSKU: OEMSKU
): SpecMatchResult {
    const comparisonTable: ParameterMatch[] = [];
    let matchingParams = 0;
    const totalParams = rfpProduct.specifications.length;

    // Compare each RFP parameter with OEM specifications
    for (const rfpSpec of rfpProduct.specifications) {
        const oemSpec = findMatchingParameter(rfpSpec, oemSKU.specifications);

        if (oemSpec) {
            const matches = valuesMatch(rfpSpec.value, oemSpec.value, rfpSpec.parameter);

            comparisonTable.push({
                parameter: rfpSpec.parameter,
                rfpValue: `${rfpSpec.value}${rfpSpec.unit ? ` ${rfpSpec.unit}` : ""}`,
                oemValue: `${oemSpec.value}${oemSpec.unit ? ` ${oemSpec.unit}` : ""}`,
                matches,
            });

            if (matches) {
                matchingParams++;
            }
        } else {
            // Parameter not found in OEM specs
            comparisonTable.push({
                parameter: rfpSpec.parameter,
                rfpValue: `${rfpSpec.value}${rfpSpec.unit ? ` ${rfpSpec.unit}` : ""}`,
                oemValue: "Not Specified",
                matches: false,
            });
        }
    }

    // Calculate match percentage with equal weightage
    const specMatchPercentage = totalParams > 0
        ? Math.round((matchingParams / totalParams) * 100)
        : 0;

    return {
        sku: oemSKU.sku,
        productName: oemSKU.productName,
        specMatchPercentage,
        matchingParams,
        totalParams,
        comparisonTable,
    };
}

/**
 * Find top N matching SKUs for a product specification
 */
export function findTopMatches(
    rfpProduct: ProductSpec,
    oemCatalog: OEMSKU[],
    topN: number = 3
): SpecMatchResult[] {
    // Calculate match for all SKUs
    const allMatches = oemCatalog.map((sku) => calculateSpecMatch(rfpProduct, sku));

    // Sort by match percentage (descending)
    allMatches.sort((a, b) => b.specMatchPercentage - a.specMatchPercentage);

    // Return top N matches
    return allMatches.slice(0, topN);
}

/**
 * Get best matching SKU
 */
export function getBestMatch(
    rfpProduct: ProductSpec,
    oemCatalog: OEMSKU[]
): SpecMatchResult | null {
    const matches = findTopMatches(rfpProduct, oemCatalog, 1);
    return matches.length > 0 ? matches[0] : null;
}
