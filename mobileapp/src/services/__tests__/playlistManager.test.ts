import PlaylistManager from '../playlistManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Track, SortOption } from '../../types/music';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

const mockAsyncStorage = AsyncStorage as jest.Mocked<typeof AsyncStorage>;

describe('PlaylistManager', () => {
  let manager: PlaylistManager;
  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    url: 'test-url',
  };

  const mockTrack2: Track = {
    id: '2',
    title: 'Another Track',
    artist: 'Another Artist',
    album: 'Another Album',
    duration: 240,
    url: 'test-url-2',
  };

  beforeEach(() => {
    // Reset the singleton instance
    (PlaylistManager as any).instance = undefined;
    manager = PlaylistManager.getInstance();
    jest.clearAllMocks();
  });

  describe('loadPlaylists', () => {
    it('should load playlists from storage', async () => {
      const mockPlaylists = [
        {
          id: '1',
          name: 'Test Playlist',
          tracks: [mockTrack],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      mockAsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockPlaylists));

      const playlists = await manager.loadPlaylists();

      expect(mockAsyncStorage.getItem).toHaveBeenCalledWith('playlists');
      expect(playlists).toEqual(mockPlaylists);
    });

    it('should return empty array when no playlists in storage', async () => {
      mockAsyncStorage.getItem.mockResolvedValue(null);

      const playlists = await manager.loadPlaylists();

      expect(playlists).toEqual([]);
    });

    it('should handle storage errors', async () => {
      mockAsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));

      const playlists = await manager.loadPlaylists();

      expect(playlists).toEqual([]);
    });
  });

  describe('savePlaylists', () => {
    it('should save playlists to storage', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      await manager.savePlaylists();

      expect(mockAsyncStorage.setItem).toHaveBeenCalledWith('playlists', expect.any(String));
    });

    it('should handle save errors', async () => {
      mockAsyncStorage.setItem.mockRejectedValue(new Error('Save error'));

      await expect(manager.savePlaylists()).rejects.toThrow('Save error');
    });
  });

  describe('createPlaylist', () => {
    it('should create new playlist with tracks', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack]);

      expect(playlist.name).toBe('Test Playlist');
      expect(playlist.tracks).toEqual([mockTrack]);
      expect(playlist.id).toBeDefined();
      expect(playlist.createdAt).toBeInstanceOf(Date);
      expect(playlist.updatedAt).toBeInstanceOf(Date);
    });

    it('should create empty playlist when no tracks provided', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);

      const playlist = await manager.createPlaylist('Empty Playlist');

      expect(playlist.name).toBe('Empty Playlist');
      expect(playlist.tracks).toEqual([]);
    });
  });

  describe('updatePlaylist', () => {
    it('should update existing playlist', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack]);

      const updatedPlaylist = await manager.updatePlaylist(playlist.id, {
        name: 'Updated Playlist',
      });

      expect(updatedPlaylist.name).toBe('Updated Playlist');
      expect(updatedPlaylist.updatedAt).toBeInstanceOf(Date);
    });

    it('should throw error for non-existent playlist', async () => {
      await expect(manager.updatePlaylist('999', { name: 'Test' }))
        .rejects.toThrow('Playlist not found');
    });
  });

  describe('deletePlaylist', () => {
    it('should delete existing playlist', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack]);

      await manager.deletePlaylist(playlist.id);

      const playlists = manager.getPlaylists();
      expect(playlists).not.toContain(playlist);
    });

    it('should throw error for non-existent playlist', async () => {
      await expect(manager.deletePlaylist('999'))
        .rejects.toThrow('Playlist not found');
    });
  });

  describe('addTrackToPlaylist', () => {
    it('should add track to existing playlist', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist');

      const updatedPlaylist = await manager.addTrackToPlaylist(playlist.id, mockTrack);

      expect(updatedPlaylist.tracks).toContain(mockTrack);
    });

    it('should not add duplicate track', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack]);

      const updatedPlaylist = await manager.addTrackToPlaylist(playlist.id, mockTrack);

      expect(updatedPlaylist.tracks).toHaveLength(1);
    });

    it('should throw error for non-existent playlist', async () => {
      await expect(manager.addTrackToPlaylist('999', mockTrack))
        .rejects.toThrow('Playlist not found');
    });
  });

  describe('removeTrackFromPlaylist', () => {
    it('should remove track from playlist', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack]);

      const updatedPlaylist = await manager.removeTrackFromPlaylist(playlist.id, mockTrack.id);

      expect(updatedPlaylist.tracks).not.toContain(mockTrack);
    });

    it('should handle removing non-existent track', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack]);

      const updatedPlaylist = await manager.removeTrackFromPlaylist(playlist.id, '999');

      expect(updatedPlaylist.tracks).toHaveLength(1);
      expect(updatedPlaylist.tracks[0].id).toBe(mockTrack.id);
    });

    it('should throw error for non-existent playlist', async () => {
      await expect(manager.removeTrackFromPlaylist('999', '1'))
        .rejects.toThrow('Playlist not found');
    });
  });

  describe('reorderPlaylistTracks', () => {
    it('should reorder tracks in playlist', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist', [mockTrack, mockTrack2]);

      const updatedPlaylist = await manager.reorderPlaylistTracks(playlist.id, 0, 1);

      expect(updatedPlaylist.tracks[0]).toEqual(mockTrack2);
      expect(updatedPlaylist.tracks[1]).toEqual(mockTrack);
    });

    it('should throw error for non-existent playlist', async () => {
      await expect(manager.reorderPlaylistTracks('999', 0, 1))
        .rejects.toThrow('Playlist not found');
    });
  });

  describe('sortTracks', () => {
    const tracks = [
      { ...mockTrack, title: 'B Track', artist: 'A Artist', duration: 300 },
      { ...mockTrack2, title: 'A Track', artist: 'B Artist', duration: 180 },
    ];

    it('should sort tracks by title ascending', () => {
      const sorted = manager.sortTracks(tracks, SortOption.TITLE, true);

      expect(sorted[0].title).toBe('A Track');
      expect(sorted[1].title).toBe('B Track');
    });

    it('should sort tracks by title descending', () => {
      const sorted = manager.sortTracks(tracks, SortOption.TITLE, false);

      expect(sorted[0].title).toBe('B Track');
      expect(sorted[1].title).toBe('A Track');
    });

    it('should sort tracks by artist', () => {
      const sorted = manager.sortTracks(tracks, SortOption.ARTIST, true);

      expect(sorted[0].artist).toBe('A Artist');
      expect(sorted[1].artist).toBe('B Artist');
    });

    it('should sort tracks by duration', () => {
      const sorted = manager.sortTracks(tracks, SortOption.DURATION, true);

      expect(sorted[0].duration).toBe(180);
      expect(sorted[1].duration).toBe(300);
    });
  });

  describe('sortPlaylistTracks', () => {
    it('should sort playlist tracks', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const tracks = [
        { ...mockTrack, title: 'B Track' },
        { ...mockTrack2, title: 'A Track' },
      ];
      const playlist = await manager.createPlaylist('Test Playlist', tracks);

      const sortedPlaylist = await manager.sortPlaylistTracks(playlist.id, SortOption.TITLE, true);

      expect(sortedPlaylist.tracks[0].title).toBe('A Track');
      expect(sortedPlaylist.tracks[1].title).toBe('B Track');
    });

    it('should throw error for non-existent playlist', async () => {
      await expect(manager.sortPlaylistTracks('999', SortOption.TITLE, true))
        .rejects.toThrow('Playlist not found');
    });
  });

  describe('getPlaylistById', () => {
    it('should return playlist by id', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist');

      const foundPlaylist = manager.getPlaylistById(playlist.id);

      expect(foundPlaylist?.id).toBe(playlist.id);
      expect(foundPlaylist?.name).toBe(playlist.name);
    });

    it('should return undefined for non-existent playlist', () => {
      const playlist = manager.getPlaylistById('999');

      expect(playlist).toBeUndefined();
    });
  });

  describe('getCurrentPlaylist', () => {
    it('should return current playlist', () => {
      const currentPlaylist = manager.getCurrentPlaylist();

      expect(currentPlaylist).toBeNull();
    });
  });

  describe('setCurrentPlaylist', () => {
    it('should set current playlist', async () => {
      mockAsyncStorage.setItem.mockResolvedValue(undefined);
      const playlist = await manager.createPlaylist('Test Playlist');

      manager.setCurrentPlaylist(playlist);

      expect(manager.getCurrentPlaylist()).toEqual(playlist);
    });
  });

  describe('createQueueFromTracks', () => {
    it('should create queue playlist from tracks', async () => {
      const queuePlaylist = await manager.createQueueFromTracks([mockTrack]);

      expect(queuePlaylist.id).toBe('queue');
      expect(queuePlaylist.name).toBe('Current Queue');
      expect(queuePlaylist.tracks).toEqual([mockTrack]);
      expect(manager.getCurrentPlaylist()).toEqual(queuePlaylist);
    });
  });
});