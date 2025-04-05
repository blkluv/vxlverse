import { AlertTriangle, X } from "lucide-react";
import { useEffect, useRef } from "react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "warning" | "danger" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
}: ConfirmationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle ESC key to close
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
    }
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getColors = () => {
    switch (type) {
      case "danger":
        return {
          icon: "text-red-500",
          button: "bg-red-600 hover:bg-red-700",
          border: "border-red-500/20",
          bg: "bg-red-500/10",
        };
      case "info":
        return {
          icon: "text-blue-500",
          button: "bg-blue-600 hover:bg-blue-700",
          border: "border-blue-500/20",
          bg: "bg-blue-500/10",
        };
      case "warning":
      default:
        return {
          icon: "text-amber-500",
          button: "bg-amber-600 hover:bg-amber-700",
          border: "border-amber-500/20",
          bg: "bg-amber-500/10",
        };
    }
  };

  const colors = getColors();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-md shadow-xl overflow-hidden"
      >
        <div className={`p-4 flex items-start gap-3 ${colors.bg} ${colors.border} border-b`}>
          <div className={`p-1 rounded-full ${colors.icon}`}>
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-medium text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-300">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-4 flex justify-end gap-3 bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-sm bg-slate-700 hover:bg-slate-600 text-slate-300"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-sm text-white ${colors.button}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
