import { NotificationItem } from "./NotificationItem";

import { useNotificationStore } from "../../store/notification.store";

export function NotificationContainer() {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div
      className="
        fixed
        right-6
        top-6
        z-[9999]

        flex
        flex-col
        gap-3
      "
    >
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  );
}
