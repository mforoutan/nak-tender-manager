import type { AlertType } from '@/types/alert';
import { AlertCircle, CheckCircle2, Clock, Info } from 'lucide-react';

export const alertStyles: Record<AlertType, { className: string; icon: React.ReactNode }> = {
  info: {
    className: 'text-blue-700 bg-blue-50 border-blue-200',
    icon: <Info className="h-4 w-4" />,
  },
  success: {
    className: 'text-green-700 bg-green-50 border-green-200',
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  warning: {
    className: 'text-yellow-700 bg-yellow-50 border-yellow-200',
    icon: <Clock className="h-4 w-4" />,
  },
  error: {
    className: 'text-red-700 bg-red-50 border-red-200',
    icon: <AlertCircle className="h-4 w-4" />,
  },
};
