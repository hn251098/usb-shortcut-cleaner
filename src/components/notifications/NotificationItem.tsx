import { CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

import { AppNotification } from "../../types/notification";

interface Props {
  notification: AppNotification;
}

export function NotificationItem({ notification }: Props) {
  const map = {
    success: {
      icon: CheckCircle2,

      className: "border-green-200 bg-green-50",
    },

    error: {
      icon: XCircle,

      className: "border-red-200 bg-red-50",
    },

    warning: {
      icon: AlertTriangle,

      className: "border-yellow-200 bg-yellow-50",
    },

    info: {
      icon: Info,

      className: "border-blue-200 bg-blue-50",
    },
  };

  const config = map[notification.type];

  const Icon = config.icon;

  return (
    <div
      className={`
        w-[360px]
        rounded-2xl
        border
        p-4
        shadow-lg
        backdrop-blur
        ${config.className}
      `}
    >
      <div className="flex gap-3">
        <Icon size={20} />

        <div>
          <h4 className="font-semibold">{notification.title}</h4>

          {notification.message && (
            <p className="mt-1 text-sm text-slate-600">
              {notification.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
