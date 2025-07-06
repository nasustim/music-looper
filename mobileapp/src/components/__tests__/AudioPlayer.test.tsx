import React from 'react';
import { render } from '@testing-library/react-native';
import AudioPlayer from '../AudioPlayer';
import AudioPlayerService from '../../services/audioPlayer';
import { Track, PlaybackState } from '../../types/music';

jest.mock('../../services/audioPlayer');

const mockAudioPlayerService = AudioPlayerService as jest.Mocked<typeof AudioPlayerService>;

describe('AudioPlayer', () => {
  const mockTrack: Track = {
    id: '1',
    title: 'Test Track',
    artist: 'Test Artist',
    album: 'Test Album',
    duration: 180,
    url: 'test-url',
    artwork: 'test-artwork-url',
  };

  const mockPlaybackState: PlaybackState = {
    currentTrack: mockTrack,
    isPlaying: false,
    currentTime: 60,
    duration: 180,
    queue: [mockTrack],
    currentIndex: 0,
  };

  let mockServiceInstance: any;

  beforeEach(() => {
    mockServiceInstance = {
      subscribe: jest.fn(),
      pause: jest.fn(),
      play: jest.fn(),
      skipToPrevious: jest.fn(),
      skipToNext: jest.fn(),
      seekTo: jest.fn(),
    };

    mockAudioPlayerService.getInstance.mockReturnValue(mockServiceInstance);
    jest.clearAllMocks();
  });

  it('should render no track message when no current track', () => {
    const emptyState = { ...mockPlaybackState, currentTrack: null };
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(emptyState);
      return jest.fn();
    });

    const { getByText } = render(<AudioPlayer />);

    expect(getByText('No track selected')).toBeTruthy();
  });

  it('should render track information when track is available', () => {
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(mockPlaybackState);
      return jest.fn();
    });

    const { getByText } = render(<AudioPlayer />);

    expect(getByText('Test Track')).toBeTruthy();
    expect(getByText('Test Artist')).toBeTruthy();
  });

  it('should display play button when not playing', () => {
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(mockPlaybackState);
      return jest.fn();
    });

    const { getByText } = render(<AudioPlayer />);

    expect(getByText('▶️')).toBeTruthy();
  });

  it('should display pause button when playing', () => {
    const playingState = { ...mockPlaybackState, isPlaying: true };
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(playingState);
      return jest.fn();
    });

    const { getByText } = render(<AudioPlayer />);

    expect(getByText('⏸')).toBeTruthy();
  });

  it('should format time correctly', () => {
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(mockPlaybackState);
      return jest.fn();
    });

    const { getByText } = render(<AudioPlayer />);

    expect(getByText('1:00')).toBeTruthy(); // 60 seconds
    expect(getByText('3:00')).toBeTruthy(); // 180 seconds
  });

  it('should call onTrackChange when track changes', () => {
    const onTrackChange = jest.fn();
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(mockPlaybackState);
      return jest.fn();
    });

    render(<AudioPlayer onTrackChange={onTrackChange} />);

    expect(onTrackChange).toHaveBeenCalledWith(mockTrack);
  });

  it('should unsubscribe when component unmounts', () => {
    const mockUnsubscribe = jest.fn();
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(mockPlaybackState);
      return mockUnsubscribe;
    });

    const { unmount } = render(<AudioPlayer />);

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it('should handle component rendering without errors', () => {
    mockServiceInstance.subscribe.mockImplementation((callback: any) => {
      callback(mockPlaybackState);
      return jest.fn();
    });

    const component = render(<AudioPlayer />);

    expect(component).toBeDefined();
    expect(mockServiceInstance.subscribe).toHaveBeenCalled();
  });
});