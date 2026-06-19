import { create } from "zustand";

import { AppNotification } from "../types/notification";

interface NotificationStore {
  notifications: AppNotification[];

  push: (
    notification: Omit<AppNotification, "id" | "createdAt">,
    duration?: number,
  ) => string;

  update: (id: string, notification: Partial<AppNotification>) => void;

  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  push: (notification, duration = 5000) => {
    const id = crypto.randomUUID();

    set((state) => ({
      notifications: [
        {
          ...notification,
          id,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  update: (id, notification) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id
          ? {
              ...item,
              ...notification,
            }
          : item,
      ),
    })),

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
