import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import Slider from '@react-native-community/slider';
import AudioPlayerService from '../services/audioPlayer';
import { PlaybackState, Track } from '../types/music';

interface AudioPlayerProps {
  onTrackChange?: (track: Track | null) => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ onTrackChange }) => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    queue: [],
    currentIndex: 0,
  });
  const [isSliding, setIsSliding] = useState(false);

  const audioPlayer = AudioPlayerService.getInstance();

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((state: PlaybackState) => {
      setPlaybackState(state);
      if (onTrackChange) {
        onTrackChange(state.currentTrack);
      }
    });

    return unsubscribe;
  }, [audioPlayer, onTrackChange]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayPause = async () => {
    try {
      if (playbackState.isPlaying) {
        await audioPlayer.pause();
      } else {
        await audioPlayer.play();
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handlePrevious = async () => {
    try {
      await audioPlayer.skipToPrevious();
    } catch (error) {
      console.error('Error skipping to previous:', error);
    }
  };

  const handleNext = async () => {
    try {
      await audioPlayer.skipToNext();
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  };

  const handleSeek = async (value: number) => {
    try {
      await audioPlayer.seekTo(value);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  };

  if (!playbackState.currentTrack) {
    return (
      <View style={styles.container}>
        <Text style={styles.noTrackText}>No track selected</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.trackInfo}>
        {playbackState.currentTrack.artwork && (
          <Image
            source={{ uri: playbackState.currentTrack.artwork }}
            style={styles.artwork}
          />
        )}
        <View style={styles.textInfo}>
          <Text style={styles.title} numberOfLines={1}>
            {playbackState.currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {playbackState.currentTrack.artist}
          </Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>
          {formatTime(playbackState.currentTime)}
        </Text>
        <Slider
          style={styles.progressBar}
          value={isSliding ? playbackState.currentTime : playbackState.currentTime}
          maximumValue={playbackState.duration}
          minimumValue={0}
          onValueChange={(value) => {
            setIsSliding(true);
            setPlaybackState(prev => ({ ...prev, currentTime: value }));
          }}
          onSlidingComplete={(value) => {
            setIsSliding(false);
            handleSeek(value);
          }}
          thumbTintColor="#007AFF"
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#E0E0E0"
        />
        <Text style={styles.timeText}>
          {formatTime(playbackState.duration)}
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handlePrevious}
          disabled={playbackState.currentIndex === 0}
        >
          <Text style={styles.controlText}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={handlePlayPause}
        >
          <Text style={styles.playText}>
            {playbackState.isPlaying ? '⏸' : '▶️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleNext}
          disabled={playbackState.currentIndex >= playbackState.queue.length - 1}
        >
          <Text style={styles.controlText}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trackInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  artwork: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    marginRight: 12,
  },
  textInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  artist: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    width: 40,
    textAlign: 'center',
  },
  progressBar: {
    flex: 1,
    height: 40,
    marginHorizontal: 8,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    backgroundColor: '#007AFF',
  },
  sliderTrack: {
    height: 4,
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
  },
  controlText: {
    fontSize: 18,
    color: '#666',
  },
  playText: {
    fontSize: 24,
    color: '#FFFFFF',
  },
  noTrackText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    padding: 20,
  },
});

export default AudioPlayer;