import dayjs from "dayjs";
import { UsbDevice } from "../../types/usb";
import { StatusBadge } from "../common/StatusBadge";
import { invoke } from "@tauri-apps/api/core";
import { ScanResult } from "../../types/scan";
import { useAppStore } from "../../store/app.store";
import { Loader2, RefreshCw, ShieldAlert } from "lucide-react";
import { useNotify } from "../../hooks/useNotify";

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
  const notify = useNotify();

  const handleScan = async () => {
    try {
      const id = notify.push(
        {
          title: "Đang quét USB...",
          message: `${device.driveLetter}`,
          type: "info",
        },
        0,
      );

      addActivity({
        id: crypto.randomUUID(),
        message: `Đang quét ${device.driveLetter}...`,
        timestamp: new Date().toISOString(),
      });

      setDeviceScanning(device.driveLetter, true);

      const [result] = await Promise.all([
        invoke<ScanResult>("scan_drive", {
          driveLetter: device.driveLetter,
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      updateDeviceStatus(
        result.driveLetter,
        result.status,
        result.score,
        result.reasons,
        new Date().toISOString(),
      );

      if (result.status === "infected") {
        notify.update(id, {
          title: "Phát hiện mối đe dọa",
          message:
            result.reasons.length > 0
              ? result.reasons.join(", ")
              : `${device.driveLetter} có thể đã bị nhiễm mã độc`,
          type: "warning",
        });
      } else {
        notify.update(id, {
          title: "USB an toàn",
          message: `Đã quét thành công ${device.driveLetter}`,
          type: "success",
        });
      }

      addActivity({
        id: crypto.randomUUID(),
        message: `Quét thành công (${result.status})`,
        timestamp: new Date().toISOString(),
      });

      setTimeout(() => {
        notify.remove(id);
      }, 3000);
    } catch (error) {
      notify.push({
        title: "Quét thất bại",
        message: "Đã xảy ra lỗi trong quá trình quét. Vui lòng thử lại.",
        type: "error",
      });

      addActivity({
        id: crypto.randomUUID(),
        message: `Quét thất bại: ${error}`,
        timestamp: new Date().toISOString(),
      });
    } finally {
      setDeviceScanning(device.driveLetter, false);
    }
  };

  const handleClean = async () => {
    try {
      setDeviceCleaning(device.driveLetter, true);

      const id = notify.push(
        {
          title: "Đang làm sạch USB...",
          message: `Đang xử lý ổ đĩa ${device.driveLetter}`,
          type: "info",
        },
        0,
      );

      addActivity({
        id: crypto.randomUUID(),
        message: `Cleaning ${device.driveLetter}...`,
        timestamp: new Date().toISOString(),
      });

      await Promise.all([
        invoke<ScanResult>("clean_usb_command", {
          driveLetter: device.driveLetter,
        }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      notify.update(id, {
        title: "Đã làm sạch USB",
        message: `Đã làm sạch thành công ${device.driveLetter}`,
        type: "success",
      });

      addActivity({
        id: crypto.randomUUID(),
        message: "USB cleaned successfully",
        timestamp: new Date().toISOString(),
      });

      await handleScan();

      setTimeout(() => {
        notify.remove(id);
      }, 3000);
    } catch (error) {
      notify.push({
        title: "Không thể làm sạch USB",
        message: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.",
        type: "error",
      });

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
      className={`rounded-2xl bg-white p-4 shadow-sm transition-all ${
        device.isScanning ? "ring-2 ring-blue-200" : ""
      } ${device.isCleaning ? "ring-2 ring-red-200" : ""}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold">
            {device.volumeName || "Unnamed USB"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {device.driveLetter} • {device.fileSystem} •{" "}
            {formatSize(device.totalSpace)} GB
          </p>
        </div>

        <StatusBadge status={device.status} />
      </div>

      {/* Storage */}
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Đã sử dụng</span>

          <span>
            {formatSize(used)} / {formatSize(device.totalSpace)} GB
          </span>
        </div>

        <div className="h-2 rounded-full bg-slate-100">
          <div
            className="h-2 rounded-full bg-blue-600 transition-all"
            style={{
              width: `${(used / device.totalSpace) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Scan info */}
      {(device.reasons?.length > 0 || device.lastScannedAt) && (
        <div className="mt-4 rounded-xl bg-slate-50 p-3">
          {device.reasons?.length > 0 && (
            <div className="flex items-start gap-2">
              <ShieldAlert
                size={16}
                className="mt-0.5 shrink-0 text-amber-500"
              />

              <div className="min-w-0">
                <p className="text-sm text-slate-700">{device.reasons[0]}</p>

                {device.reasons.length > 1 && (
                  <p className="mt-1 text-xs text-slate-500">
                    +{device.reasons.length - 1} dấu hiệu khác
                  </p>
                )}
              </div>
            </div>
          )}

          {device.lastScannedAt && (
            <p className="mt-2 text-xs text-slate-400">
              Quét lúc{" "}
              {dayjs(device.lastScannedAt).format("HH:mm:ss DD/MM/YYYY")}
            </p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-4 flex gap-2">
        {device.status === "infected" && (
          <button
            disabled={device.isCleaning || device.isScanning}
            onClick={handleClean}
            className="
          flex-1
          inline-flex
          items-center
          justify-center
          gap-2

          rounded-xl

          bg-red-600

          px-3
          py-2

          text-sm
          font-medium
          text-white

          transition-all

          hover:bg-red-700

          disabled:cursor-not-allowed
          disabled:bg-slate-300
        "
          >
            {device.isCleaning ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Đang làm sạch...
              </>
            ) : (
              <>
                <ShieldAlert size={16} />
                Làm sạch
              </>
            )}
          </button>
        )}

        <button
          disabled={device.isScanning || device.isCleaning}
          onClick={handleScan}
          className="
        flex-1

        inline-flex
        items-center
        justify-center
        gap-2

        rounded-xl

        border
        border-slate-200

        bg-white

        px-3
        py-2

        text-sm
        font-medium

        text-slate-700

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
              Đang quét...
            </>
          ) : (
            <>
              <RefreshCw size={16} />
              Quét lại
            </>
          )}
        </button>
      </div>
    </div>
  );
}
