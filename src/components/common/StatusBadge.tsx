import { Loader2, ShieldAlert, ShieldCheck } from "lucide-react";

import { DeviceStatus } from "../../types/usb";

interface Props {
  status?: DeviceStatus;
}

export function StatusBadge({ status }: Props) {
  if (!status || status === "scanning") {
    return (
      <div
        className="
      inline-flex
      items-center
      gap-2
      rounded-full
      bg-blue-100
      px-3
      py-1
      text-xs
      font-medium
      text-blue-700
    "
      >
        <Loader2 size={14} className="animate-spin" />
        Scanning
      </div>
    );
  }

  if (status === "safe") {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-green-100
          px-3
          py-1
          text-xs
          font-medium
          text-green-700
        "
      >
        <ShieldCheck size={14} />
        Safe
      </div>
    );
  }

  if (status === "suspicious") {
    return (
      <div
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          bg-yellow-100
          px-3
          py-1
          text-xs
          font-medium
          text-yellow-700
        "
      >
        <ShieldAlert size={14} />
        Suspicious
      </div>
    );
  }

  return (
    <div
      className="
        inline-flex
        items-center
        gap-2
        rounded-full
        bg-red-100
        px-3
        py-1
        text-xs
        font-medium
        text-red-700
      "
    >
      <ShieldAlert size={14} />
      Infected
    </div>
  );
}
