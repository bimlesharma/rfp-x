import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
}

/**
 * Get match quality label
 */
export function getMatchQuality(percentage: number): {
    label: string;
    color: string;
} {
    if (percentage >= 90) {
        return { label: "Excellent", color: "text-green-600" };
    } else if (percentage >= 70) {
        return { label: "Good", color: "text-blue-600" };
    } else if (percentage >= 50) {
        return { label: "Fair", color: "text-yellow-600" };
    } else {
        return { label: "Poor", color: "text-red-600" };
    }
}
