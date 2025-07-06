import TrackPlayer, { 
  Capability, 
  Event, 
  State, 
  Track as TrackPlayerTrack 
} from 'react-native-track-player';
import { Track, PlaybackState } from '../types/music';

class AudioPlayerService {
  private static instance: AudioPlayerService;
  private currentState: PlaybackState = {
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentIndex: 0,
  };
  private listeners: ((state: PlaybackState) => void)[] = [];

  static getInstance(): AudioPlayerService {
    if (!AudioPlayerService.instance) {
      AudioPlayerService.instance = new AudioPlayerService();
    }
    return AudioPlayerService.instance;
  }

  async initialize(): Promise<void> {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });

      this.setupEventListeners();
    } catch (error) {
      console.error('Error initializing audio player:', error);
      throw error;
    }
  }

  private setupEventListeners(): void {
    TrackPlayer.addEventListener(Event.PlaybackState, (data) => {
      const isPlaying = data.state === State.Playing;
      this.updateState({ isPlaying });
    });

    TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (data) => {
      if (data.nextTrack !== undefined) {
        const track = await TrackPlayer.getTrack(data.nextTrack);
        if (track) {
          this.updateState({ 
            currentIndex: data.nextTrack,
            currentTrack: this.convertTrackPlayerTrack(track)
          });
        }
      }
    });
  }

  private convertTrackPlayerTrack(track: TrackPlayerTrack): Track {
    return {
      id: track.id as string,
      title: track.title || 'Unknown',
      artist: track.artist || 'Unknown Artist',
      album: track.album || 'Unknown Album',
      duration: track.duration || 0,
      url: track.url,
      artwork: track.artwork as string | undefined,
    };
  }

  private convertToTrackPlayerTrack(track: Track): TrackPlayerTrack {
    return {
      id: track.id,
      url: track.url,
      title: track.title,
      artist: track.artist,
      album: track.album,
      duration: track.duration,
      artwork: track.artwork,
    };
  }

  async setQueue(tracks: Track[]): Promise<void> {
    try {
      await TrackPlayer.reset();
      const trackPlayerTracks = tracks.map(track => this.convertToTrackPlayerTrack(track));
      await TrackPlayer.add(trackPlayerTracks);
      
      this.updateState({
        queue: tracks,
        currentIndex: 0,
        currentTrack: tracks[0] || null,
      });
    } catch (error) {
      console.error('Error setting queue:', error);
      throw error;
    }
  }

  async play(): Promise<void> {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.error('Error playing track:', error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    try {
      await TrackPlayer.pause();
    } catch (error) {
      console.error('Error pausing track:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await TrackPlayer.stop();
      this.updateState({
        isPlaying: false,
        currentTime: 0,
      });
    } catch (error) {
      console.error('Error stopping track:', error);
      throw error;
    }
  }

  async skipToNext(): Promise<void> {
    try {
      await TrackPlayer.skipToNext();
    } catch (error) {
      console.error('Error skipping to next track:', error);
      throw error;
    }
  }

  async skipToPrevious(): Promise<void> {
    try {
      await TrackPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous track:', error);
      throw error;
    }
  }

  async seekTo(position: number): Promise<void> {
    try {
      await TrackPlayer.seekTo(position);
      this.updateState({ currentTime: position });
    } catch (error) {
      console.error('Error seeking to position:', error);
      throw error;
    }
  }

  private updateState(updates: Partial<PlaybackState>): void {
    this.currentState = { ...this.currentState, ...updates };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  getState(): PlaybackState {
    return { ...this.currentState };
  }

  subscribe(listener: (state: PlaybackState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

export default AudioPlayerService;