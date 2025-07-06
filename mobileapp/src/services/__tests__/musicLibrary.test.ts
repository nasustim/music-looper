import MusicLibraryService from '../musicLibrary';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { Platform } from 'react-native';

jest.mock('react-native-permissions', () => ({
  check: jest.fn(),
  request: jest.fn(),
  PERMISSIONS: {
    IOS: {
      MEDIA_LIBRARY: 'ios.permission.MEDIA_LIBRARY',
    },
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
  },
}));

jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

const mockCheck = check as jest.MockedFunction<typeof check>;
const mockRequest = request as jest.MockedFunction<typeof request>;

describe('MusicLibraryService', () => {
  let service: MusicLibraryService;

  beforeEach(() => {
    service = MusicLibraryService.getInstance();
    jest.clearAllMocks();
  });

  describe('requestPermissions', () => {
    it('should return true when permission is already granted', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      const result = await service.requestPermissions();

      expect(result).toBe(true);
      expect(mockCheck).toHaveBeenCalledWith(PERMISSIONS.IOS.MEDIA_LIBRARY);
      expect(mockRequest).not.toHaveBeenCalled();
    });

    it('should request permission when denied and return true if granted', async () => {
      mockCheck.mockResolvedValue(RESULTS.DENIED);
      mockRequest.mockResolvedValue(RESULTS.GRANTED);

      const result = await service.requestPermissions();

      expect(result).toBe(true);
      expect(mockCheck).toHaveBeenCalledWith(PERMISSIONS.IOS.MEDIA_LIBRARY);
      expect(mockRequest).toHaveBeenCalledWith(PERMISSIONS.IOS.MEDIA_LIBRARY);
    });

    it('should return false when permission is denied after request', async () => {
      mockCheck.mockResolvedValue(RESULTS.DENIED);
      mockRequest.mockResolvedValue(RESULTS.DENIED);

      const result = await service.requestPermissions();

      expect(result).toBe(false);
    });

    it('should return false on non-iOS platform', async () => {
      (Platform as any).OS = 'android';

      const result = await service.requestPermissions();

      expect(result).toBe(false);
      expect(mockCheck).not.toHaveBeenCalled();
      expect(mockRequest).not.toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      mockCheck.mockRejectedValue(new Error('Permission check failed'));

      const result = await service.requestPermissions();

      expect(result).toBe(false);
    });
  });

  describe('loadMusicLibrary', () => {
    it('should load tracks when permission is granted', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);

      const tracks = await service.loadMusicLibrary();

      expect(tracks).toHaveLength(2);
      expect(tracks[0]).toHaveProperty('id');
      expect(tracks[0]).toHaveProperty('title');
      expect(tracks[0]).toHaveProperty('artist');
      expect(tracks[0]).toHaveProperty('album');
      expect(tracks[0]).toHaveProperty('duration');
      expect(tracks[0]).toHaveProperty('url');
    });

    it('should throw error when permission is denied', async () => {
      // Reset the service instance to clear any cached permission state
      service = new (MusicLibraryService as any)();
      mockCheck.mockResolvedValue(RESULTS.DENIED);
      mockRequest.mockResolvedValue(RESULTS.DENIED);

      await expect(service.loadMusicLibrary()).rejects.toThrow('Music library access denied');
    });
  });

  describe('getTracks', () => {
    it('should return copy of tracks array', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);
      await service.loadMusicLibrary();

      const tracks = service.getTracks();

      expect(tracks).toHaveLength(2);
      expect(tracks).not.toBe(service.getTracks()); // Different instances
    });
  });

  describe('getTrackById', () => {
    it('should return track by id', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);
      await service.loadMusicLibrary();

      const track = service.getTrackById('1');

      expect(track).toBeDefined();
      expect(track?.id).toBe('1');
    });

    it('should return undefined for non-existent track', async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);
      await service.loadMusicLibrary();

      const track = service.getTrackById('999');

      expect(track).toBeUndefined();
    });
  });

  describe('searchTracks', () => {
    beforeEach(async () => {
      mockCheck.mockResolvedValue(RESULTS.GRANTED);
      await service.loadMusicLibrary();
    });

    it('should return all tracks for empty query', () => {
      const results = service.searchTracks('');

      expect(results).toHaveLength(2);
    });

    it('should search by title', () => {
      const results = service.searchTracks('Sample Song 1');

      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Sample Song 1');
    });

    it('should search by artist', () => {
      const results = service.searchTracks('Sample Artist');

      expect(results).toHaveLength(1);
      expect(results[0].artist).toBe('Sample Artist');
    });

    it('should search by album', () => {
      const results = service.searchTracks('Another Album');

      expect(results).toHaveLength(1);
      expect(results[0].album).toBe('Another Album');
    });

    it('should be case insensitive', () => {
      const results = service.searchTracks('SAMPLE');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(track => track.title.toLowerCase().includes('sample'))).toBe(true);
    });

    it('should return empty array for no matches', () => {
      const results = service.searchTracks('NonExistentTrack');

      expect(results).toHaveLength(0);
    });
  });

  describe('getPermissionStatus', () => {
    it('should return permission status', () => {
      const status = service.getPermissionStatus();

      expect(status).toHaveProperty('granted');
      expect(status).toHaveProperty('requested');
      expect(typeof status.granted).toBe('boolean');
      expect(typeof status.requested).toBe('boolean');
    });
  });
});