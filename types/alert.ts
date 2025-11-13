export type AlertType = 'info' | 'success' | 'warning' | 'error';

export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  duration?: number; // auto-dismiss after this many milliseconds (0 = no auto-dismiss)
}

export interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Omit<Alert, 'id'>) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}
