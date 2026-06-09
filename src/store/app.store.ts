import { create } from "zustand";

import { DeviceStatus, UsbDevice } from "../types/usb";
import { Activity } from "../types/activity";

interface AppState {
  monitoring: boolean;

  devices: UsbDevice[];

  activities: Activity[];

  setDevices: (devices: UsbDevice[]) => void;

  addDevice: (device: UsbDevice) => void;

  removeDevice: (driveLetter: string) => void;

  addActivity: (activity: Activity) => void;

  clearActivities: () => void;

  updateDeviceStatus: (
    driveLetter: string,
    status: DeviceStatus,
    score: number,
    reasons: string[],
    lastScannedAt: string,
  ) => void;

  setDeviceScanning: (driveLetter: string, scanning: boolean) => void;

  setDeviceCleaning: (driveLetter: string, cleaning: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  monitoring: true,

  devices: [],

  activities: [],

  setDevices: (devices) =>
    set({
      devices,
    }),

  addDevice: (device) =>
    set((state) => {
      const exists = state.devices.some(
        (x) => x.driveLetter === device.driveLetter,
      );

      if (exists) {
        return state;
      }

      return {
        devices: [
          ...state.devices,
          {
            ...device,
            status: "scanning",
          },
        ],
      };
    }),

  removeDevice: (driveLetter) =>
    set((state) => ({
      devices: state.devices.filter((x) => x.driveLetter !== driveLetter),
    })),

  addActivity: (activity) =>
    set((state) => ({
      activities: [activity, ...state.activities].slice(0, 100),
    })),

  clearActivities: () =>
    set({
      activities: [],
    }),

  setDeviceScanning: (driveLetter, scanning) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.driveLetter === driveLetter
          ? {
              ...device,
              isScanning: scanning,
            }
          : device,
      ),
    })),
  setDeviceCleaning: (driveLetter, cleaning) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.driveLetter === driveLetter
          ? {
              ...device,
              isCleaning: cleaning,
            }
          : device,
      ),
    })),
  updateDeviceStatus: (driveLetter, status, score, reasons, lastScannedAt) =>
    set((state) => ({
      devices: state.devices.map((device) =>
        device.driveLetter === driveLetter
          ? {
              ...device,
              status,
              score,
              reasons,
              lastScannedAt,
            }
          : device,
      ),
    })),
}));
