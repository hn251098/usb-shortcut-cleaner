import { create } from "zustand";

import { AppNotification } from "../types/notification";

interface NotificationStore {
  notifications: AppNotification[];

  push: (notification: Omit<AppNotification, "id" | "createdAt">) => void;

  remove: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],

  push: (notification) => {
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

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },

  remove: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
