import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";

export async function showNotification(title: string, body: string) {
  let permissionGranted = await isPermissionGranted();

  console.log("permissionGranted", permissionGranted);

  if (!permissionGranted) {
    const permission = await requestPermission();

    permissionGranted = permission === "granted";
  }

  if (!permissionGranted) {
    return;
  }

  sendNotification({
    title,
    body,
  });
}
