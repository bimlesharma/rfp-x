/**
 * RFP Discovery Service
 * Simulates autonomous RFP discovery from various sources
 * Feature 1: Autonomous RFP Discovery & Qualification
 */

export interface DiscoveredRFP {
    id: string;
    rfpName: string;
    source: string;
    dueDate: string;
    discoveredDate: string;
    products: string[];
    estimatedValue: number;
    relevanceScore: number;
    status: "discovered" | "qualified" | "processed" | "rejected";
    daysUntilDue: number;
}

/**
 * Mock RFP sources (simulating LSTK portals, tender websites)
 */
const RFP_SOURCES = [
    "GeM Portal",
    "IREPS (Indian Railways)",
    "CPPP (Central Public Procurement Portal)",
    "NHAI Tenders",
    "State PWD Portal",
    "Metro Rail Corporations",
    "Power Grid Corporation",
    "Private LSTK Portals",
];

/**
 * Product categories for relevance scoring
 */
const RELEVANT_CATEGORIES = [
    "Power Cables",
    "Transformers",
    "Switchgear",
    "Control Panels",
    "Electrical Equipment",
    "Substation Equipment",
    "Distribution Equipment",
];

/**
 * Generate mock discovered RFPs
 */
export function generateDiscoveredRFPs(count: number = 10): DiscoveredRFP[] {
    const rfps: DiscoveredRFP[] = [];
    const today = new Date();

    const mockRFPTemplates = [
        {
            name: "Urban Metro Phase 3 - Electrical Systems",
            products: ["11kV XLPE Cable", "Distribution Transformers", "VCB Switchgear"],
            value: 15000000,
        },
        {
            name: "Highway Electrification Project - Zone A",
            products: ["Street Lighting Cables", "LT Control Panels", "Distribution Boards"],
            value: 8000000,
        },
        {
            name: "Industrial Park Substation Equipment",
            products: ["33kV Transformers", "ACB Switchgear", "Protection Relays"],
            value: 25000000,
        },
        {
            name: "Railway Station Modernization - Electrical Works",
            products: ["LT Cables", "MCCs", "Emergency Lighting Systems"],
            value: 12000000,
        },
        {
            name: "Smart City Phase 2 - Power Distribution",
            products: ["11kV XLPE Cable", "Ring Main Units", "Smart Meters"],
            value: 20000000,
        },
        {
            name: "Port Expansion - Electrical Infrastructure",
            products: ["HT Cables", "Transformers", "Switchgear"],
            value: 18000000,
        },
        {
            name: "Data Center Power Backup Systems",
            products: ["UPS Systems", "Transformers", "Distribution Panels"],
            value: 30000000,
        },
        {
            name: "Solar Farm Grid Connection Equipment",
            products: ["33kV Cables", "Inverters", "Transformers"],
            value: 22000000,
        },
        {
            name: "Hospital Complex Electrical Systems",
            products: ["LT Cables", "Emergency Panels", "Distribution Transformers"],
            value: 9000000,
        },
        {
            name: "Manufacturing Plant Expansion - Electrical",
            products: ["HT Cables", "VFDs", "Control Panels", "Transformers"],
            value: 16000000,
        },
    ];

    for (let i = 0; i < count; i++) {
        const template = mockRFPTemplates[i % mockRFPTemplates.length];
        const daysUntilDue = Math.floor(Math.random() * 90) + 1; // 1-90 days
        const discoveredDaysAgo = Math.floor(Math.random() * 5); // 0-5 days ago

        const dueDate = new Date(today);
        dueDate.setDate(dueDate.getDate() + daysUntilDue);

        const discoveredDate = new Date(today);
        discoveredDate.setDate(discoveredDate.getDate() - discoveredDaysAgo);

        const relevanceScore = calculateRelevanceScore(template.products, daysUntilDue);

        rfps.push({
            id: `RFP-${String(i + 1).padStart(4, "0")}`,
            rfpName: `${template.name} - ${2025 + Math.floor(i / 3)}`,
            source: RFP_SOURCES[Math.floor(Math.random() * RFP_SOURCES.length)],
            dueDate: dueDate.toISOString().split("T")[0],
            discoveredDate: discoveredDate.toISOString().split("T")[0],
            products: template.products,
            estimatedValue: template.value,
            relevanceScore,
            status: relevanceScore >= 75 ? "qualified" : "discovered",
            daysUntilDue,
        });
    }

    // Sort by due date (nearest first)
    return rfps.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
}

/**
 * Calculate relevance score based on products and timeline
 */
function calculateRelevanceScore(products: string[], daysUntilDue: number): number {
    let score = 50; // Base score

    // Product relevance (0-40 points)
    const relevantProductCount = products.filter((product) =>
        RELEVANT_CATEGORIES.some((category) =>
            product.toLowerCase().includes(category.toLowerCase())
        )
    ).length;
    score += (relevantProductCount / products.length) * 40;

    // Timeline relevance (0-10 points)
    if (daysUntilDue >= 14) {
        score += 10; // Adequate time to respond
    } else if (daysUntilDue >= 7) {
        score += 5; // Tight but doable
    }
    // else 0 points for very tight deadlines

    return Math.round(Math.min(score, 100));
}

/**
 * Filter RFPs by criteria
 */
export function filterRFPs(
    rfps: DiscoveredRFP[],
    criteria: {
        maxDaysUntilDue?: number;
        minRelevanceScore?: number;
        sources?: string[];
    }
): DiscoveredRFP[] {
    return rfps.filter((rfp) => {
        if (criteria.maxDaysUntilDue && rfp.daysUntilDue > criteria.maxDaysUntilDue) {
            return false;
        }
        if (criteria.minRelevanceScore && rfp.relevanceScore < criteria.minRelevanceScore) {
            return false;
        }
        if (criteria.sources && !criteria.sources.includes(rfp.source)) {
            return false;
        }
        return true;
    });
}

/**
 * Get RFPs within 90-day window (Feature 1 requirement)
 */
export function getRFPsWithin90Days(): DiscoveredRFP[] {
    const allRFPs = generateDiscoveredRFPs(10);
    return filterRFPs(allRFPs, { maxDaysUntilDue: 90 });
}

/**
 * Get high-priority RFPs (high relevance + adequate time)
 */
export function getHighPriorityRFPs(): DiscoveredRFP[] {
    const allRFPs = generateDiscoveredRFPs(10);
    return filterRFPs(allRFPs, {
        maxDaysUntilDue: 90,
        minRelevanceScore: 70,
    });
}

/**
 * RFP Discovery Agent - Main interface
 */
export class RFPDiscoveryAgent {
    /**
     * Scan for new RFPs (simulated)
     */
    async scanRFPSources(): Promise<DiscoveredRFP[]> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        return generateDiscoveredRFPs(10);
    }

    /**
     * Qualify discovered RFPs
     */
    async qualifyRFPs(rfps: DiscoveredRFP[]): Promise<DiscoveredRFP[]> {
        return rfps.map((rfp) => ({
            ...rfp,
            status: rfp.relevanceScore >= 75 ? "qualified" : rfp.status,
        }));
    }

    /**
     * Get actionable RFPs (within 90 days, high relevance)
     */
    async getActionableRFPs(): Promise<DiscoveredRFP[]> {
        const allRFPs = await this.scanRFPSources();
        const filtered = filterRFPs(allRFPs, {
            maxDaysUntilDue: 90,
            minRelevanceScore: 60,
        });
        return this.qualifyRFPs(filtered);
    }
}
