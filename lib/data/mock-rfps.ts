/**
 * Mock RFP Documents for Demonstration
 */

export interface MockRFP {
    id: string;
    name: string;
    content: string;
}

export const mockRFPs: MockRFP[] = [
    {
        id: "rfp-001",
        name: "Metro Rail Power Cable Tender",
        content: `
REQUEST FOR PROPOSAL
Metro Rail Power Cable Supply and Installation

RFP Name: Metro Rail Phase 2 - Power Cable Tender
Due Date: 2025-10-15
Project: Metro Rail Underground Corridor Extension

SCOPE OF SUPPLY:

1. 11kV XLPE Power Cables
   - Voltage Rating: 11 kV
   - Insulation Type: XLPE (Cross-Linked Polyethylene)
   - Conductor Material: Aluminum
   - Conductor Size: 240 sq.mm
   - Number of Cores: 3 Core
   - Temperature Rating: 90°C
   - Sheath Material: PVC
   - Armoring: Steel Wire Armored
   - Standard: IS 7098
   - Quantity Required: 5000 meters

TESTING AND ACCEPTANCE REQUIREMENTS:
- High Voltage Test (as per IS 7098)
- Insulation Resistance Test
- Partial Discharge Test
- Thermal Aging Test
- Routine Test

DELIVERY TIMELINE: Within 90 days of purchase order
PAYMENT TERMS: 30% advance, 60% on delivery, 10% after installation

Please submit your technical and commercial bids separately.
    `.trim(),
    },
    {
        id: "rfp-002",
        name: "Industrial Substation Equipment RFP",
        content: `
REQUEST FOR PROPOSAL
Industrial Substation Equipment Supply

RFP Name: Manufacturing Plant Substation Upgrade
Due Date: 2025-11-20
Project: 33kV Substation Modernization

SCOPE OF SUPPLY:

1. Distribution Transformer
   - Capacity: 1500 kVA
   - Primary Voltage: 11 kV
   - Secondary Voltage: 433 V
   - Cooling Type: ONAN (Oil Natural Air Natural)
   - Insulation Class: A
   - Frequency: 50 Hz
   - Efficiency: Minimum 98.5%
   - Standard: IS 1180
   - Quantity: 2 units

2. 11kV Vacuum Circuit Breaker Panel
   - Voltage Rating: 11 kV
   - Current Rating: 630 A
   - Breaking Capacity: 25 kA
   - Type: VCB (Vacuum Circuit Breaker)
   - Number of Poles: 3
   - Insulation Type: SF6
   - Standard: IS 13118
   - Quantity: 3 panels

TESTING REQUIREMENTS:
- No Load Loss Test
- Load Loss Test
- Temperature Rise Test
- Impulse Voltage Test
- Breaking Capacity Test
- Routine Test
- Type Test

DELIVERY: 120 days from award
INSTALLATION: Vendor responsibility with 2-year warranty
    `.trim(),
    },
    {
        id: "rfp-003",
        name: "Government Infrastructure Power Distribution",
        content: `
REQUEST FOR PROPOSAL
Power Distribution Equipment for Smart City Project

RFP Name: Smart City Phase 1 - Electrical Infrastructure
Due Date: 2025-12-30
Issuing Authority: State Public Works Department

TECHNICAL REQUIREMENTS:

1. 33kV XLPE Power Cables
   - Voltage Rating: 33 kV
   - Insulation Type: XLPE
   - Conductor Material: Copper
   - Conductor Size: 400 sq.mm
   - Number of Cores: 3 Core
   - Temperature Rating: 90°C
   - Sheath Material: LSZH (Low Smoke Zero Halogen)
   - Armoring: Double Steel Wire Armored
   - Standard: IS 7098
   - Quantity: 3000 meters

2. LT Control Panels
   - Voltage Rating: 415 V
   - Current Rating: 400 A
   - Number of Outgoing Feeders: 8
   - Protection Type: MCB + MCCB
   - Enclosure Rating: IP54
   - Standard: IS 8623
   - Quantity: 10 panels

MANDATORY TESTS:
- High Voltage Test
- Short Circuit Test
- Fire Resistance Test
- Water Immersion Test
- Routine Test
- Sample Test

COMPLIANCE: All equipment must be BIS certified
DELIVERY: Phased delivery over 6 months
    `.trim(),
    },
];

/**
 * Get mock RFP by ID
 */
export function getMockRFPById(id: string): MockRFP | undefined {
    return mockRFPs.find((rfp) => rfp.id === id);
}

/**
 * Get all mock RFPs
 */
export function getAllMockRFPs(): MockRFP[] {
    return mockRFPs;
}
