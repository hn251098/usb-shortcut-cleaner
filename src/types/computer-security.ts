export type ComputerStatus = "safe" | "infected" | "scanning";

export interface ComputerSecurityState {
  status: ComputerStatus;

  threats: ComputerThreat[];

  lastScannedAt?: string;

  isScanning: boolean;
}

export interface ComputerThreat {
  id: string;

  name: string;

  path: string;

  threat_type: string;

  description: string;
}

export interface ComputerScanResult {
  infected: boolean;

  score: number;

  threats: ComputerThreat[];
}

export interface CleanComputerResult {
  success: boolean;

  removed_items: string[];

  errors: string[];
}
