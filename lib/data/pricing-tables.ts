/**
 * Synthetic Pricing Tables for MVP
 */

/**
 * Unit Pricing Table - Price per unit for each SKU
 */
export const unitPricingTable: Record<string, number> = {
    // 11kV XLPE Cables (price per meter)
    "SKU-XLPE-11KV-A": 1250,
    "SKU-XLPE-11KV-B": 1450,
    "SKU-XLPE-11KV-C": 980,

    // 33kV XLPE Cables (price per meter)
    "SKU-XLPE-33KV-A": 2800,

    // Transformers (price per unit)
    "SKU-XFMR-1000KVA-A": 450000,
    "SKU-XFMR-1500KVA-A": 625000,

    // Switchgear (price per panel)
    "SKU-SWGR-11KV-VCB": 385000,
    "SKU-SWGR-11KV-ACB": 425000,

    // Control Panels (price per panel)
    "SKU-CTRL-LT-PANEL-A": 125000,
};

/**
 * Testing Service Pricing Table
 */
export const testingPricingTable: Record<string, number> = {
    // Electrical Tests
    "High Voltage Test": 15000,
    "Insulation Resistance Test": 8000,
    "Partial Discharge Test": 25000,
    "Thermal Aging Test": 35000,
    "Short Circuit Test": 45000,

    // Mechanical Tests
    "Tensile Strength Test": 12000,
    "Elongation Test": 10000,
    "Impact Test": 18000,

    // Environmental Tests
    "Water Immersion Test": 20000,
    "Fire Resistance Test": 30000,
    "UV Resistance Test": 22000,

    // Transformer Tests
    "No Load Loss Test": 18000,
    "Load Loss Test": 20000,
    "Temperature Rise Test": 28000,
    "Impulse Voltage Test": 40000,

    // Switchgear Tests
    "Breaking Capacity Test": 50000,
    "Making Capacity Test": 45000,
    "Mechanical Endurance Test": 35000,

    // Standard Acceptance Tests
    "Type Test": 75000,
    "Routine Test": 25000,
    "Sample Test": 15000,
};

/**
 * Default Quantities by Category
 */
export const defaultQuantities: Record<string, number> = {
    "Power Cables": 1000, // meters
    "Transformers": 2, // units
    "Switchgear": 3, // panels
    "Control Panels": 5, // panels
};

/**
 * Get unit price for a SKU
 */
export function getUnitPrice(sku: string): number {
    return unitPricingTable[sku] || 0;
}

/**
 * Get testing cost
 */
export function getTestingCost(testName: string): number {
    return testingPricingTable[testName] || 0;
}

/**
 * Get default quantity for a category
 */
export function getDefaultQuantity(category: string): number {
    return defaultQuantities[category] || 1;
}

/**
 * Calculate total material cost
 */
export function calculateMaterialCost(sku: string, quantity: number): number {
    const unitPrice = getUnitPrice(sku);
    return unitPrice * quantity;
}

/**
 * Calculate total testing cost
 */
export function calculateTestingCost(tests: string[]): number {
    return tests.reduce((total, test) => total + getTestingCost(test), 0);
}
