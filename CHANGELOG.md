# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-01-17

### Fixed

- 🔇 **New Architecture Compatibility**: Silenced `setLayoutAnimationEnabledExperimental` warning on React Native's New Architecture (Fabric)
    - LayoutAnimation is enabled by default in Fabric, so the experimental call is no longer needed
    - Added try-catch to gracefully handle both old and new architectures

---

## [1.0.4] - 2026-01-17

### Changed

- 🔧 **Safe Area Handling**: Migrated from hardcoded padding values to `react-native-safe-area-context` for proper safe area handling across all devices
    - No more magic numbers (50px for status bar, 34px for home indicator)
    - Uses `SafeAreaView` with dynamic edge detection for top/bottom positioned toasts
    - Proper support for devices with notches, dynamic islands, and various home indicator sizes

### Added

- 📦 **New Peer Dependency**: `react-native-safe-area-context` (>=3.0.0) is now required
    - Users must wrap their app with `SafeAreaProvider` for toasts to work correctly
    - Updated README with installation and setup instructions

---

## [1.0.3] - 2026-01-17

### Added

- ✨ **Updated README.md**: Updated ToastWrapper.tsx and Toast.tsx examples to use the new setToastContext method

---

## [1.0.2] - 2026-01-17

### Added

- ✨ **Example Images & Video**: Added example images and video for better documentation

---

## [1.0.1] - 2026-01-17

### Added

- ✨ **Smooth Layout Animations**: Remaining toasts now slide smoothly when one is dismissed
    - Uses React Native's LayoutAnimation with easeInEaseOut timing (200ms)
    - Enabled for both iOS and Android platforms
    - No more jumpy transitions when multiple toasts are stacked

---

## [1.0.0] - 2026-01-17

### Added

- 🎉 Initial release of react-native-earl-toastify

#### Toast Types

- `success` - Green themed toast for successful operations
- `warning` - Amber themed toast for warnings
- `error` - Red themed toast for errors
- `info` - Blue themed toast for informational messages
- `default` - Gray themed neutral toast
- `custom` - Fully customizable toast with custom colors

#### Animations

- `fade` - Smooth opacity fade in/out
- `up` - Slide up animation (from bottom for bottom position, to top for top position)
- `down` - Slide down animation (from top for top position, to bottom for bottom position)
- `left` - Slide from right to left
- `right` - Slide from left to right
- `none` - Instant appear/disappear without animation

#### Positioning

- `top` - Full-width positioning at top of screen with status bar padding
- `bottom` - Full-width positioning at bottom with home indicator padding
- `center` - Centered positioning with rounded corners and margins

#### Configuration Options

- `title` - Optional title (larger, bolder text displayed above the message)
- `message` - Main text or description (smaller when title is present)
- Flexible API: `toast.success("message")` OR `toast.success("title", "description")`
- `duration` - Auto-dismiss duration in milliseconds (0 for no auto-dismiss)
- `dismissable` - Toggle tap-to-dismiss functionality
- `icon` - Custom icon support (works with any icon library like lucide-react-native)
- `hideIcon` - Option to hide default icons
- `backgroundColor`, `textColor`, `borderColor` - Custom color overrides
- `style`, `textStyle` - Custom style overrides
- `onShow`, `onHide`, `onPress` - Event callbacks

#### Accessibility

- WCAG 2.1 AA compliant color schemes (4.5:1 contrast ratio)
- Screen reader announcements via AccessibilityInfo
- Proper accessibility roles and live regions
- Clear accessibility hints for dismissable toasts

#### API

- `ToastProvider` - Context provider component
- `useToast` - Hook for showing toasts with `success()`, `warning()`, `error()`, `info()`, `show()`
- `hide(id)` - Hide specific toast by ID
- `hideAll()` - Hide all visible toasts
- Full TypeScript support with exported types

#### Global Toast Utility Pattern

- Documented pattern for creating a global Toast utility
- Supports calling `Toast.success()`, `Toast.error()` etc. from anywhere in your app
- Customizable defaults for colors, animations, icons per toast type
- No deprecated APIs - uses simple variable-based context storage
