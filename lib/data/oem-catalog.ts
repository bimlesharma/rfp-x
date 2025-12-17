import { OEMSKU } from "../schemas/rfp-schemas";

/**
 * OEM Product Catalog
 * Contains sample products with detailed specifications
 */
export const oemCatalog: OEMSKU[] = [
    // 11kV XLPE Cables
    {
        sku: "SKU-XLPE-11KV-A",
        productName: "11kV XLPE Power Cable - Premium",
        category: "Power Cables",
        specifications: [
            { parameter: "Voltage Rating", value: "11", unit: "kV" },
            { parameter: "Insulation Type", value: "XLPE" },
            { parameter: "Conductor Material", value: "Aluminum" },
            { parameter: "Conductor Size", value: "240", unit: "sq.mm" },
            { parameter: "Number of Cores", value: "3" },
            { parameter: "Temperature Rating", value: "90", unit: "°C" },
            { parameter: "Sheath Material", value: "PVC" },
            { parameter: "Armoring", value: "Steel Wire Armored" },
            { parameter: "Standard", value: "IS 7098" },
        ],
    },
    {
        sku: "SKU-XLPE-11KV-B",
        productName: "11kV XLPE Power Cable - Standard",
        category: "Power Cables",
        specifications: [
            { parameter: "Voltage Rating", value: "11", unit: "kV" },
            { parameter: "Insulation Type", value: "XLPE" },
            { parameter: "Conductor Material", value: "Copper" },
            { parameter: "Conductor Size", value: "185", unit: "sq.mm" },
            { parameter: "Number of Cores", value: "3" },
            { parameter: "Temperature Rating", value: "90", unit: "°C" },
            { parameter: "Sheath Material", value: "LSZH" },
            { parameter: "Armoring", value: "Steel Wire Armored" },
            { parameter: "Standard", value: "IS 7098" },
        ],
    },
    {
        sku: "SKU-XLPE-11KV-C",
        productName: "11kV XLPE Power Cable - Economy",
        category: "Power Cables",
        specifications: [
            { parameter: "Voltage Rating", value: "11", unit: "kV" },
            { parameter: "Insulation Type", value: "XLPE" },
            { parameter: "Conductor Material", value: "Aluminum" },
            { parameter: "Conductor Size", value: "150", unit: "sq.mm" },
            { parameter: "Number of Cores", value: "3" },
            { parameter: "Temperature Rating", value: "85", unit: "°C" },
            { parameter: "Sheath Material", value: "PVC" },
            { parameter: "Armoring", value: "Galvanized Steel Tape" },
            { parameter: "Standard", value: "IS 7098" },
        ],
    },

    // 33kV XLPE Cables
    {
        sku: "SKU-XLPE-33KV-A",
        productName: "33kV XLPE Power Cable - Premium",
        category: "Power Cables",
        specifications: [
            { parameter: "Voltage Rating", value: "33", unit: "kV" },
            { parameter: "Insulation Type", value: "XLPE" },
            { parameter: "Conductor Material", value: "Copper" },
            { parameter: "Conductor Size", value: "400", unit: "sq.mm" },
            { parameter: "Number of Cores", value: "3" },
            { parameter: "Temperature Rating", value: "90", unit: "°C" },
            { parameter: "Sheath Material", value: "LSZH" },
            { parameter: "Armoring", value: "Double Steel Wire Armored" },
            { parameter: "Standard", value: "IS 7098" },
        ],
    },

    // Transformers
    {
        sku: "SKU-XFMR-1000KVA-A",
        productName: "1000 kVA Distribution Transformer",
        category: "Transformers",
        specifications: [
            { parameter: "Capacity", value: "1000", unit: "kVA" },
            { parameter: "Primary Voltage", value: "11", unit: "kV" },
            { parameter: "Secondary Voltage", value: "433", unit: "V" },
            { parameter: "Cooling Type", value: "ONAN" },
            { parameter: "Insulation Class", value: "A" },
            { parameter: "Frequency", value: "50", unit: "Hz" },
            { parameter: "Efficiency", value: "98.5", unit: "%" },
            { parameter: "Standard", value: "IS 1180" },
        ],
    },
    {
        sku: "SKU-XFMR-1500KVA-A",
        productName: "1500 kVA Distribution Transformer",
        category: "Transformers",
        specifications: [
            { parameter: "Capacity", value: "1500", unit: "kVA" },
            { parameter: "Primary Voltage", value: "11", unit: "kV" },
            { parameter: "Secondary Voltage", value: "433", unit: "V" },
            { parameter: "Cooling Type", value: "ONAN" },
            { parameter: "Insulation Class", value: "A" },
            { parameter: "Frequency", value: "50", unit: "Hz" },
            { parameter: "Efficiency", value: "98.7", unit: "%" },
            { parameter: "Standard", value: "IS 1180" },
        ],
    },

    // Switchgear
    {
        sku: "SKU-SWGR-11KV-VCB",
        productName: "11kV Vacuum Circuit Breaker Panel",
        category: "Switchgear",
        specifications: [
            { parameter: "Voltage Rating", value: "11", unit: "kV" },
            { parameter: "Current Rating", value: "630", unit: "A" },
            { parameter: "Breaking Capacity", value: "25", unit: "kA" },
            { parameter: "Type", value: "VCB" },
            { parameter: "Number of Poles", value: "3" },
            { parameter: "Insulation Type", value: "SF6" },
            { parameter: "Standard", value: "IS 13118" },
        ],
    },
    {
        sku: "SKU-SWGR-11KV-ACB",
        productName: "11kV Air Circuit Breaker Panel",
        category: "Switchgear",
        specifications: [
            { parameter: "Voltage Rating", value: "11", unit: "kV" },
            { parameter: "Current Rating", value: "800", unit: "A" },
            { parameter: "Breaking Capacity", value: "31.5", unit: "kA" },
            { parameter: "Type", value: "ACB" },
            { parameter: "Number of Poles", value: "3" },
            { parameter: "Insulation Type", value: "Air" },
            { parameter: "Standard", value: "IS 13118" },
        ],
    },

    // Control Panels
    {
        sku: "SKU-CTRL-LT-PANEL-A",
        productName: "LT Control Panel - 415V",
        category: "Control Panels",
        specifications: [
            { parameter: "Voltage Rating", value: "415", unit: "V" },
            { parameter: "Current Rating", value: "400", unit: "A" },
            { parameter: "Number of Outgoing Feeders", value: "8" },
            { parameter: "Protection Type", value: "MCB + MCCB" },
            { parameter: "Enclosure Rating", value: "IP54" },
            { parameter: "Standard", value: "IS 8623" },
        ],
    },
];

/**
 * Get OEM products by category
 */
export function getProductsByCategory(category: string): OEMSKU[] {
    return oemCatalog.filter((product) => product.category === category);
}

/**
 * Get OEM product by SKU
 */
export function getProductBySKU(sku: string): OEMSKU | undefined {
    return oemCatalog.find((product) => product.sku === sku);
}

/**
 * Search products by name
 */
export function searchProducts(query: string): OEMSKU[] {
    const lowerQuery = query.toLowerCase();
    return oemCatalog.filter((product) =>
        product.productName.toLowerCase().includes(lowerQuery) ||
        product.sku.toLowerCase().includes(lowerQuery)
    );
}
