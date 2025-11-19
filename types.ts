export interface OcrResult {
  id: string;
  text: string;
  timestamp: number;
  imageUrl: string;
}

export interface UserProfile {
  credits: number;
  history: OcrResult[];
}

export enum AppState {
  HOME = 'HOME',
  PRICING = 'PRICING'
}