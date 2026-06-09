import { X } from "lucide-react";

import { invoke } from "@tauri-apps/api/core";
import { useSettingsStore } from "../../store/setting.store";

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
    await invoke("update_settings", {
      settings,
    });

    onClose();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50

        flex
        items-center
        justify-center

        bg-black/40
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-lg

          rounded-3xl
          bg-white

          shadow-2xl
        "
      >
        <div
          className="
            flex
            items-center
            justify-between

            border-b

            px-6
            py-4
          "
        >
          <h2
            className="
              text-lg
              font-semibold
            "
          >
            Settings
          </h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2

              hover:bg-slate-100
            "
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="
            space-y-5
            p-6
          "
        >
          <label
            className="
              flex
              items-center
              justify-between
            "
          >
            <span>Launch with Windows</span>

            <input
              type="checkbox"
              checked={settings.startWithWindows}
              onChange={(e) =>
                updateSettings({
                  startWithWindows: e.target.checked,
                })
              }
            />
          </label>

          <label
            className="
              flex
              items-center
              justify-between
            "
          >
            <span>Minimize to tray</span>

            <input
              type="checkbox"
              checked={settings.minimizeToTray}
              onChange={(e) =>
                updateSettings({
                  minimizeToTray: e.target.checked,
                })
              }
            />
          </label>

          <label
            className="
              flex
              items-center
              justify-between
            "
          >
            <span>Close to tray</span>

            <input
              type="checkbox"
              checked={settings.closeToTray}
              onChange={(e) =>
                updateSettings({
                  closeToTray: e.target.checked,
                })
              }
            />
          </label>
        </div>

        <div
          className="
            flex
            justify-end
            gap-3

            border-t

            px-6
            py-4
          "
        >
          <button
            onClick={onClose}
            className="
              rounded-xl
              border
              px-4
              py-2
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="
              rounded-xl
              bg-blue-600
              px-4
              py-2
              text-white
            "
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
