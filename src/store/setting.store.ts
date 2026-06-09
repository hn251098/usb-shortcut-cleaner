import { create } from "zustand";

import { AppSettings } from "../types/settings";
import { DEFAULT_SETTINGS } from "../constants/default-setting";

interface SettingsState {
  settings: AppSettings;

  setSettings: (settings: AppSettings) => void;

  updateSettings: (partial: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: DEFAULT_SETTINGS,

  setSettings: (settings) => set({ settings }),

  updateSettings: (partial) =>
    set((state) => ({
      settings: {
        ...state.settings,
        ...partial,
      },
    })),
}));
