export interface Movie {
  id: number;
  name: string;
  year: number;
  poster?: {
    url?: string;
    previewUrl?: string;
  };
  rating?: {
    kp?: number;
    imdb?: number;
  };
}
