import React from 'react';
import { render } from '@testing-library/react-native';
import TrackList from '../TrackList';
import { Track } from '../../types/music';

// Mock PlaylistManager
jest.mock('../../services/playlistManager', () => ({
  getInstance: () => ({
    removeTrackFromPlaylist: jest.fn(),
  }),
}));

describe('TrackList', () => {
  const mockTracks: Track[] = [
    {
      id: '1',
      title: 'Test Track 1',
      artist: 'Test Artist 1',
      album: 'Test Album 1',
      duration: 180,
      url: 'test-url-1',
    },
    {
      id: '2',
      title: 'Test Track 2',
      artist: 'Test Artist 2',
      album: 'Test Album 2',
      duration: 240,
      url: 'test-url-2',
    },
  ];

  it('should render without crashing', () => {
    const onTrackPress = jest.fn();
    const { getByTestId } = render(
      <TrackList tracks={mockTracks} onTrackPress={onTrackPress} />
    );

    // Check that the component renders
    expect(getByTestId).toBeDefined();
  });

  it('should render with sorting enabled', () => {
    const onTrackPress = jest.fn();
    const onSortChange = jest.fn();
    
    const { getByText } = render(
      <TrackList 
        tracks={mockTracks} 
        onTrackPress={onTrackPress} 
        onSortChange={onSortChange}
        enableSorting={true}
      />
    );

    expect(getByText('Sort by: title ↑')).toBeTruthy();
  });

  it('should render without sorting when disabled', () => {
    const onTrackPress = jest.fn();
    
    const { queryByText } = render(
      <TrackList 
        tracks={mockTracks} 
        onTrackPress={onTrackPress} 
        enableSorting={false}
      />
    );

    expect(queryByText('Sort by: title ↑')).toBeNull();
  });

  it('should handle empty tracks array', () => {
    const onTrackPress = jest.fn();
    
    const component = render(
      <TrackList tracks={[]} onTrackPress={onTrackPress} />
    );

    expect(component).toBeDefined();
  });

  it('should accept onSortChange prop', () => {
    const onTrackPress = jest.fn();
    const onSortChange = jest.fn();
    
    const component = render(
      <TrackList 
        tracks={mockTracks} 
        onTrackPress={onTrackPress} 
        onSortChange={onSortChange}
        enableSorting={true}
      />
    );

    // Test that component renders with onSortChange prop
    expect(component).toBeDefined();
    expect(onSortChange).toBeDefined();
  });
});