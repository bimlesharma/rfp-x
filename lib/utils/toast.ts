import toast from "react-hot-toast";

/**
 * Toast notification utilities
 * Provides consistent user feedback across the application
 */

export const showSuccess = (message: string) => {
    toast.success(message, {
        duration: 3000,
        position: "bottom-center",
        style: {
            background: "#10b981",
            color: "#fff",
            fontWeight: "500",
        },
        iconTheme: {
            primary: "#fff",
            secondary: "#10b981",
        },
    });
};

export const showError = (message: string, details?: string) => {
    const content = details ? `${message}: ${details}` : message;

    toast.error(content, {
        duration: 5000,
        position: "bottom-center",
        style: {
            background: "#ef4444",
            color: "#fff",
            fontWeight: "500",
        },
    });
};

export const showInfo = (message: string) => {
    toast(message, {
        duration: 3000,
        position: "bottom-center",
        icon: "ℹ️",
        style: {
            background: "#3b82f6",
            color: "#fff",
            fontWeight: "500",
        },
    });
};

export const showLoading = (message: string) => {
    return toast.loading(message, {
        position: "bottom-center",
        style: {
            background: "#8b5cf6",
            color: "#fff",
            fontWeight: "500",
        },
    });
};

export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

export const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        {
            position: "bottom-center",
            style: {
                fontWeight: "500",
            },
        }
    );
};
