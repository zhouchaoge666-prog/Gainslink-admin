import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  error: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const Icon = icons[type];

  return (
    <div className="fixed top-5 right-5 z-[100] animate-in fade-in slide-in-from-top-2">
      <div className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg ${styles[type]}`}>
        <Icon size={16} />
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
