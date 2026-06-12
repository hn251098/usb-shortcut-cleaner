import { useNotificationStore } from "../store/notification.store";

export function useNotify() {
  return useNotificationStore((state) => state.push);
}
