export type NotificationType = "success" | "error" | "warning" | "info";

export interface AppNotification {
  id: string;

  title: string;

  message?: string;

  type: NotificationType;

  createdAt: string;
}
