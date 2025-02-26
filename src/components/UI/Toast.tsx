import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { create } from "zustand";

// Toast types
export type ToastType = "info" | "success" | "warning" | "error";

// Toast interface
interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

// Toast store
interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

// Create toast store
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = "info", duration = 3000) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    // Auto-remove toast after duration
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, duration);
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

// Single toast component
const ToastItem = ({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: () => void;
}) => {
  const [progress, setProgress] = useState(100);
  const duration = toast.duration || 3000;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(timer);
  }, [duration]);

  // Get background color based on toast type
  const getBgColor = () => {
    switch (toast.type) {
      case "success":
        return "bg-green-500/90";
      case "error":
        return "bg-red-500/90";
      case "warning":
        return "bg-amber-500/90";
      default:
        return "bg-blue-500/90";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      className={`relative  shadow-lg backdrop-blur-md p-4 mb-2 ${getBgColor()} text-white`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={onRemove}
          className="ml-4 text-white/80 hover:text-white transition-colors"
        >
          ×
        </button>
      </div>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/30 "
        style={{ width: `${progress}%` }}
      />
    </motion.div>
  );
};

// Toast container component
export const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col items-end">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Helper function to add toast from anywhere
export const toast = {
  info: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "info", duration),
  success: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "success", duration),
  warning: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "warning", duration),
  error: (message: string, duration?: number) =>
    useToastStore.getState().addToast(message, "error", duration),
};
