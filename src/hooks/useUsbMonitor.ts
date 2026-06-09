import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";

import { useAppStore } from "../store/app.store";
import { UsbDevice } from "../types/usb";
import { ScanResult } from "../types/scan";

export function useUsbMonitor() {
  const addDevice = useAppStore((s) => s.addDevice);
  const removeDevice = useAppStore((s) => s.removeDevice);
  const addActivity = useAppStore((s) => s.addActivity);
  const updateDeviceStatus = useAppStore((state) => state.updateDeviceStatus);

  useEffect(() => {
    let unlistenInserted: (() => void) | undefined;
    let unlistenRemoved: (() => void) | undefined;
    let unlistenScaner: (() => void) | undefined;

    const setup = async () => {
      unlistenInserted = await listen<UsbDevice>("usb-inserted", (event) => {
        const device = event.payload;

        addDevice(device);

        addActivity({
          id: crypto.randomUUID(),
          message: `USB connected: ${device.volumeName} (${device.driveLetter})`,
          timestamp: new Date().toISOString(),
        });
      });

      unlistenRemoved = await listen<UsbDevice>("usb-removed", (event) => {
        const device = event.payload;

        removeDevice(device.driveLetter);

        addActivity({
          id: crypto.randomUUID(),
          message: `USB removed: ${device.volumeName} (${device.driveLetter})`,
          timestamp: new Date().toISOString(),
        });
      });

      unlistenScaner = await listen<ScanResult>("scan-result", (event) => {
        const result = event.payload;

        updateDeviceStatus(
          result.driveLetter,
          result.status,
          result.score,
          result.reasons,
          new Date().toISOString(),
        );

        addActivity({
          id: crypto.randomUUID(),

          message: `Scan completed: ${result.driveLetter} (${result.status})`,

          timestamp: new Date().toISOString(),
        });
      });
    };

    setup();

    return () => {
      unlistenInserted?.();
      unlistenRemoved?.();
      unlistenScaner?.();
    };
  }, [addDevice, removeDevice, addActivity]);
}
