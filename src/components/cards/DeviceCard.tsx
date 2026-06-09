import dayjs from "dayjs";
import { UsbDevice } from "../../types/usb";
import { StatusBadge } from "../common/StatusBadge";
import { invoke } from "@tauri-apps/api/core";
import { ScanResult } from "../../types/scan";
import { useAppStore } from "../../store/app.store";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";

interface Props {
  device: UsbDevice;
}

function formatSize(bytes: number) {
  return (bytes / 1024 / 1024 / 1024).toFixed(1);
}

export function DeviceCard({ device }: Props) {
  const used = device.totalSpace - device.availableSpace;
  const setDeviceScanning = useAppStore((state) => state.setDeviceScanning);
  const updateDeviceStatus = useAppStore((state) => state.updateDeviceStatus);
  const addActivity = useAppStore((state) => state.addActivity);
  const setDeviceCleaning = useAppStore((state) => state.setDeviceCleaning);

  const handleScan = async () => {
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

  const handleClean = async () => {
    try {
      setDeviceCleaning(device.driveLetter, true);

      addActivity({
        id: crypto.randomUUID(),
        message: `Cleaning ${device.driveLetter}...`,
        timestamp: new Date().toISOString(),
      });

      const result = await invoke("clean_usb_command", {
        driveLetter: device.driveLetter,
      });

      addActivity({
        id: crypto.randomUUID(),
        message: "USB cleaned successfully",
        timestamp: new Date().toISOString(),
      });

      await handleScan();
    } catch (error) {
      addActivity({
        id: crypto.randomUUID(),
        message: `Clean failed: ${error}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setDeviceCleaning(device.driveLetter, false);
    }
  };
  return (
    <div
      className={`
    rounded-3xl
    bg-white
    p-6
    shadow-sm
    transition-all
    ${device.isScanning ? "ring-2 ring-blue-200" : ""}

${device.isCleaning ? "ring-2 ring-red-200" : ""}
  `}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {device.volumeName || "Unnamed USB"}
          </h3>

          <p className="text-sm text-slate-500">{device.driveLetter}</p>
        </div>

        <StatusBadge status={device.status} />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400">File System</p>

          <p className="font-medium">{device.fileSystem}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Total Capacity</p>

          <p className="font-medium">{formatSize(device.totalSpace)} GB</p>
        </div>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-sm">
          <span>Used</span>

          <span>{formatSize(used)} GB</span>
        </div>

        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-blue-600"
            style={{
              width: `${(used / device.totalSpace) * 100}%`,
            }}
          />
        </div>
      </div>
      {device.reasons && device.reasons.length > 0 && (
        <div
          className="
        mt-4
        rounded-2xl
        bg-slate-50
        p-3
      "
        >
          <p
            className="
          mb-2
          text-xs
          font-semibold
          uppercase
          text-slate-500
        "
          >
            Scan Details
          </p>

          {device.lastScannedAt && (
            <div
              className="
      mt-3
      text-xs
      text-slate-400
    "
            >
              Last scanned:{" "}
              {dayjs(device.lastScannedAt).format("HH:mm:ss DD/MM/YYYY")}
            </div>
          )}

          <ul className="space-y-1">
            {device.reasons.map((reason) => (
              <li
                key={reason}
                className="
                text-sm
                text-slate-600
              "
              >
                • {reason}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-5 flex flex-wrap gap-3">
        {device.status === "infected" && (
          <button
            disabled={device.isCleaning || device.isScanning}
            onClick={handleClean}
            className="
        inline-flex
        items-center
        gap-2

        rounded-xl

        bg-red-600
        px-4
        py-2

        text-sm
        font-medium
        text-white

        shadow-sm
        transition-all

        hover:bg-red-700

        disabled:cursor-not-allowed
        disabled:bg-slate-300
      "
          >
            {device.isCleaning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Cleaning...
              </>
            ) : (
              <>
                <ShieldAlert size={16} />
                Clean USB
              </>
            )}
          </button>
        )}

        <button
          disabled={device.isScanning || device.isCleaning}
          onClick={handleScan}
          className="
      inline-flex
      items-center
      gap-2

      rounded-xl

      border
      border-slate-200

      bg-white

      px-4
      py-2

      text-sm
      font-medium

      text-slate-700

      shadow-sm

      transition-all

      hover:border-blue-300
      hover:bg-blue-50
      hover:text-blue-700

      disabled:cursor-not-allowed
      disabled:border-slate-100
      disabled:bg-slate-50
      disabled:text-slate-400
    "
        >
          {device.isScanning ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Scan Again
            </>
          )}
        </button>
      </div>
    </div>
  );
}
