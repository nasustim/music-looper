import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';
import { Track, MusicLibraryPermissions } from '../types/music';

class MusicLibraryService {
  private static instance: MusicLibraryService;
  private tracks: Track[] = [];
  private permissionStatus: MusicLibraryPermissions = {
    granted: false,
    requested: false,
  };

  static getInstance(): MusicLibraryService {
    if (!MusicLibraryService.instance) {
      MusicLibraryService.instance = new MusicLibraryService();
    }
    return MusicLibraryService.instance;
  }

  async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      return false;
    }

    try {
      const permission = PERMISSIONS.IOS.MEDIA_LIBRARY;
      const result = await check(permission);
      
      if (result === RESULTS.GRANTED) {
        this.permissionStatus.granted = true;
        return true;
      }

      if (result === RESULTS.DENIED) {
        const requestResult = await request(permission);
        this.permissionStatus.requested = true;
        
        if (requestResult === RESULTS.GRANTED) {
          this.permissionStatus.granted = true;
          return true;
        }
      }

      return false;
    } catch (error) {
      console.error('Error requesting music library permissions:', error);
      return false;
    }
  }

  async loadMusicLibrary(): Promise<Track[]> {
    if (!this.permissionStatus.granted) {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Music library access denied');
      }
    }

    try {
      // Note: This is a placeholder implementation
      // In a real app, you would use a native module or library
      // to access the device's music library
      const mockTracks: Track[] = [
        {
          id: '1',
          title: 'Sample Song 1',
          artist: 'Sample Artist',
          album: 'Sample Album',
          duration: 180,
          url: 'sample-url-1',
          artwork: undefined,
        },
        {
          id: '2',
          title: 'Sample Song 2',
          artist: 'Another Artist',
          album: 'Another Album',
          duration: 210,
          url: 'sample-url-2',
          artwork: undefined,
        },
      ];

      this.tracks = mockTracks;
      return mockTracks;
    } catch (error) {
      console.error('Error loading music library:', error);
      throw error;
    }
  }

  getTracks(): Track[] {
    return [...this.tracks];
  }

  getTrackById(id: string): Track | undefined {
    return this.tracks.find(track => track.id === id);
  }

  searchTracks(query: string): Track[] {
    if (!query.trim()) {
      return this.getTracks();
    }

    const lowercaseQuery = query.toLowerCase();
    return this.tracks.filter(track =>
      track.title.toLowerCase().includes(lowercaseQuery) ||
      track.artist.toLowerCase().includes(lowercaseQuery) ||
      track.album.toLowerCase().includes(lowercaseQuery)
    );
  }

  getPermissionStatus(): MusicLibraryPermissions {
    return { ...this.permissionStatus };
  }
}

export default MusicLibraryService;