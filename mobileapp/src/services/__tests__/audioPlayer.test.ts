import AudioPlayerService from '../audioPlayer';
import TrackPlayer from 'react-native-track-player';
import { Track } from '../../types/music';

jest.mock('react-native-track-player', () => ({
  setupPlayer: jest.fn(),
  updateOptions: jest.fn(),
  reset: jest.fn(),
  add: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  skipToNext: jest.fn(),
  skipToPrevious: jest.fn(),
  seekTo: jest.fn(),
  getTrack: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  Capability: {
    Play: 'play',
    Pause: 'pause',
    SkipToNext: 'next',
    SkipToPrevious: 'previous',
    Stop: 'stop',
  },
  Event: {
    PlaybackState: 'playback-state',
    PlaybackTrackChanged: 'playback-track-changed',
  },
  State: {
    Playing: 'playing',
    Paused: 'paused',
    Stopped: 'stopped',
  },
}));

const mockTrackPlayer = TrackPlayer as jest.Mocked<typeof TrackPlayer>;

describe('AudioPlayerService', () => {
  let service: AudioPlayerService;
  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    url: 'test-url',
  };

  beforeEach(() => {
    service = AudioPlayerService.getInstance();
    jest.clearAllMocks();
  });

  describe('initialize', () => {
    it('should setup player and event listeners', async () => {
      mockTrackPlayer.setupPlayer.mockResolvedValue(undefined);
      mockTrackPlayer.updateOptions.mockResolvedValue(undefined);

      await service.initialize();

      expect(mockTrackPlayer.setupPlayer).toHaveBeenCalled();
      expect(mockTrackPlayer.updateOptions).toHaveBeenCalledWith({
        capabilities: expect.arrayContaining([
          'play', 'pause', 'next', 'previous', 'stop'
        ]),
        compactCapabilities: expect.arrayContaining([
          'play', 'pause', 'next', 'previous'
        ]),
      });
      expect(mockTrackPlayer.addEventListener).toHaveBeenCalledWith(
        'playback-state',
        expect.any(Function)
      );
      expect(mockTrackPlayer.addEventListener).toHaveBeenCalledWith(
        'playback-track-changed',
        expect.any(Function)
      );
    });

    it('should handle initialization errors', async () => {
      mockTrackPlayer.setupPlayer.mockRejectedValue(new Error('Setup failed'));

      await expect(service.initialize()).rejects.toThrow('Setup failed');
    });
  });

  describe('setQueue', () => {
    it('should reset player and add tracks', async () => {
      mockTrackPlayer.reset.mockResolvedValue(undefined);
      mockTrackPlayer.add.mockResolvedValue(undefined);

      await service.setQueue([mockTrack]);

      expect(mockTrackPlayer.reset).toHaveBeenCalled();
      expect(mockTrackPlayer.add).toHaveBeenCalledWith([{
        id: '1',
        url: 'test-url',
        title: 'Test Track',
        artist: 'Test Artist',
        album: 'Test Album',
        duration: 180,
        artwork: undefined,
      }]);
    });

    it('should handle empty queue', async () => {
      mockTrackPlayer.reset.mockResolvedValue(undefined);
      mockTrackPlayer.add.mockResolvedValue(undefined);

      await service.setQueue([]);

      expect(mockTrackPlayer.reset).toHaveBeenCalled();
      expect(mockTrackPlayer.add).toHaveBeenCalledWith([]);
    });

    it('should handle queue setting errors', async () => {
      mockTrackPlayer.reset.mockRejectedValue(new Error('Reset failed'));

      await expect(service.setQueue([mockTrack])).rejects.toThrow('Reset failed');
    });
  });

  describe('play', () => {
    it('should call TrackPlayer.play()', async () => {
      mockTrackPlayer.play.mockResolvedValue(undefined);

      await service.play();

      expect(mockTrackPlayer.play).toHaveBeenCalled();
    });

    it('should handle play errors', async () => {
      mockTrackPlayer.play.mockRejectedValue(new Error('Play failed'));

      await expect(service.play()).rejects.toThrow('Play failed');
    });
  });

  describe('pause', () => {
    it('should call TrackPlayer.pause()', async () => {
      mockTrackPlayer.pause.mockResolvedValue(undefined);

      await service.pause();

      expect(mockTrackPlayer.pause).toHaveBeenCalled();
    });

    it('should handle pause errors', async () => {
      mockTrackPlayer.pause.mockRejectedValue(new Error('Pause failed'));

      await expect(service.pause()).rejects.toThrow('Pause failed');
    });
  });

  describe('stop', () => {
    it('should call TrackPlayer.stop()', async () => {
      mockTrackPlayer.stop.mockResolvedValue(undefined);

      await service.stop();

      expect(mockTrackPlayer.stop).toHaveBeenCalled();
    });

    it('should handle stop errors', async () => {
      mockTrackPlayer.stop.mockRejectedValue(new Error('Stop failed'));

      await expect(service.stop()).rejects.toThrow('Stop failed');
    });
  });

  describe('skipToNext', () => {
    it('should call TrackPlayer.skipToNext()', async () => {
      mockTrackPlayer.skipToNext.mockResolvedValue(undefined);

      await service.skipToNext();

      expect(mockTrackPlayer.skipToNext).toHaveBeenCalled();
    });

    it('should handle skip next errors', async () => {
      mockTrackPlayer.skipToNext.mockRejectedValue(new Error('Skip failed'));

      await expect(service.skipToNext()).rejects.toThrow('Skip failed');
    });
  });

  describe('skipToPrevious', () => {
    it('should call TrackPlayer.skipToPrevious()', async () => {
      mockTrackPlayer.skipToPrevious.mockResolvedValue(undefined);

      await service.skipToPrevious();

      expect(mockTrackPlayer.skipToPrevious).toHaveBeenCalled();
    });

    it('should handle skip previous errors', async () => {
      mockTrackPlayer.skipToPrevious.mockRejectedValue(new Error('Skip failed'));

      await expect(service.skipToPrevious()).rejects.toThrow('Skip failed');
    });
  });

  describe('seekTo', () => {
    it('should call TrackPlayer.seekTo() with position', async () => {
      mockTrackPlayer.seekTo.mockResolvedValue(undefined);

      await service.seekTo(60);

      expect(mockTrackPlayer.seekTo).toHaveBeenCalledWith(60);
    });

    it('should handle seek errors', async () => {
      mockTrackPlayer.seekTo.mockRejectedValue(new Error('Seek failed'));

      await expect(service.seekTo(60)).rejects.toThrow('Seek failed');
    });
  });

  describe('getState', () => {
    it('should return current playback state', () => {
      const state = service.getState();

      expect(state).toHaveProperty('currentTrack');
      expect(state).toHaveProperty('isPlaying');
      expect(state).toHaveProperty('currentTime');
      expect(state).toHaveProperty('duration');
      expect(state).toHaveProperty('queue');
      expect(state).toHaveProperty('currentIndex');
    });
  });

  describe('subscribe', () => {
    it('should add listener and return unsubscribe function', () => {
      const mockListener = jest.fn();

      const unsubscribe = service.subscribe(mockListener);

      expect(typeof unsubscribe).toBe('function');
      
      unsubscribe();
      // Additional assertion would require access to internal listeners array
    });
  });
});