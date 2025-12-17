import OpenAI from "openai";
import { RFPSummary, RFPSummarySchema, ProductSpec, ProductSpecSchema } from "../schemas/rfp-schemas";

/**
 * Sales Agent - RFP Identification and Qualification
 * Responsible for parsing RFP documents and extracting structured information
 * Using Groq API with OpenAI SDK for fast, reliable processing
 */

export class SalesAgent {
    private client: OpenAI;
    private model: string = "llama-3.3-70b-versatile";

    constructor(apiKey: string) {
        this.client = new OpenAI({
            apiKey,
            baseURL: "https://api.groq.com/openai/v1",
        });
    }

    /**
     * Parse RFP document and extract structured summary
     */
    async parseRFP(rfpText: string): Promise<RFPSummary> {
        const prompt = `You are a Sales Agent analyzing B2B RFP documents for industrial manufacturers.

Extract the following information from the RFP document and return it as a JSON object:
1. RFP Name
2. Due Date (in YYYY-MM-DD format)
3. List of products in scope of supply
4. Testing and acceptance requirements

RFP Document:
${rfpText}

Return ONLY a JSON object in this exact format:
{
  "rfpName": "string",
  "dueDate": "YYYY-MM-DD",
  "products": ["product1", "product2"],
  "tests": ["test1", "test2"]
}

If information is not found, use reasonable defaults. Do not include any other text.`;

        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.1,
            max_tokens: 1000,
        });

        const content = response.choices[0]?.message?.content || "";

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error("Failed to extract JSON from response");
        }

        const parsed = JSON.parse(jsonMatch[0]);
        const validated = RFPSummarySchema.parse(parsed);

        return {
            ...validated,
            rawText: rfpText,
        };
    }

    /**
     * Extract detailed product specifications from RFP
     */
    async extractProductSpecs(rfpText: string, productNames: string[]): Promise<ProductSpec[]> {
        const productSpecs: ProductSpec[] = [];

        for (const productName of productNames) {
            const prompt = `You are a Technical Specification Analyst. Extract detailed technical specifications for the following product from the RFP document.

Product: ${productName}

RFP Document:
${rfpText}

Extract all technical parameters in the following JSON format:
{
  "productName": "${productName}",
  "specifications": [
    {
      "parameter": "parameter name",
      "value": "value",
      "unit": "unit or empty string if not applicable"
    }
  ]
}

Include parameters like:
- Voltage Rating
- Current Rating
- Insulation Type
- Conductor Material
- Temperature Rating
- Capacity
- Standard/Certification
- Any other technical specifications mentioned

IMPORTANT: For the "unit" field, use an empty string "" if the parameter doesn't have a unit (e.g., for material types, standards). Never use null.

Return ONLY the JSON object, no additional text.`;

            try {
                const response = await this.client.chat.completions.create({
                    model: this.model,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.1,
                    max_tokens: 2000,
                });

                const content = response.choices[0]?.message?.content || "";

                // Extract JSON from response
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);

                    // Convert null units to empty strings to avoid Zod validation errors
                    if (parsed.specifications && Array.isArray(parsed.specifications)) {
                        parsed.specifications = parsed.specifications.map((spec: any) => ({
                            ...spec,
                            unit: spec.unit === null || spec.unit === undefined ? "" : spec.unit
                        }));
                    }

                    const validated = ProductSpecSchema.parse(parsed);
                    productSpecs.push(validated);
                }
            } catch (error) {
                console.error(`Error extracting specs for ${productName}:`, error);
                // Add empty spec as fallback
                productSpecs.push({
                    productName,
                    specifications: [],
                });
            }
        }

        return productSpecs;
    }

    /**
     * Complete RFP qualification workflow
     */
    async qualifyRFP(rfpText: string): Promise<{
        summary: RFPSummary;
        productSpecs: ProductSpec[];
    }> {
        // Step 1: Parse RFP summary
        const summary = await this.parseRFP(rfpText);

        // Step 2: Extract detailed product specifications
        const productSpecs = await this.extractProductSpecs(rfpText, summary.products);

        return {
            summary,
            productSpecs,
        };
    }
}
