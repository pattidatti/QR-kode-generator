
export interface QRSettings {
  url: string;
  label: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
}

export interface AIAnalysisResult {
  label: string;
  primaryColor: string;
  secondaryColor: string;
  description: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  READY = 'READY',
  ERROR = 'ERROR'
}
