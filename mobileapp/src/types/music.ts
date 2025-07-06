export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork?: string;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaybackState {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queue: Track[];
  currentIndex: number;
}

export enum SortOption {
  TITLE = 'title',
  ARTIST = 'artist',
  ALBUM = 'album',
  DURATION = 'duration',
}

export interface MusicLibraryPermissions {
  granted: boolean;
  requested: boolean;
}