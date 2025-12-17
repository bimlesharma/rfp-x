import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FinalRFPResponse } from "@/lib/schemas/rfp-schemas";

interface ProposalConfig {
    companyName: string;
    companyLogo?: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    primaryColor: [number, number, number]; // RGB
    accentColor: [number, number, number]; // RGB
}

const defaultConfig: ProposalConfig = {
    companyName: "RFP-X Pvt. Ltd.",
    address: "123 Business Street, City, State 12345",
    phone: "+1 (555) 123-4567",
    email: "contact@rfpx.com",
    website: "www.rfpx.com",
    primaryColor: [124, 58, 237],
    accentColor: [139, 92, 246],
};

// Custom currency formatter for PDF (avoids jsPDF formatting issues)
function formatCurrencyForPDF(amount: number): string {
    // Format without special characters that cause spacing issues
    const formatted = amount.toLocaleString("en-IN", {
        maximumFractionDigits: 0,
        useGrouping: true,
    });
    return `Rs. ${formatted}`;
}

// Custom date formatter for PDF
function formatDateForPDF(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

export async function generateProposalPDF(
    response: FinalRFPResponse,
    config: Partial<ProposalConfig> = {}
): Promise<void> {
    const cfg = { ...defaultConfig, ...config };
    const doc = new jsPDF();

    let yPosition = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;

    // Helper function to add new page with letterhead
    const addPageWithLetterhead = () => {
        doc.addPage();
        yPosition = 20;
        addLetterhead();
    };

    // Add letterhead
    const addLetterhead = () => {
        // Header background
        doc.setFillColor(cfg.primaryColor[0], cfg.primaryColor[1], cfg.primaryColor[2]);
        doc.rect(0, 0, pageWidth, 40, "F");

        // Company name
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text(cfg.companyName, margin, 25);

        // Tagline
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Professional RFP Response Solutions", margin, 32);

        // Reset text color
        doc.setTextColor(0, 0, 0);
        yPosition = 50;
    };

    // Add footer
    const addFooter = (pageNum: number, totalPages: number) => {
        const footerY = pageHeight - 15;

        // Footer line
        doc.setDrawColor(cfg.accentColor[0], cfg.accentColor[1], cfg.accentColor[2]);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        // Contact info
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`${cfg.address} | ${cfg.phone} | ${cfg.email} | ${cfg.website}`, pageWidth / 2, footerY, {
            align: "center",
        });

        // Page number
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, footerY, {
            align: "right",
        });
    };

    // Initial letterhead
    addLetterhead();

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cfg.primaryColor[0], cfg.primaryColor[1], cfg.primaryColor[2]);
    doc.text("PROPOSAL DOCUMENT", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // RFP Details Box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(margin, yPosition, contentWidth, 30, 3, 3, "F");

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("RFP Name:", margin + 5, yPosition + 10);
    doc.setFont("helvetica", "normal");
    doc.text(response.rfpSummary.rfpName, margin + 35, yPosition + 10);

    doc.setFont("helvetica", "bold");
    doc.text("Due Date:", margin + 5, yPosition + 18);
    doc.setFont("helvetica", "normal");
    doc.text(formatDateForPDF(response.rfpSummary.dueDate), margin + 35, yPosition + 18);

    doc.setFont("helvetica", "bold");
    doc.text("Proposal Date:", margin + 5, yPosition + 26);
    doc.setFont("helvetica", "normal");
    doc.text(formatDateForPDF(response.generatedAt), margin + 35, yPosition + 26);

    yPosition += 40;

    // Executive Summary
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cfg.primaryColor[0], cfg.primaryColor[1], cfg.primaryColor[2]);
    doc.text("Executive Summary", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const summaryText = `We are pleased to submit this comprehensive proposal in response to your RFP for ${response.rfpSummary.products.join(", ")}. Our solution offers the best combination of quality, technical compliance, and competitive pricing.`;
    const splitSummary = doc.splitTextToSize(summaryText, contentWidth);
    doc.text(splitSummary, margin, yPosition);
    yPosition += splitSummary.length * 6 + 10;

    // Total Bid Value Highlight
    doc.setFillColor(cfg.accentColor[0], cfg.accentColor[1], cfg.accentColor[2]);
    doc.roundedRect(margin, yPosition, contentWidth, 20, 3, 3, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Total Bid Value:", margin + 5, yPosition + 13);
    doc.setFontSize(18);
    doc.text(formatCurrencyForPDF(response.totalBidValue), pageWidth - margin - 5, yPosition + 13, {
        align: "right",
    });
    yPosition += 30;

    // Check if we need a new page
    if (yPosition > pageHeight - 60) {
        addPageWithLetterhead();
    }

    // Technical Specifications
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cfg.primaryColor[0], cfg.primaryColor[1], cfg.primaryColor[2]);
    doc.text("Technical Specifications", margin, yPosition);
    yPosition += 10;

    // Technical matches table
    response.technicalMatches.forEach((match, idx) => {
        if (yPosition > pageHeight - 80) {
            addPageWithLetterhead();
        }

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text(`${idx + 1}. ${match.productName}`, margin, yPosition);
        yPosition += 8;

        const selectedMatch = match.topMatches.find((m) => m.sku === match.selectedSKU) || match.topMatches[0];

        // Recommended SKU box
        doc.setFillColor(240, 253, 244);
        doc.roundedRect(margin, yPosition, contentWidth, 15, 2, 2, "F");
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text(`Recommended: ${selectedMatch.productName} (${selectedMatch.sku})`, margin + 3, yPosition + 6);
        doc.setFont("helvetica", "normal");
        doc.text(`Match Score: ${selectedMatch.specMatchPercentage}%`, margin + 3, yPosition + 11);
        yPosition += 20;

        // Comparison table
        autoTable(doc, {
            startY: yPosition,
            head: [["Parameter", "RFP Requirement", "Our Specification", "Match"]],
            body: selectedMatch.comparisonTable.map((row) => [
                row.parameter,
                row.rfpValue,
                row.oemValue,
                row.matches ? "✓" : "✗",
            ]),
            theme: "grid",
            headStyles: {
                fillColor: cfg.primaryColor,
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: "bold",
            },
            bodyStyles: {
                fontSize: 9,
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250],
            },
            margin: { left: margin, right: margin },
        });

        yPosition = (doc as any).lastAutoTable.finalY + 10;
    });

    // Pricing Breakdown
    if (yPosition > pageHeight - 100) {
        addPageWithLetterhead();
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cfg.primaryColor[0], cfg.primaryColor[1], cfg.primaryColor[2]);
    doc.text("Pricing Breakdown", margin, yPosition);
    yPosition += 10;

    // Pricing table
    const pricingData = response.pricing.map((item) => [
        item.sku,
        item.productName,
        item.quantity.toString(),
        formatCurrencyForPDF(item.unitPrice),
        formatCurrencyForPDF(item.materialCost),
        formatCurrencyForPDF(item.totalTestingCost),
        formatCurrencyForPDF(item.totalCost),
    ]);

    autoTable(doc, {
        startY: yPosition,
        head: [["SKU", "Product", "Qty", "Unit Price", "Material", "Testing", "Total"]],
        body: pricingData,
        foot: [["", "", "", "", "", "Grand Total:", formatCurrencyForPDF(response.totalBidValue)]],
        theme: "striped",
        headStyles: {
            fillColor: cfg.primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: "bold",
        },
        footStyles: {
            fillColor: cfg.accentColor,
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold",
        },
        bodyStyles: {
            fontSize: 9,
        },
        margin: { left: margin, right: margin },
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;

    // Terms and Conditions
    if (yPosition > pageHeight - 80) {
        addPageWithLetterhead();
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(cfg.primaryColor[0], cfg.primaryColor[1], cfg.primaryColor[2]);
    doc.text("Terms & Conditions", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    const terms = [
        "1. Validity: This proposal is valid for 90 days from the date of submission.",
        "2. Delivery: Products will be delivered within 30-45 days of order confirmation.",
        "3. Payment Terms: 30% advance, 60% on delivery, 10% after installation.",
        "4. Warranty: All products come with manufacturer's standard warranty.",
        "5. Installation: Professional installation services included in the pricing.",
    ];

    terms.forEach((term) => {
        const splitTerm = doc.splitTextToSize(term, contentWidth);
        doc.text(splitTerm, margin, yPosition);
        yPosition += splitTerm.length * 5 + 3;
    });

    yPosition += 10;

    // Signature Section
    if (yPosition > pageHeight - 60) {
        addPageWithLetterhead();
    }

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Authorized Signature", margin, yPosition);
    yPosition += 20;

    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, margin + 60, yPosition);
    yPosition += 5;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Signature", margin, yPosition);
    yPosition += 10;

    doc.text("Name: _______________________", margin, yPosition);
    yPosition += 7;
    doc.text("Title: _______________________", margin, yPosition);
    yPosition += 7;
    doc.text("Date: _______________________", margin, yPosition);

    // Add footers to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(i, totalPages);
    }

    // Save the PDF
    const filename = `proposal-${response.rfpSummary.rfpName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
    doc.save(filename);
}
