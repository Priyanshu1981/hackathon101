export interface UserProfile {
  userId: string;
  phone: string;
  name?: string;
  language?: string;
  prefs?: {
    audioFirst?: boolean;
  };
  createdAt: string;
}

export interface PlotRecord {
  plotId: string;
  userId: string;
  geoJSON: unknown;
  area: number;
  irrigation?: 'rainfed' | 'irrigated' | 'unknown';
  createdAt: string;
}