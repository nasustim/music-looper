# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native mobile application for music looping and playlist management. The app uses a service-oriented architecture with singleton services for audio playback, music library management, and playlist operations.

**Key Technologies:**
- React Native 0.80.1
- TypeScript
- react-native-track-player for audio playback
- AsyncStorage for data persistence
- React Navigation for navigation
- Jest with React Native Testing Library for testing

## Development Commands

### Initial Setup
```bash
npm install
```

### iOS Setup (required for first run and after updating native dependencies)
```bash
bundle install
bundle exec pod install
```

### Development
```bash
npm start           # Start Metro bundler
npm run ios         # Run iOS app
npm run android     # Run Android app
npm run lint        # Run ESLint
npm test           # Run Jest tests
```

### Testing
```bash
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run tests with coverage
```

## Architecture Overview

### Service Layer (Singleton Pattern)
- **AudioPlayerService**: Manages audio playback using react-native-track-player
  - Handles play/pause, skip, seek operations
  - Manages playback state and queue
  - Uses observer pattern for state updates
  - Located: `src/services/audioPlayer.ts`

- **MusicLibraryService**: Manages device music library access
  - Handles iOS permissions for media library
  - Provides track search and retrieval
  - Currently uses mock data (real implementation needed)
  - Located: `src/services/musicLibrary.ts`

- **PlaylistManager**: Manages playlist CRUD operations
  - Persists playlists to AsyncStorage
  - Handles track sorting and reordering
  - Supports playlist creation, update, deletion
  - Located: `src/services/playlistManager.ts`

### Component Architecture
- **AudioPlayer**: Main playback control component with progress bar and controls
- **TrackList**: Displays track lists with sorting, reordering, and playlist management
- Both components use the service layer and follow React hooks patterns

### Type Definitions
Core types are defined in `src/types/music.ts`:
- `Track`: Audio track metadata
- `Playlist`: Collection of tracks with metadata
- `PlaybackState`: Current playback state
- `SortOption`: Enum for track sorting options

## Key Technical Details

### Audio Playback
- Uses react-native-track-player with capabilities for play/pause, skip, stop
- Supports background playback and media controls
- State management through singleton service with observer pattern

### Data Persistence
- Playlists are stored in AsyncStorage as JSON
- Music library permissions are managed for iOS
- All data operations are async/await based

### State Management
- Services use internal state with observer pattern
- Components subscribe to service state changes
- No external state management library (Redux, etc.)

### Navigation
- Uses React Navigation v7 with stack navigation
- Currently minimal navigation structure (screens directory empty)

## Testing Strategy

### Test Configuration
- Jest with React Native preset
- Custom setup file: `jest.setup.js`
- Test files in `__tests__` directories alongside source files
- Coverage collection from `src/` directory

### Test Structure
- Service tests: Focus on business logic and state management
- Component tests: Use React Native Testing Library for UI interactions
- Type tests: Validate TypeScript interfaces and types

### Common Testing Patterns
- Mock react-native-track-player for audio service tests
- Mock AsyncStorage for playlist persistence tests
- Test component rendering and user interactions

## Important Dependencies

### Core Dependencies
- `react-native-track-player`: Audio playback engine
- `@react-native-async-storage/async-storage`: Data persistence
- `react-native-permissions`: iOS/Android permissions
- `@react-navigation/native`: Navigation framework

### Development Dependencies
- `@testing-library/react-native`: Component testing
- `@testing-library/jest-native`: Jest matchers for React Native
- `typescript`: Type checking
- `eslint`: Code linting

## Platform-Specific Notes

### iOS
- Requires CocoaPods for dependency management
- Media library permissions needed for music access
- Uses Swift for native iOS components

### Android
- Music library access requires different permission handling
- Currently not fully implemented for Android music library

## Development Workflow

1. **Service Development**: Start with service layer for business logic
2. **Component Development**: Build UI components that consume services
3. **Testing**: Write tests alongside development (not after)
4. **Type Safety**: Always define TypeScript interfaces first
5. **State Management**: Use observer pattern for real-time updates

## Common Patterns

### Service Usage
```typescript
const audioPlayer = AudioPlayerService.getInstance();
const unsubscribe = audioPlayer.subscribe((state) => {
  // Handle state updates
});
```

### Component Testing
```typescript
import { render, fireEvent } from '@testing-library/react-native';
// Test component interactions
```

### Async Operations
All service operations are async and should be properly handled with try/catch blocks.