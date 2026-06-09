import { Activity, HardDrive } from "lucide-react";

import { StatusCard } from "../components/cards/StatusCard";
import { DeviceCard } from "../components/cards/DeviceCard";
import { ActivityCard } from "../components/cards/ActivityCard";

import { useAppStore } from "../store/app.store";
import { ThreatBanner } from "../components/common/ThreatBanner";
import { invoke } from "@tauri-apps/api/core";
import { useEffect } from "react";
import { UsbDevice } from "../types/usb";
import { ScanResult } from "../types/scan";

import { Settings } from "lucide-react";

import { useState } from "react";
import { SettingsModal } from "../components/modals/Settings";
import { useSettingsStore } from "../store/setting.store";
import { AppSettings } from "../types/settings";

export default function Dashboard() {
  const devices = useAppStore((state) => state.devices);
  const activities = useAppStore((state) => state.activities);
  const setDevices = useAppStore((state) => state.setDevices);
  const setDeviceScanning = useAppStore((state) => state.setDeviceScanning);
  const updateDeviceStatus = useAppStore((state) => state.updateDeviceStatus);
  const addActivity = useAppStore((state) => state.addActivity);
  const setSettings = useSettingsStore((state) => state.setSettings);

  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const load = async () => {
      const settings = await invoke<AppSettings>("get_settings");

      setSettings(settings);
    };

    load();
  }, []);

  useEffect(() => {
    const init = async () => {
      const devices = await invoke<UsbDevice[]>("get_connected_usb");
      devices.map(async (device) => await handleScan(device));
      setDevices(devices);
    };

    init();
  }, []);

  const handleScan = async (device: UsbDevice) => {
    try {
      addActivity({
        id: crypto.randomUUID(),
        message: `Scanning ${device.driveLetter}...`,
        timestamp: new Date().toISOString(),
      });
      setDeviceScanning(device.driveLetter, true);

      const result = await invoke<ScanResult>("scan_drive", {
        driveLetter: device.driveLetter,
      });

      updateDeviceStatus(
        result.driveLetter,
        result.status,
        result.score,
        result.reasons,
        new Date().toISOString(),
      );
      addActivity({
        id: crypto.randomUUID(),
        message: `Scan completed (${result.status})`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setDeviceScanning(device.driveLetter, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-7xl px-8 py-10">
        <div className="mb-8">
          <div
            className="
    mb-8
    flex
    items-center
    justify-between
  "
          >
            <div>
              <h1
                className="
        text-3xl
        font-bold
      "
              >
                USB Virus Cleaner
              </h1>

              <p
                className="
        mt-1
        text-sm
        text-slate-500
      "
              >
                Monitor and clean shortcut viruses
              </p>
            </div>

            <button
              onClick={() => setOpenSettings(true)}
              className="
      rounded-2xl
      bg-white
      p-3

      shadow-sm

      transition-all

      hover:shadow-md
      hover:bg-slate-50
    "
            >
              <Settings size={20} />
            </button>
          </div>

          <p className="mt-2 text-slate-500">
            Real-time USB monitoring and virus detection
          </p>
        </div>

        <ThreatBanner />

        <div className="grid gap-5 md:grid-cols-3">
          <StatusCard />

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <HardDrive className="text-blue-600" />
              <span className="text-sm text-slate-500">Connected USB</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold">{devices.length}</h2>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <Activity className="text-orange-500" />
              <span className="text-sm text-slate-500">Activities</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold">{activities.length}</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Connected Devices</h2>

            <div className="grid gap-4">
              {devices.length === 0 ? (
                <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
                  No USB devices connected Insert a USB drive to start
                  monitoring.
                </div>
              ) : (
                devices.map((device) => (
                  <DeviceCard key={device.driveLetter} device={device} />
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-xl font-semibold">Activity Log</h2>

            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  message={activity.message}
                  timestamp={activity.timestamp}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <SettingsModal
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </div>
  );
}
