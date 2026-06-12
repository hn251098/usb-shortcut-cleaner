import dayjs from "dayjs";

import { ShieldCheck, ShieldAlert, Loader2, ScanSearch } from "lucide-react";

import { useSecurityStore } from "../../store/security.store";
import { invoke } from "@tauri-apps/api/core";
import {
  CleanComputerResult,
  ComputerScanResult,
} from "../../types/computer-security";
import { useNotify } from "../../hooks/useNotify";

export function ComputerProtectionCard() {
  const computer = useSecurityStore((state) => state.computer);
  const setStatus = useSecurityStore((state) => state.setStatus);
  const setThreats = useSecurityStore((state) => state.setThreats);
  const notify = useNotify();

  const renderContent = () => {
    if (computer.isScanning) {
      return {
        icon: <Loader2 size={36} className="animate-spin" />,

        title: "Đang quét máy tính",

        description:
          "Đang kiểm tra các chương trình khởi động cùng Windows và thư mục đáng ngờ...",

        bg: "from-blue-500 to-indigo-600",

        button: "Đang quét...",
      };
    }

    if (computer.status === "infected") {
      return {
        icon: <ShieldAlert size={36} />,

        title: "Phát hiện nguy cơ nhiễm virus",

        description: `Phát hiện ${computer.threats.length} dấu hiệu đáng ngờ`,

        bg: "from-red-500 to-orange-500",

        button: "Làm sạch ngay",
      };
    }

    return {
      icon: <ShieldCheck size={36} />,

      title: "Máy tính đang được bảo vệ",

      description: "Không phát hiện dấu hiệu nhiễm virus",

      bg: "from-green-500 to-emerald-600",

      button: "Quét máy tính",
    };
  };

  const ui = renderContent();

  async function handleScan() {
    try {
      notify({
        title: "Đang quét hệ thống...",
        message: "Kiểm tra các mục khởi động và thư mục hệ thống đáng ngờ",
        type: "info",
      });

      const result = await invoke<ComputerScanResult>("scan_computer_command");

      if (result.infected) {
        setStatus("infected");
        setThreats(result.threats);

        notify({
          title: "Phát hiện mối đe dọa",
          message: `Đã tìm thấy ${result.threats.length} mục đáng ngờ`,
          type: "warning",
        });
      } else {
        setStatus("safe");
        setThreats([]);

        notify({
          title: "Máy tính an toàn",
          message: "Không phát hiện dấu hiệu của virus shortcut",
          type: "success",
        });
      }
    } catch (error) {
      notify({
        title: "Quét thất bại",
        message: "Đã xảy ra lỗi trong quá trình quét. Vui lòng thử lại.",
        type: "error",
      });
    }
  }

  async function handleClean() {
    try {
      notify({
        title: "Đang làm sạch máy tính...",
        message: "Đang xóa các tệp và mục khởi động đáng ngờ",
        type: "info",
      });

      const result = await invoke<CleanComputerResult>(
        "clean_computer_command",
      );

      if (result.success) {
        notify({
          title: "Dọn dẹp hoàn tất",
          message: `Đã loại bỏ ${result.removed_items.length} mục`,
          type: "success",
        });
      } else {
        notify({
          title: "Dọn dẹp hoàn tất với cảnh báo",
          message: `Đã xảy ra ${result.errors.length} sự cố`,
          type: "warning",
        });
      }

      await handleScan();
    } catch (error) {
      notify({
        title: "Dọn dẹp thất bại",
        message: "Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại.",
        type: "error",
      });
    }
  }

  return (
    <div
      className={`
        mb-6
        overflow-hidden
        rounded-[32px]
        bg-gradient-to-r
        ${ui.bg}
        p-8
        text-white
        shadow-xl
      `}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="mb-4">{ui.icon}</div>

          <h2 className="text-3xl font-bold">{ui.title}</h2>

          <p className="mt-2 text-white/90">{ui.description}</p>

          {computer.lastScannedAt && (
            <p className="mt-3 text-sm text-white/70">
              Last scan:{" "}
              {dayjs(computer.lastScannedAt).format("HH:mm DD/MM/YYYY")}
            </p>
          )}
        </div>

        <button
          className="
            flex
            items-center
            gap-2

            rounded-2xl

            bg-white
            px-6
            py-3

            font-semibold

            text-slate-900

            transition-all

            hover:scale-105
          "
          onClick={() => {
            computer.status === "infected" ? handleClean() : handleScan();
          }}
        >
          <ScanSearch size={18} />

          {ui.button}
        </button>
      </div>
    </div>
  );
}
