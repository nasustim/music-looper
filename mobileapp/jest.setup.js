/* eslint-env jest */
import 'react-native-gesture-handler/jestSetup';

// Mock react-native-permissions
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
    UNAVAILABLE: 'unavailable',
  },
}));

// Mock react-native-track-player
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

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// Mock problematic react-native modules
jest.mock('react-native', () => {
  return {
    Platform: { OS: 'ios' },
    View: 'View',
    Text: 'Text',
    TouchableOpacity: 'TouchableOpacity',
    FlatList: 'FlatList',
    Image: 'Image',
    StyleSheet: {
      create: (styles) => styles,
      flatten: (styles) => styles,
    },
    Alert: {
      alert: jest.fn(),
    },
    StatusBar: 'StatusBar',
    useColorScheme: () => 'light',
    Dimensions: {
      get: () => ({ width: 375, height: 667 }),
    },
  };
});

// Mock @react-native-community/slider
jest.mock('@react-native-community/slider', () => 'Slider');

// Mock the new app screen
jest.mock('@react-native/new-app-screen', () => ({
  NewAppScreen: 'NewAppScreen',
}));

// Silence the warning about componentWillMount
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillMount')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});