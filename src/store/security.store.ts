import { create } from "zustand";

import { ComputerSecurityState } from "../types/computer-security";

interface SecurityStore {
  computer: ComputerSecurityState;

  setScanning: (value: boolean) => void;

  setStatus: (status: ComputerSecurityState["status"]) => void;

  setThreats: (threats: ComputerSecurityState["threats"]) => void;

  setLastScannedAt: (value: string) => void;
}

export const useSecurityStore = create<SecurityStore>((set) => ({
  computer: {
    status: "safe",

    threats: [],

    isScanning: false,
  },

  setScanning: (value) =>
    set((state) => ({
      computer: {
        ...state.computer,

        isScanning: value,
      },
    })),

  setStatus: (status) =>
    set((state) => ({
      computer: {
        ...state.computer,

        status,
      },
    })),

  setThreats: (threats) =>
    set((state) => ({
      computer: {
        ...state.computer,

        threats,
      },
    })),

  setLastScannedAt: (value) =>
    set((state) => ({
      computer: {
        ...state.computer,

        lastScannedAt: value,
      },
    })),
}));
