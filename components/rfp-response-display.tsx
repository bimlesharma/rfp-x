"use client";

import { Check, X, Download, RotateCcw } from "lucide-react";
import { FinalRFPResponse } from "@/lib/schemas/rfp-schemas";
import { formatCurrency, formatDate, getMatchQuality } from "@/lib/utils";
import { showSuccess, showError } from "@/lib/utils/toast";
import * as XLSX from "xlsx";

interface RFPResponseDisplayProps {
    response: FinalRFPResponse;
    onReset: () => void;
}

export default function RFPResponseDisplay({ response, onReset }: RFPResponseDisplayProps) {
    const handleExportJSON = () => {
        try {
            const dataStr = JSON.stringify(response, null, 2);
            const filename = `rfp-response-${response.rfpSummary.rfpName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.json`;

            // Create blob with explicit type
            const blob = new Blob([dataStr], { type: "application/json" });

            // Create download link
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = filename;

            // Trigger download
            document.body.appendChild(link);
            link.click();

            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
            showSuccess("JSON exported successfully");
        } catch (error) {
            console.error("Error exporting JSON:", error);
            showError("Failed to export JSON", "Please try again");
        }
    };

    const handleExportExcel = () => {
        try {
            const workbook = XLSX.utils.book_new();

            // Summary Sheet
            const summaryData = [
                ["RFP RESPONSE SUMMARY"],
                [""],
                ["RFP Name", response.rfpSummary.rfpName],
                ["Due Date", response.rfpSummary.dueDate],
                ["Generated At", new Date(response.generatedAt).toLocaleString()],
                ["Total Bid Value", response.totalBidValue],
                [""],
                ["PRODUCTS IN SCOPE"],
                ...response.rfpSummary.products.map((p) => [p]),
                [""],
                ["TESTING REQUIREMENTS"],
                ...response.rfpSummary.tests.map((t) => [t]),
            ];
            const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);

            // Set column widths for summary
            summarySheet['!cols'] = [
                { wch: 20 },  // Column A
                { wch: 50 }   // Column B
            ];

            // Format currency cell
            if (summarySheet['B6']) {
                summarySheet['B6'].z = '₹#,##0';
            }

            XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

            // Technical Matches Sheet with detailed comparison
            const technicalData: any[][] = [
                ["TECHNICAL SPECIFICATION MATCHES"],
                [""],
            ];

            response.technicalMatches.forEach((match) => {
                technicalData.push(["Product:", match.productName]);
                technicalData.push([""]); // Empty row
                technicalData.push(["Rank", "SKU", "Product Name", "Match %", "Matching Params", "Total Params"]);

                match.topMatches.forEach((topMatch, idx) => {
                    technicalData.push([
                        `#${idx + 1}`,
                        topMatch.sku,
                        topMatch.productName,
                        topMatch.specMatchPercentage / 100, // Format as percentage
                        topMatch.matchingParams,
                        topMatch.totalParams,
                    ]);
                });

                // Add detailed comparison for selected SKU
                const selectedMatch = match.topMatches.find(m => m.sku === match.selectedSKU) || match.topMatches[0];
                technicalData.push([""]);
                technicalData.push(["DETAILED COMPARISON - Selected SKU:", selectedMatch.sku]);
                technicalData.push(["Parameter", "RFP Requirement", "OEM Specification", "Match"]);

                selectedMatch.comparisonTable.forEach((row) => {
                    technicalData.push([
                        row.parameter,
                        row.rfpValue,
                        row.oemValue,
                        row.matches ? "✓" : "✗"
                    ]);
                });

                technicalData.push([""]); // Separator between products
                technicalData.push([""]);
            });

            const technicalSheet = XLSX.utils.aoa_to_sheet(technicalData);

            // Set column widths for technical sheet
            technicalSheet['!cols'] = [
                { wch: 12 },  // Rank/Parameter
                { wch: 20 },  // SKU/RFP Requirement
                { wch: 35 },  // Product Name/OEM Spec
                { wch: 12 },  // Match %
                { wch: 15 },  // Matching Params
                { wch: 12 }   // Total Params
            ];

            XLSX.utils.book_append_sheet(workbook, technicalSheet, "Technical Matches");

            // Pricing Sheet
            const pricingData: any[][] = [
                ["PRICING BREAKDOWN"],
                [""],
                ["SKU", "Product", "Quantity", "Unit Price", "Material Cost", "Testing Cost", "Total Cost"],
            ];

            response.pricing.forEach((item) => {
                pricingData.push([
                    item.sku,
                    item.productName,
                    item.quantity,
                    item.unitPrice,
                    item.materialCost,
                    item.totalTestingCost,
                    item.totalCost,
                ]);

                // Add testing details
                if (item.testingCosts.length > 0) {
                    pricingData.push(["", "Testing Details:", "", "", "", "", ""]);
                    item.testingCosts.forEach((test) => {
                        pricingData.push(["", "", test.testName, "", "", test.cost, ""]);
                    });
                    pricingData.push([""]); // Separator
                }
            });

            pricingData.push([""]);
            pricingData.push(["", "", "", "", "", "TOTAL BID VALUE", response.totalBidValue]);

            const pricingSheet = XLSX.utils.aoa_to_sheet(pricingData);

            // Set column widths for pricing sheet
            pricingSheet['!cols'] = [
                { wch: 20 },  // SKU
                { wch: 35 },  // Product
                { wch: 12 },  // Quantity
                { wch: 15 },  // Unit Price
                { wch: 15 },  // Material Cost
                { wch: 15 },  // Testing Cost
                { wch: 15 }   // Total Cost
            ];

            // Format currency columns (D, E, F, G - indices 3, 4, 5, 6)
            const currencyFormat = '₹#,##0';
            Object.keys(pricingSheet).forEach((cell) => {
                if (cell[0] === '!' || !pricingSheet[cell].v) return;
                const col = cell.replace(/[0-9]/g, '');
                const row = parseInt(cell.replace(/[A-Z]/g, ''));

                // Format currency columns (D, E, F, G) starting from row 4
                if (row >= 4 && ['D', 'E', 'F', 'G'].includes(col)) {
                    if (typeof pricingSheet[cell].v === 'number') {
                        pricingSheet[cell].z = currencyFormat;
                    }
                }
            });

            XLSX.utils.book_append_sheet(workbook, pricingSheet, "Pricing");

            const filename = `rfp-response-${response.rfpSummary.rfpName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.xlsx`;
            XLSX.writeFile(workbook, filename);
            showSuccess("Excel exported successfully");
        } catch (error) {
            console.error("Error exporting Excel:", error);
            showError("Failed to export Excel", "Please try again");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            RFP Response Generated
                        </h2>
                        <p className="text-gray-600">
                            {response.rfpSummary.rfpName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                            Due: {formatDate(response.rfpSummary.dueDate)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportJSON}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            JSON
                        </button>
                        <button
                            onClick={handleExportExcel}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Excel
                        </button>
                        <button
                            onClick={onReset}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                        >
                            <RotateCcw className="w-4 h-4" />
                            New RFP
                        </button>
                    </div>
                </div>
            </div>

            {/* Total Bid Value */}
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-xl shadow-lg p-8 text-white">
                <p className="text-purple-100 text-sm font-medium mb-2">Total Bid Value</p>
                <p className="text-4xl font-bold">{formatCurrency(response.totalBidValue)}</p>
            </div>

            {/* Technical Matches */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Technical Specification Matches
                </h3>
                <div className="space-y-6">
                    {response.technicalMatches.map((match, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b">
                                <h4 className="font-semibold text-gray-900">{match.productName}</h4>
                            </div>

                            {/* Top 3 Matches */}
                            <div className="p-4 space-y-3">
                                {match.topMatches.map((topMatch, matchIdx) => {
                                    const quality = getMatchQuality(topMatch.specMatchPercentage);
                                    const isSelected = topMatch.sku === match.selectedSKU;

                                    return (
                                        <div
                                            key={matchIdx}
                                            className={`p-4 rounded-lg border-2 ${isSelected
                                                ? "border-purple-600 bg-purple-50"
                                                : "border-gray-200 bg-white"
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {topMatch.productName}
                                                    </p>
                                                    <p className="text-sm text-gray-600">{topMatch.sku}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-2xl font-bold ${quality.color}`}>
                                                        {topMatch.specMatchPercentage}%
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {topMatch.matchingParams}/{topMatch.totalParams} params
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Comparison Table */}
                                            <div className="mt-3 overflow-x-auto">
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="border-b">
                                                            <th className="text-left py-2 px-2 font-medium text-gray-700">Parameter</th>
                                                            <th className="text-left py-2 px-2 font-medium text-gray-700">RFP Requirement</th>
                                                            <th className="text-left py-2 px-2 font-medium text-gray-700">OEM Specification</th>
                                                            <th className="text-center py-2 px-2 font-medium text-gray-700">Match</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {topMatch.comparisonTable.map((row, rowIdx) => (
                                                            <tr key={rowIdx} className="border-b last:border-0">
                                                                <td className="py-2 px-2 font-medium text-gray-900">{row.parameter}</td>
                                                                <td className="py-2 px-2 text-gray-700">{row.rfpValue}</td>
                                                                <td className="py-2 px-2 text-gray-700">{row.oemValue}</td>
                                                                <td className="py-2 px-2 text-center">
                                                                    {row.matches ? (
                                                                        <Check className="w-5 h-5 text-green-600 mx-auto" />
                                                                    ) : (
                                                                        <X className="w-5 h-5 text-red-600 mx-auto" />
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {isSelected && (
                                                <div className="mt-3 px-3 py-2 bg-purple-100 rounded-lg">
                                                    <p className="text-sm font-medium text-purple-900">
                                                        ✓ Selected for bid
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Pricing Breakdown
                </h3>
                <div className="space-y-4">
                    {response.pricing.map((item, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                                    <p className="text-sm text-gray-600">{item.sku}</p>
                                </div>
                                <p className="text-xl font-bold text-purple-600">
                                    {formatCurrency(item.totalCost)}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <p className="text-gray-600">Quantity</p>
                                    <p className="font-semibold text-gray-900">{item.quantity}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Unit Price</p>
                                    <p className="font-semibold text-gray-900">{formatCurrency(item.unitPrice)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Material Cost</p>
                                    <p className="font-semibold text-gray-900">{formatCurrency(item.materialCost)}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">Testing Cost</p>
                                    <p className="font-semibold text-gray-900">{formatCurrency(item.totalTestingCost)}</p>
                                </div>
                            </div>

                            {item.testingCosts.length > 0 && (
                                <div className="mt-3 pt-3 border-t">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Testing Requirements:</p>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {item.testingCosts.map((test, testIdx) => (
                                            <div key={testIdx} className="flex justify-between">
                                                <span className="text-gray-600">{test.testName}</span>
                                                <span className="font-medium text-gray-900">{formatCurrency(test.cost)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
