import { ShieldAlert, ShieldCheck } from "lucide-react";

import { useMemo } from "react";

import { useAppStore } from "../../store/app.store";

export function StatusCard() {
  const devices = useAppStore((state) => state.devices);

  const stats = useMemo(() => {
    return devices.reduce(
      (acc, device) => {
        switch (device.status) {
          case "safe":
            acc.safe += 1;
            break;

          case "suspicious":
            acc.suspicious += 1;
            break;

          case "infected":
            acc.infected += 1;
            break;

          default:
            acc.scanning += 1;
        }

        return acc;
      },
      {
        safe: 0,
        suspicious: 0,
        infected: 0,
        scanning: 0,
      },
    );
  }, [devices]);

  const hasThreat = stats.infected > 0 || stats.suspicious > 0;

  return (
    <div
      className="
        rounded-3xl
        bg-white
        p-6
        shadow-sm
        col-span-2
      "
    >
      <div className="flex items-start gap-4">
        <div
          className={`
            rounded-2xl p-3
            ${hasThreat ? "bg-red-100" : "bg-green-100"}
          `}
        >
          {hasThreat ? (
            <ShieldAlert className="text-red-600" />
          ) : (
            <ShieldCheck className="text-green-600" />
          )}
        </div>

        <div className="flex-1">
          <p className="text-sm text-slate-500">Trạng thái bảo vệ</p>

          <h2
            className={`
              mt-1
              text-lg
              font-semibold
              ${hasThreat ? "text-red-600" : "text-green-600"}
            `}
          >
            {hasThreat ? "Phát hiện mối đe dọa" : "Đang giám sát"}
          </h2>

          <div
            className="
              mt-4
              grid
              grid-cols-2
              gap-3
            "
          >
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">An toàn</p>

              <p className="text-lg font-semibold text-green-600">
                {stats.safe}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Đang quét</p>

              <p className="text-lg font-semibold text-blue-600">
                {stats.scanning}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Khả nghi</p>

              <p className="text-lg font-semibold text-yellow-600">
                {stats.suspicious}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">Đã nhiễm</p>

              <p className="text-lg font-semibold text-red-600">
                {stats.infected}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
