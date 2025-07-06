import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, Playlist, SortOption } from '../types/music';

class PlaylistManager {
  private static instance: PlaylistManager;
  private playlists: Playlist[] = [];
  private currentPlaylist: Playlist | null = null;

  static getInstance(): PlaylistManager {
    if (!PlaylistManager.instance) {
      PlaylistManager.instance = new PlaylistManager();
    }
    return PlaylistManager.instance;
  }

  async loadPlaylists(): Promise<Playlist[]> {
    try {
      const storedPlaylists = await AsyncStorage.getItem('playlists');
      if (storedPlaylists) {
        this.playlists = JSON.parse(storedPlaylists);
      }
      return this.playlists;
    } catch (error) {
      console.error('Error loading playlists:', error);
      return [];
    }
  }

  async savePlaylists(): Promise<void> {
    try {
      await AsyncStorage.setItem('playlists', JSON.stringify(this.playlists));
    } catch (error) {
      console.error('Error saving playlists:', error);
      throw error;
    }
  }

  async createPlaylist(name: string, tracks: Track[] = []): Promise<Playlist> {
    const playlist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.playlists.push(playlist);
    await this.savePlaylists();
    return playlist;
  }

  async updatePlaylist(playlistId: string, updates: Partial<Playlist>): Promise<Playlist> {
    const index = this.playlists.findIndex(p => p.id === playlistId);
    if (index === -1) {
      throw new Error('Playlist not found');
    }

    this.playlists[index] = {
      ...this.playlists[index],
      ...updates,
      updatedAt: new Date(),
    };

    await this.savePlaylists();
    return this.playlists[index];
  }

  async deletePlaylist(playlistId: string): Promise<void> {
    const index = this.playlists.findIndex(p => p.id === playlistId);
    if (index === -1) {
      throw new Error('Playlist not found');
    }

    this.playlists.splice(index, 1);
    await this.savePlaylists();
  }

  async addTrackToPlaylist(playlistId: string, track: Track): Promise<Playlist> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    if (!playlist.tracks.find(t => t.id === track.id)) {
      playlist.tracks.push(track);
      playlist.updatedAt = new Date();
      await this.savePlaylists();
    }

    return playlist;
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<Playlist> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const trackIndex = playlist.tracks.findIndex(t => t.id === trackId);
    if (trackIndex > -1) {
      playlist.tracks.splice(trackIndex, 1);
      playlist.updatedAt = new Date();
      await this.savePlaylists();
    }

    return playlist;
  }

  async reorderPlaylistTracks(playlistId: string, fromIndex: number, toIndex: number): Promise<Playlist> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    const track = playlist.tracks.splice(fromIndex, 1)[0];
    playlist.tracks.splice(toIndex, 0, track);
    playlist.updatedAt = new Date();
    await this.savePlaylists();

    return playlist;
  }

  sortTracks(tracks: Track[], sortOption: SortOption, ascending: boolean = true): Track[] {
    const sorted = [...tracks].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortOption) {
        case SortOption.TITLE:
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case SortOption.ARTIST:
          aValue = a.artist.toLowerCase();
          bValue = b.artist.toLowerCase();
          break;
        case SortOption.ALBUM:
          aValue = a.album.toLowerCase();
          bValue = b.album.toLowerCase();
          break;
        case SortOption.DURATION:
          aValue = a.duration;
          bValue = b.duration;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return ascending ? -1 : 1;
      if (aValue > bValue) return ascending ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  async sortPlaylistTracks(playlistId: string, sortOption: SortOption, ascending: boolean = true): Promise<Playlist> {
    const playlist = this.playlists.find(p => p.id === playlistId);
    if (!playlist) {
      throw new Error('Playlist not found');
    }

    playlist.tracks = this.sortTracks(playlist.tracks, sortOption, ascending);
    playlist.updatedAt = new Date();
    await this.savePlaylists();

    return playlist;
  }

  getPlaylists(): Playlist[] {
    return [...this.playlists];
  }

  getPlaylistById(id: string): Playlist | undefined {
    return this.playlists.find(p => p.id === id);
  }

  getCurrentPlaylist(): Playlist | null {
    return this.currentPlaylist;
  }

  setCurrentPlaylist(playlist: Playlist | null): void {
    this.currentPlaylist = playlist;
  }

  async createQueueFromTracks(tracks: Track[]): Promise<Playlist> {
    const queuePlaylist: Playlist = {
      id: 'queue',
      name: 'Current Queue',
      tracks,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.setCurrentPlaylist(queuePlaylist);
    return queuePlaylist;
  }
}

export default PlaylistManager;