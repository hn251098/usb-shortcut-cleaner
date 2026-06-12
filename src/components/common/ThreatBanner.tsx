import { TriangleAlert } from "lucide-react";

import { useAppStore } from "../../store/app.store";

export function ThreatBanner() {
  const devices = useAppStore((state) => state.devices);

  const infectedDevices = devices.filter(
    (d) => d.status === "infected" || d.status === "suspicious",
  );

  if (infectedDevices.length === 0) {
    return null;
  }

  return (
    <div
      className="
        mb-6
        rounded-3xl
        border
        border-red-200
        bg-red-50
        p-5
      "
    >
      <div className="flex gap-3">
        <TriangleAlert
          className="
            mt-0.5
            text-red-600
          "
        />

        <div>
          <h2
            className="
              font-semibold
              text-red-700
            "
          >
            Phát hiện nguy cơ
          </h2>

          <p
            className="
              mt-1
              text-sm
              text-red-600
            "
          >
            Một hoặc nhiều thiết bị USB có nguy cơ chứa virus shortcut.
          </p>

          <div className="mt-3">
            {infectedDevices.map((device) => (
              <div key={device.driveLetter} className="text-sm">
                • {device.volumeName} ({device.driveLetter})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
