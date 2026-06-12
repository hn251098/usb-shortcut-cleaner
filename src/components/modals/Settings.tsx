import { Settings, X } from "lucide-react";

import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "../../store/setting.store";
import { disable, enable, isEnabled } from "@tauri-apps/plugin-autostart";
import { SettingItem } from "./SettingItem";

interface Props {
  open: boolean;

  onClose: () => void;
}

export function SettingsModal({ open, onClose }: Props) {
  const settings = useSettingsStore((state) => state.settings);

  const updateSettings = useSettingsStore((state) => state.updateSettings);

  if (!open) {
    return null;
  }

  const handleSave = async () => {
    const enabled = await isEnabled();

    if (settings.startWithWindows) {
      if (!enabled) {
        await enable();
      }
    } else {
      if (enabled) {
        await disable();
      }
    }

    await invoke("update_settings", {
      settings,
    });

    onClose();
  };

  return (
    <div
      className="
    fixed inset-0 z-50
    flex items-center justify-center
    bg-black/50 backdrop-blur-md
    p-4
  "
    >
      <div
        className="
      w-full max-w-xl
      overflow-hidden

      rounded-3xl
      border border-slate-200

      bg-white
      shadow-[0_25px_80px_rgba(0,0,0,0.2)]
    "
      >
        {/* HEADER */}
        <div
          className="
        flex items-center justify-between

        border-b border-slate-200

        px-6 py-5
      "
        >
          <div className="flex items-center gap-3">
            <div
              className="
            flex h-10 w-10
            items-center justify-center

            rounded-xl
            bg-blue-100
          "
            >
              <Settings size={20} className="text-blue-600" />
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">Cài đặt</h2>

              <p className="text-sm text-slate-500">
                Tùy chỉnh hành vi ứng dụng
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="
          rounded-xl
          p-2

          text-slate-500
          transition

          hover:bg-slate-100
          hover:text-slate-700
        "
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-3 p-6">
          <SettingItem
            title="Khởi động cùng Windows"
            description="Tự động chạy ứng dụng khi đăng nhập Windows"
            checked={settings.startWithWindows}
            onChange={(checked) =>
              updateSettings({
                startWithWindows: checked,
              })
            }
          />

          <SettingItem
            title="Thu nhỏ xuống khay hệ thống"
            description="Giữ ứng dụng chạy nền khi thu nhỏ"
            checked={settings.minimizeToTray}
            onChange={(checked) =>
              updateSettings({
                minimizeToTray: checked,
              })
            }
          />

          <SettingItem
            title="Ẩn vào khay hệ thống khi đóng"
            description="Không thoát hoàn toàn khi nhấn nút đóng"
            checked={settings.closeToTray}
            onChange={(checked) =>
              updateSettings({
                closeToTray: checked,
              })
            }
          />
        </div>

        {/* FOOTER */}
        <div
          className="
        flex justify-end gap-3

        border-t border-slate-200
        bg-slate-50

        px-6 py-4
      "
        >
          <button
            onClick={onClose}
            className="
          rounded-xl
          border border-slate-300

          px-5 py-2.5

          font-medium
          text-slate-700

          transition
          hover:bg-white
        "
          >
            Hủy
          </button>

          <button
            onClick={handleSave}
            className="
          rounded-xl

          bg-blue-600
          px-5 py-2.5

          font-medium
          text-white

          transition
          hover:bg-blue-700
        "
          >
            Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
}
