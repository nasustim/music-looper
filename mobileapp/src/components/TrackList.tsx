import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Track, SortOption } from '../types/music';
import PlaylistManager from '../services/playlistManager';

interface SortButtonProps {
  option: SortOption;
  label: string;
  isActive: boolean;
  ascending: boolean;
  onPress: (option: SortOption) => void;
}

const SortButton: React.FC<SortButtonProps> = ({ option, label, isActive, ascending, onPress }) => (
  <TouchableOpacity
    style={[
      styles.sortButton,
      isActive && styles.sortButtonActive,
    ]}
    onPress={() => onPress(option)}
  >
    <Text
      style={[
        styles.sortButtonText,
        isActive && styles.sortButtonTextActive,
      ]}
    >
      {label} {isActive && (ascending ? '↑' : '↓')}
    </Text>
  </TouchableOpacity>
);

const ItemSeparator: React.FC = () => <View style={styles.separator} />;

interface TrackListProps {
  tracks: Track[];
  onTrackPress: (track: Track, index: number) => void;
  onSortChange?: (sortOption: SortOption, ascending: boolean) => void;
  enableSorting?: boolean;
  enableReordering?: boolean;
  playlistId?: string;
}

const TrackList: React.FC<TrackListProps> = ({
  tracks,
  onTrackPress,
  onSortChange,
  enableSorting = true,
  enableReordering = false,
  playlistId,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.TITLE);
  const [ascending, setAscending] = useState(true);
  const [showSortOptions, setShowSortOptions] = useState(false);

  const playlistManager = PlaylistManager.getInstance();

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSort = (option: SortOption) => {
    const newAscending = option === sortOption ? !ascending : true;
    setSortOption(option);
    setAscending(newAscending);
    setShowSortOptions(false);
    
    if (onSortChange) {
      onSortChange(option, newAscending);
    }
  };

  const handleLongPress = (track: Track) => {
    if (enableReordering && playlistId) {
      Alert.alert(
        'Track Options',
        `What would you like to do with "${track.title}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove from Playlist',
            style: 'destructive',
            onPress: () => removeTrackFromPlaylist(track.id),
          },
        ]
      );
    }
  };

  const removeTrackFromPlaylist = async (trackId: string) => {
    if (!playlistId) return;

    try {
      await playlistManager.removeTrackFromPlaylist(playlistId, trackId);
      // Note: Parent component should handle refreshing the track list
    } catch (error) {
      console.error('Error removing track from playlist:', error);
      Alert.alert('Error', 'Failed to remove track from playlist');
    }
  };

  const renderTrackItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => onTrackPress(item, index)}
      onLongPress={() => handleLongPress(item)}
    >
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist} • {item.album}
        </Text>
      </View>
      <Text style={styles.trackDuration}>
        {formatDuration(item.duration)}
      </Text>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
      {enableSorting && (
        <View style={styles.sortContainer}>
          <TouchableOpacity
            style={styles.sortToggle}
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Text style={styles.sortToggleText}>
              Sort by: {sortOption} {ascending ? '↑' : '↓'}
            </Text>
          </TouchableOpacity>
          
          {showSortOptions && (
            <View style={styles.sortOptions}>
              <SortButton 
                option={SortOption.TITLE} 
                label="Title" 
                isActive={sortOption === SortOption.TITLE}
                ascending={ascending}
                onPress={handleSort}
              />
              <SortButton 
                option={SortOption.ARTIST} 
                label="Artist" 
                isActive={sortOption === SortOption.ARTIST}
                ascending={ascending}
                onPress={handleSort}
              />
              <SortButton 
                option={SortOption.ALBUM} 
                label="Album" 
                isActive={sortOption === SortOption.ALBUM}
                ascending={ascending}
                onPress={handleSort}
              />
              <SortButton 
                option={SortOption.DURATION} 
                label="Duration" 
                isActive={sortOption === SortOption.DURATION}
                ascending={ascending}
                onPress={handleSort}
              />
            </View>
          )}
        </View>
      )}

      <FlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        style={styles.trackList}
        ItemSeparatorComponent={ItemSeparator}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sortContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    margin: 16,
    padding: 12,
  },
  sortToggle: {
    paddingVertical: 8,
  },
  sortToggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sortOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    marginRight: 8,
    marginBottom: 8,
  },
  sortButtonActive: {
    backgroundColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  trackList: {
    flex: 1,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: '#666',
  },
  trackDuration: {
    fontSize: 14,
    color: '#999',
    fontVariant: ['tabular-nums'],
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginLeft: 16,
  },
});

export default TrackList;