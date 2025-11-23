"use client";

import { useAlert } from '@/contexts/alert-context';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { alertStyles } from '@/components/alert-styles';

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
