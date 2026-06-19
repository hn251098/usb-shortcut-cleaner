import { Shield } from "lucide-react";
import { getVersion } from "@tauri-apps/api/app";
import { useEffect, useState } from "react";

export function LaunchScreen() {
  const [version, setVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion);
  }, []);

  return (
    <div
      className="
        fixed inset-0
        z-[99999]

        flex flex-col
        items-center
        justify-center

        bg-gradient-to-br
        from-blue-50
        via-white
        to-slate-100
      "
    >
      <div
        className="
          flex flex-col
          items-center
          animate-pulse
        "
      >
        <div
          className="
            mb-6
            rounded-3xl
            bg-blue-100
            p-6
          "
        >
          <Shield size={56} className="text-blue-600" />
        </div>

        <h1
          className="
            text-4xl
            font-bold
            text-slate-900
          "
        >
          USB Virus Cleaner
        </h1>

        <p
          className="
            mt-3
            max-w-md
            text-center
            text-slate-500
          "
        >
          Bảo vệ USB theo thời gian thực, phát hiện và loại bỏ virus shortcut
          nhanh chóng.
        </p>

        <div
          className="
            mt-6
            rounded-full
            bg-slate-200
            px-3
            py-1
            text-xs
            font-medium
            text-slate-600
          "
        >
          Phiên bản {version}
        </div>

        <div className="mt-4 text-sm text-slate-500">
          Phát triển bởi <span className="font-medium">Tổ CNTT Sư đoàn</span>
        </div>
      </div>
    </div>
  );
}
