"use client";

import { useAlert } from '@/contexts/alert-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Clock, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertType } from '@/types/alert';

const alertStyles: Record<AlertType, { className: string; icon: React.ReactNode }> = {
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

export function AlertContainer() {
  const { alerts, removeAlert } = useAlert();

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 space-y-3">
      {alerts.map((alert) => {
        const style = alertStyles[alert.type];
        
        return (
          <Alert key={alert.id} className={style.className}>
            <div className="flex items-start gap-3 w-full">
              <div className="flex-shrink-0 mt-0.5">{style.icon}</div>
              
              <div className="flex-1 min-w-0">
                <AlertTitle className="mb-1">{alert.title}</AlertTitle>
                <AlertDescription>
                  <p className={alert.action ? 'mb-3' : ''}>{alert.description}</p>
                  {alert.action && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        alert.action?.onClick();
                        removeAlert(alert.id);
                      }}
                    >
                      {alert.action.label}
                    </Button>
                  )}
                </AlertDescription>
              </div>

              {alert.dismissible && (
                <button
                  onClick={() => removeAlert(alert.id)}
                  className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </Alert>
        );
      })}
    </div>
  );
}
