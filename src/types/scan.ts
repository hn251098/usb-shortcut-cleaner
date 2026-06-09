import { DeviceStatus } from "./usb";

export interface ScanResult {
  driveLetter: string;

  status: DeviceStatus;

  score: number;

  reasons: string[];
}
