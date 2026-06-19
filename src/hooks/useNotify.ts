import { useNotificationStore } from "../store/notification.store";

export function useNotify() {
  const push = useNotificationStore((state) => state.push);

  const update = useNotificationStore((state) => state.update);

  const remove = useNotificationStore((state) => state.remove);

  return {
    push,
    update,
    remove,
  };
}
