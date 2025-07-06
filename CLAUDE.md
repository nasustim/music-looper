# Music Looper - React Native iOS App

## Project Overview
A React Native music player app for iOS that accesses the device's music library and allows users to play and reorder songs for language learning purposes. The app uses a service-oriented architecture with singleton services for audio playback, music library management, and playlist operations.

## Current Status
- **Phase**: Core Implementation Complete ✅ → Refactoring Phase 🔄
- **Tests**: 90 passing tests with comprehensive coverage
- **Code Quality**: Lint-free, TypeScript strict mode
- **Platform**: iOS-only (Android removed)

## Project Structure

```
music-looper/
├── mobileapp/                    # React Native app
│   ├── src/
│   │   ├── components/           # UI components
│   │   │   ├── AudioPlayer.tsx   # Main audio player component
│   │   │   └── TrackList.tsx     # Track listing with sorting
│   │   ├── services/             # Business logic services
│   │   │   ├── audioPlayer.ts    # Audio playback management
│   │   │   ├── musicLibrary.ts   # Music library access
│   │   │   └── playlistManager.ts # Playlist CRUD operations
│   │   ├── types/                # TypeScript definitions
│   │   │   └── music.ts          # Core music-related types
│   │   ├── utils/                # Utility functions
│   │   └── screens/              # Screen components (empty - navigation pending)
│   ├── __tests__/                # Test files
│   ├── ios/                      # iOS-specific configuration
│   ├── package.json              # Dependencies and scripts
│   ├── jest.config.js            # Jest configuration
│   └── jest.setup.js             # Jest setup and mocks
├── TODO.md                       # Detailed project roadmap
└── CLAUDE.md                     # This file
```

## Key Technologies

### Core Stack
- **React Native**: 0.80.1 with TypeScript
- **Audio Playback**: react-native-track-player
- **Storage**: @react-native-async-storage/async-storage
- **Permissions**: react-native-permissions (iOS music library)
- **Navigation**: @react-navigation/native (installed, not implemented yet)

### Development Tools
- **Testing**: Jest + @testing-library/react-native
- **Linting**: ESLint with @react-native config
- **Type Checking**: TypeScript strict mode

## Important Dependencies

### Core Dependencies
- `react-native-track-player`: Audio playback engine
- `@react-native-async-storage/async-storage`: Data persistence
- `react-native-permissions`: iOS/Android permissions
- `@react-navigation/native`: Navigation framework

### Development Dependencies
- `@testing-library/react-native`: Component testing
- `@testing-library/jest-native`: Jest matchers for React Native (deprecated - using built-in)
- `typescript`: Type checking
- `eslint`: Code linting

## Current Implementation

### ✅ Completed Features
1. **Music Library Access**
   - iOS permission handling
   - Music metadata parsing
   - Search and filtering

2. **Audio Playback**
   - Play/pause/stop/skip functionality
   - Progress tracking and seeking
   - Background playback support

3. **Playlist Management**
   - Create/edit/delete playlists
   - Track reordering
   - Sorting (title, artist, album, duration)
   - AsyncStorage persistence

4. **UI Components**
   - AudioPlayer with full controls
   - TrackList with sorting capabilities
   - Reusable component architecture

5. **Testing Suite**
   - Service layer tests
   - Component tests
   - Error handling coverage
   - Mock implementations

### 🔄 Current Focus: Refactoring
Before implementing state management, the codebase needs refactoring for better maintainability:

1. **Service Architecture**
   - Extract interfaces for dependency injection
   - Implement service factory pattern
   - Improve error handling consistency

2. **Code Organization**
   - Create utility functions (time formatting, error handling)
   - Establish constants and configuration system
   - Extract custom hooks from components

3. **Component Structure**
   - Create reusable UI components
   - Implement theme system
   - Improve separation of concerns

## Development Commands

### Initial Setup
```bash
cd mobileapp
npm install
```

### iOS Setup (required for first run and after updating native dependencies)
```bash
cd mobileapp
bundle install
bundle exec pod install
```

### Development
```bash
cd mobileapp
npm start           # Start Metro bundler
npm run ios         # Run iOS app
npm run lint        # Run ESLint
npm test            # Run Jest tests
```

### Testing
```bash
cd mobileapp
npm test                    # Run all tests
npm test -- --watch        # Run tests in watch mode
npm test -- --coverage     # Run tests with coverage
```

## Important Configuration

### iOS Setup
- **Permissions**: Music library access configured in `ios/MusicLooper/Info.plist`
- **Bundle ID**: Configured for music library access
- **Background Modes**: Audio playback enabled

### Testing Setup
- **Jest Configuration**: Custom setup in `jest.config.js` and `jest.setup.js`
- **Mocks**: React Native modules mocked for testing
- **Coverage**: Comprehensive service and component testing

## Next Steps

### Immediate (Refactoring Phase)
1. **Create utilities and constants**
   - Time formatting utilities
   - Error handling system
   - App-wide constants and configuration

2. **Refactor services**
   - Extract interfaces
   - Implement dependency injection
   - Standardize error handling

3. **Extract custom hooks**
   - `useAudioPlayer` hook
   - `useMusicLibrary` hook
   - `usePlaylist` hook

### Upcoming (State Management Phase)
1. **Global State Management**
   - Choose between Redux/Zustand
   - Implement state store
   - Connect services to state

2. **Navigation Implementation**
   - Set up React Navigation
   - Create main screens
   - Implement navigation flow

## Architecture Patterns

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

### State Management
- Services use internal state with observer pattern
- Components subscribe to service state changes
- No external state management library (Redux, etc.) - planned for refactoring

### Testing (Mock-Heavy Approach)
- Service tests: Focus on business logic and state management
- Component tests: Use React Native Testing Library for UI interactions
- Type tests: Validate TypeScript interfaces and types
- Common patterns: Mock react-native-track-player, AsyncStorage

## Known Issues & Limitations

1. **Service Coupling**: Services are tightly coupled, needs dependency injection
2. **No Global State**: Components access services directly
3. **Hardcoded Styles**: No theme system implemented
4. **Limited Error UX**: Console logging only, no user-facing error handling
5. **Mock Music Data**: Uses mock tracks, needs real iOS music library integration

## Development Notes

### Code Quality Standards
- TypeScript strict mode enforced
- ESLint with React Native config
- 100% test coverage goal for services
- Component testing for critical UI elements

### iOS-Specific Considerations
- Music library permissions required
- Background audio playback considerations
- iOS-specific audio session management

### Testing Philosophy
- Service layer: Comprehensive unit testing
- Components: Rendering and interaction testing
- Integration: Limited due to React Native complexity
- Mocking: Extensive for React Native modules

## Common Development Patterns

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

### Development Workflow
1. **Service Development**: Start with service layer for business logic
2. **Component Development**: Build UI components that consume services
3. **Testing**: Write tests alongside development (not after)
4. **Type Safety**: Always define TypeScript interfaces first
5. **State Management**: Use observer pattern for real-time updates

## Future Considerations

### Performance
- Music library caching strategy
- Audio buffer management
- Background processing optimization

### User Experience
- Offline music support
- Custom playlist artwork
- Advanced sorting/filtering options

### Technical Debt
- Replace singleton pattern with DI
- Implement proper error boundaries
- Add performance monitoring
- Consider accessibility features

---

**Last Updated**: 2025-07-06  
**React Native Version**: 0.80.1  
**iOS Target**: iOS 13.0+  
**Test Coverage**: 90 tests passing