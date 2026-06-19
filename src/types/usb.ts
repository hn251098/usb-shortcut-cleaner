export type DeviceStatus = "safe" | "scanning" | "suspicious" | "infected";

export interface UsbDevice {
  driveLetter: string;

  volumeName: string;

  totalSpace: number;

  availableSpace: number;

  fileSystem: string;

  status?: DeviceStatus;

  score?: number;

  reasons: string[];

  lastScannedAt?: string;

  isScanning?: boolean;

  isCleaning?: boolean;
}
