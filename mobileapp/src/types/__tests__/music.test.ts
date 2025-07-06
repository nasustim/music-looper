import { Track, Playlist, PlaybackState, SortOption, MusicLibraryPermissions } from '../music';

describe('Music Types', () => {
  describe('Track', () => {
    it('should have all required properties', () => {
      const track: Track = {
        id: '1',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        url: 'test-url',
        artwork: 'test-artwork',
      };

      expect(track.id).toBe('1');
      expect(track.title).toBe('Test Track');
      expect(track.artist).toBe('Test Artist');
      expect(track.album).toBe('Test Album');
      expect(track.duration).toBe(180);
      expect(track.url).toBe('test-url');
      expect(track.artwork).toBe('test-artwork');
    });

    it('should allow optional artwork property', () => {
      const track: Track = {
        id: '1',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        url: 'test-url',
      };

      expect(track.artwork).toBeUndefined();
    });
  });

  describe('Playlist', () => {
    it('should have all required properties', () => {
      const playlist: Playlist = {
        id: '1',
        name: 'Test Playlist',
        tracks: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(playlist.id).toBe('1');
      expect(playlist.name).toBe('Test Playlist');
      expect(playlist.tracks).toEqual([]);
      expect(playlist.createdAt).toBeInstanceOf(Date);
      expect(playlist.updatedAt).toBeInstanceOf(Date);
    });

    it('should contain tracks array', () => {
      const track: Track = {
        id: '1',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        url: 'test-url',
      };

      const playlist: Playlist = {
        id: '1',
        name: 'Test Playlist',
        tracks: [track],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(playlist.tracks).toHaveLength(1);
      expect(playlist.tracks[0]).toEqual(track);
    });
  });

  describe('PlaybackState', () => {
    it('should have all required properties', () => {
      const track: Track = {
        id: '1',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        url: 'test-url',
      };

      const playbackState: PlaybackState = {
        currentTrack: track,
        isPlaying: true,
        currentTime: 60,
        duration: 180,
        queue: [track],
        currentIndex: 0,
      };

      expect(playbackState.currentTrack).toEqual(track);
      expect(playbackState.isPlaying).toBe(true);
      expect(playbackState.currentTime).toBe(60);
      expect(playbackState.duration).toBe(180);
      expect(playbackState.queue).toEqual([track]);
      expect(playbackState.currentIndex).toBe(0);
    });

    it('should allow null currentTrack', () => {
      const playbackState: PlaybackState = {
        currentTrack: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        queue: [],
        currentIndex: 0,
      };

      expect(playbackState.currentTrack).toBeNull();
    });
  });

  describe('SortOption', () => {
    it('should have all sort options', () => {
      expect(SortOption.TITLE).toBe('title');
      expect(SortOption.ARTIST).toBe('artist');
      expect(SortOption.ALBUM).toBe('album');
      expect(SortOption.DURATION).toBe('duration');
    });

    it('should be usable as object keys', () => {
      const sortMap = {
        [SortOption.TITLE]: 'Sort by Title',
        [SortOption.ARTIST]: 'Sort by Artist',
        [SortOption.ALBUM]: 'Sort by Album',
        [SortOption.DURATION]: 'Sort by Duration',
      };

      expect(sortMap[SortOption.TITLE]).toBe('Sort by Title');
      expect(sortMap[SortOption.ARTIST]).toBe('Sort by Artist');
      expect(sortMap[SortOption.ALBUM]).toBe('Sort by Album');
      expect(sortMap[SortOption.DURATION]).toBe('Sort by Duration');
    });
  });

  describe('MusicLibraryPermissions', () => {
    it('should have all required properties', () => {
      const permissions: MusicLibraryPermissions = {
        granted: true,
        requested: true,
      };

      expect(permissions.granted).toBe(true);
      expect(permissions.requested).toBe(true);
    });

    it('should allow false values', () => {
      const permissions: MusicLibraryPermissions = {
        granted: false,
        requested: false,
      };

      expect(permissions.granted).toBe(false);
      expect(permissions.requested).toBe(false);
    });
  });
});