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
import { isEnabled } from "@tauri-apps/plugin-autostart";
import { listen } from "@tauri-apps/api/event";
import { ComputerProtectionCard } from "../components/cards/ComputerProtectionCard";
import { useNotify } from "../hooks/useNotify";

export default function Dashboard() {
  const devices = useAppStore((state) => state.devices);
  const activities = useAppStore((state) => state.activities);
  const setDevices = useAppStore((state) => state.setDevices);
  const setDeviceScanning = useAppStore((state) => state.setDeviceScanning);
  const updateDeviceStatus = useAppStore((state) => state.updateDeviceStatus);
  const addActivity = useAppStore((state) => state.addActivity);
  const setSettings = useSettingsStore((state) => state.setSettings);

  const notify = useNotify();
  const [openSettings, setOpenSettings] = useState(false);

  useEffect(() => {
    const unlisten = listen("open-settings", () => {
      setOpenSettings(true);
    });

    return () => {
      unlisten.then((f) => f());
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      const settings = await invoke<AppSettings>("get_settings");

      const autostartEnabled = await isEnabled();

      setSettings({
        ...settings,

        startWithWindows: autostartEnabled,
      });
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
        message: `Đang quét ${device.driveLetter}...`,
        timestamp: new Date().toISOString(),
      });
      const id = notify.push(
        {
          type: "info",

          title: "Đang quét USB",

          message: `Đang kiểm tra ổ đĩa ${device.driveLetter}`,
        },
        0,
      );

      setDeviceScanning(device.driveLetter, true);

      const result = await invoke<ScanResult>("scan_drive", {
        driveLetter: device.driveLetter,
      });

      if (result.status === "infected") {
        notify.update(id, {
          type: "warning",

          title: "Phát hiện mối đe dọa",

          message: result.reasons.join(", "),
        });
      } else {
        notify.update(id, {
          type: "success",

          title: "USB an toàn",

          message: `Đã quét thành công ${device.driveLetter}`,
        });
      }

      updateDeviceStatus(
        result.driveLetter,
        result.status,
        result.score,
        result.reasons,
        new Date().toISOString(),
      );
      addActivity({
        id: crypto.randomUUID(),
        message: `Quét thành công (${result.status})`,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        notify.remove(id);
      }, 3000);
    } finally {
      setDeviceScanning(device.driveLetter, false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto px-8 py-10">
        <div className="mb-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold ">USB Virus Cleaner</h1>

              <p className="mt-1 text-sm text-slate-500">
                Hệ thống giám sát USB, phát hiện virus shortcut và hỗ trợ khôi
                phục dữ liệu.
              </p>
            </div>

            <button
              onClick={() => setOpenSettings(true)}
              className="rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md hover:bg-slate-50"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        <ComputerProtectionCard />

        <ThreatBanner />

        <div className="grid gap-5 md:grid-cols-5">
          <StatusCard />

          <div className="flex flex-col gap-5 justify-between">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <HardDrive className="text-blue-600" />
                <span className="text-sm text-slate-500">USB đã kết nối</span>
              </div>

              <h2 className="mt-4 text-3xl font-bold">{devices.length}</h2>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <Activity className="text-orange-500" />
                <span className="text-sm text-slate-500">Hoạt động</span>
              </div>

              <h2 className="mt-4 text-3xl font-bold">{activities.length}</h2>
            </div>
          </div>

          <div className="col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Lịch sử hoạt động</h2>

            <div className="thin-scrollbar space-y-3 overflow-y-auto overflow-x-hidden max-h-[240px] pr-1">
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

        <div className="mt-4">
          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-semibold">Thiết bị đã kết nối</h2>

            <div className="grid gap-4">
              {devices.length === 0 ? (
                <div className="rounded-3xl bg-white p-10 text-center text-slate-500 shadow-sm">
                  Chưa phát hiện thiết bị USB nào. Hãy cắm USB để bắt đầu giám
                  sát và kiểm tra.
                </div>
              ) : (
                devices.map((device) => (
                  <DeviceCard key={device.driveLetter} device={device} />
                ))
              )}
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
