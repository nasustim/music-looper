# Music Looper - Development TODO

## Project Overview
A React Native music player app for iOS that accesses the device's music library and allows users to play and reorder songs for language learning purposes.

## Development Status: Planning Complete ✅

---

## Phase 1: Project Setup & Foundation
- [ ] **Initialize React Native Project**
  - Create new React Native project with TypeScript
  - Configure Metro bundler and build tools
  - Set up folder structure (`src/`, `components/`, `screens/`, `services/`, `types/`)

- [ ] **iOS Configuration**
  - Configure `Info.plist` for music library permissions
  - Add `NSAppleMusicUsageDescription` permission
  - Set up iOS build configuration

## Phase 2: Core Dependencies
- [ ] **Install Essential Libraries**
  - `react-native-track-player` - Audio playback
  - `@react-native-async-storage/async-storage` - Local storage
  - `react-native-permissions` - Permission handling
  - Navigation library (`@react-navigation/native`)

## Phase 3: Music Library Access
- [ ] **Implement Music Library Service**
  - Create service to fetch device music library
  - Handle permission requests
  - Parse music metadata (title, artist, album, duration)
  - Implement search and filtering

## Phase 4: Audio Player Core
- [ ] **Audio Playback Engine**
  - Initialize track player service
  - Implement play/pause/stop/skip functions
  - Handle background playback
  - Add progress tracking

## Phase 5: Playlist Management
- [ ] **Sorting & Queue System**
  - Create playlist data structure
  - Implement drag-and-drop reordering
  - Add sorting options (title, artist, album, duration)
  - Save/load custom playlists

## Phase 6: User Interface
- [ ] **Screen Components**
  - Music library browser screen
  - Now playing screen with controls
  - Playlist management screen
  - Settings screen

- [ ] **UI Components**
  - Music item list component
  - Player controls component
  - Progress bar component
  - Sortable list component

## Phase 7: State Management
- [ ] **App State Architecture**
  - Set up Redux/Zustand for global state
  - Manage current track, playlist, and playback state
  - Handle background state persistence

## Phase 8: Testing & Polish
- [ ] **Testing & Optimization**
  - Unit tests for core functions
  - Integration tests for music playback
  - Performance optimization
  - iOS device testing

---

## Current Priority Tasks
1. Set up React Native project structure with TypeScript
2. Configure iOS permissions for music library access
3. Implement music library access functionality
4. Create audio player component with playback controls

## Notes
- Focus on iOS platform first
- Prioritize core playback functionality
- Ensure smooth user experience for language learning use case