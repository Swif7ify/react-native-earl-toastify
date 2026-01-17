# react-native-earl-toastify

A beautiful, customizable toast notification library for React Native with smooth animations, multiple toast types, and full accessibility support.

![GitHub stars](https://img.shields.io/github/stars/Swif7ify/react-native-earl-toastify?style=social)
![npm](https://img.shields.io/npm/v/react-native-earl-toastify)
![downloads](https://img.shields.io/npm/dm/react-native-earl-toastify)
![license](https://img.shields.io/npm/l/react-native-earl-toastify)

## ✨ Features

- 🎬 **6 Animation Types**: fade, slide-up, slide-down, slide-left, slide-right, none
- 🎨 **5 Toast Types**: success, warning, error, info, default + fully customizable
- 📍 **3 Positions**: top, bottom, center
- ♿ **Accessible**: WCAG 2.1 AA compliant color schemes & screen reader support
- 🎯 **Always on Top**: Toasts render above all other content
- 🔧 **Highly Configurable**: duration, dismissable, custom icons, custom styles
- 📱 **Full-Width Edge Styling**: No rounded corners for top/bottom toasts
- 🪶 **Zero Dependencies**: Uses only React Native's built-in Animated API

## 📸 Preview

<!-- Add your screenshots here -->
<!-- ![Toast Types](./assets/toast-types.png) -->
<!-- ![Animations Demo](./assets/animations.gif) -->

<table>
  <tr>
    <td align="center">
      <b>Success</b><br/>
      <img src="https://raw.githubusercontent.com/Swif7ify/react-native-earl-toastify/main/example/1.png" width="220"/>
    </td>
    <td align="center">
      <b>Warning</b><br/>
      <img src="https://raw.githubusercontent.com/Swif7ify/react-native-earl-toastify/main/example/2.png" width="220"/>
    </td>
    <td align="center">
      <b>Error</b><br/>
      <img src="https://raw.githubusercontent.com/Swif7ify/react-native-earl-toastify/main/example/3.png" width="220"/>
    </td>
  </tr>
  <tr>
    <td align="center">
      <b>Info</b><br/>
      <img src="https://raw.githubusercontent.com/Swif7ify/react-native-earl-toastify/main/example/4.png" width="220"/>
    </td>
    <td align="center">
      <b>Show</b><br/>
      <img src="https://raw.githubusercontent.com/Swif7ify/react-native-earl-toastify/main/example/5.png" width="220"/>
    </td>
    <td></td>
  </tr>
</table>


### 🎥 Demo Video
https://github.com/user-attachments/assets/0c96e622-eb7e-4074-ac0a-97a0d04a5d31



## 📦 Installation

```bash
npm install react-native-earl-toastify
# or
yarn add react-native-earl-toastify
```

## 🚀 Quick Start

### 1. Wrap your app with ToastProvider

```tsx
import { ToastProvider } from "react-native-earl-toastify";

export default function App() {
	return (
		<ToastProvider>
			<YourApp />
		</ToastProvider>
	);
}
```

### 2. Use the useToast hook

```tsx
import { useToast } from "react-native-earl-toastify";

function MyComponent() {
	const toast = useToast();

	const handleSuccess = () => {
		toast.success("Operation completed successfully!");
	};

	const handleError = () => {
		toast.error("Something went wrong");
	};

	return (
		<View>
			<Button title="Success" onPress={handleSuccess} />
			<Button title="Error" onPress={handleError} />
		</View>
	);
}
```

## 🛠️ Creating a Toast Utility (Recommended)

For easier usage across your app, create a utility file that exposes toast functions globally:

### 1. Create `utils/Toast.tsx`

```tsx
// utils/Toast.tsx
import React, { createRef } from "react";
import { ToastContextValue, ToastConfig } from "react-native-earl-toastify";

// Create a ref to hold the toast context
export const toastRef = createRef<ToastContextValue>();

// Export convenience methods
const Toast = {
	// Supports: success("message") OR success("title", "description")
	success: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => {
		toastRef.current?.success(titleOrMessage, descriptionOrConfig, config);
	},
	error: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => {
		toastRef.current?.error(titleOrMessage, descriptionOrConfig, config);
	},
	warning: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => {
		toastRef.current?.warning(titleOrMessage, descriptionOrConfig, config);
	},
	info: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => {
		toastRef.current?.info(titleOrMessage, descriptionOrConfig, config);
	},
	show: (config: ToastConfig) => {
		toastRef.current?.show(config);
	},
	hide: (id: string) => {
		toastRef.current?.hide(id);
	},
	hideAll: () => {
		toastRef.current?.hideAll();
	},
};

export default Toast;
```

### 2. Create a wrapper component `components/ToastWrapper.tsx`

```tsx
// components/ToastWrapper.tsx
import React, { useEffect } from "react";
import { useToast } from "react-native-earl-toastify";
import { toastRef } from "../utils/Toast";

export const ToastWrapper: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const toast = useToast();

	useEffect(() => {
		// Assign the toast context to the ref
		(toastRef as React.MutableRefObject<typeof toast>).current = toast;
	}, [toast]);

	return <>{children}</>;
};
```

### 3. Update your App.tsx

```tsx
// App.tsx
import { ToastProvider } from "react-native-earl-toastify";
import { ToastWrapper } from "./components/ToastWrapper";

export default function App() {
	return (
		<ToastProvider>
			<ToastWrapper>
				<YourApp />
			</ToastWrapper>
		</ToastProvider>
	);
}
```

### 4. Use anywhere in your app!

```tsx
// ANY file - no hooks needed!
import Toast from "../utils/Toast";

// Simple message (no title)
Toast.success("Data loaded successfully!");

// With title + description
Toast.success("Success!", "Data loaded successfully");
Toast.error("Error", "Failed to load data");
Toast.warning("Warning", "Please review before submitting");
Toast.info("Info", "New update available");

// With title, description, AND config
Toast.success("Uploaded!", "Your file is ready", { position: "bottom" });

// Custom toast
Toast.show({
	message: "Custom notification",
	type: "custom",
	backgroundColor: "#8B5CF6",
	textColor: "#FFFFFF",
	position: "bottom",
	animationIn: "up",
});
```

> [!TIP]
> This pattern lets you call `Toast.success()`, `Toast.error()`, etc. from **anywhere** - including utility functions, API handlers, and non-component files!

### ToastProvider Props

| Prop     | Type                  | Default | Description                         |
| -------- | --------------------- | ------- | ----------------------------------- |
| `config` | `ToastProviderConfig` | `{}`    | Global configuration for all toasts |

#### ToastProviderConfig

```typescript
interface ToastProviderConfig {
	defaultPosition?: "top" | "bottom" | "center"; // Default: 'top'
	defaultDuration?: number; // Default: 3000 (ms)
	defaultAnimationIn?: ToastAnimation; // Default: 'fade'
	defaultAnimationOut?: ToastAnimation; // Default: 'fade'
	defaultAnimationDuration?: number; // Default: 300 (ms)
	maxToasts?: number; // Default: 5
}
```

### useToast Hook

```typescript
const toast = useToast();

// Quick methods
toast.success(message: string, config?: Partial<ToastConfig>);
toast.warning(message: string, config?: Partial<ToastConfig>);
toast.error(message: string, config?: Partial<ToastConfig>);
toast.info(message: string, config?: Partial<ToastConfig>);

// Custom toast
toast.show(config: ToastConfig);

// Control methods
toast.hide(id: string);    // Hide specific toast
toast.hideAll();           // Hide all toasts
```

### ToastConfig

| Option              | Type                                                                   | Default      | Description                                   |
| ------------------- | ---------------------------------------------------------------------- | ------------ | --------------------------------------------- |
| `message`           | `string`                                                               | **required** | Toast message                                 |
| `type`              | `'success' \| 'warning' \| 'error' \| 'info' \| 'default' \| 'custom'` | `'default'`  | Toast type                                    |
| `position`          | `'top' \| 'bottom' \| 'center'`                                        | `'top'`      | Screen position                               |
| `duration`          | `number`                                                               | `3000`       | Auto-dismiss time in ms (0 = no auto-dismiss) |
| `animationIn`       | `ToastAnimation`                                                       | `'fade'`     | Enter animation                               |
| `animationOut`      | `ToastAnimation`                                                       | `'fade'`     | Exit animation                                |
| `animationDuration` | `number`                                                               | `300`        | Animation duration in ms                      |
| `dismissable`       | `boolean`                                                              | `true`       | Can dismiss by tapping                        |
| `icon`              | `ReactNode`                                                            | -            | Custom icon element                           |
| `hideIcon`          | `boolean`                                                              | `false`      | Hide the icon                                 |
| `backgroundColor`   | `string`                                                               | -            | Custom background color                       |
| `textColor`         | `string`                                                               | -            | Custom text color                             |
| `borderColor`       | `string`                                                               | -            | Custom border color                           |
| `style`             | `ViewStyle`                                                            | -            | Custom container style                        |
| `textStyle`         | `TextStyle`                                                            | -            | Custom text style                             |
| `onShow`            | `() => void`                                                           | -            | Callback when shown                           |
| `onHide`            | `() => void`                                                           | -            | Callback when hidden                          |
| `onPress`           | `() => void`                                                           | -            | Callback when pressed                         |

### Animation Types

```typescript
type ToastAnimation = "fade" | "up" | "down" | "left" | "right" | "none";
```

| Animation | Description              |
| --------- | ------------------------ |
| `fade`    | Fade in/out              |
| `up`      | Slide from bottom        |
| `down`    | Slide from top           |
| `left`    | Slide from right         |
| `right`   | Slide from left          |
| `none`    | Instant appear/disappear |

## 🎨 Examples

### Custom Styled Toast

```tsx
toast.show({
	message: "Custom purple toast!",
	type: "custom",
	backgroundColor: "#8B5CF6",
	textColor: "#FFFFFF",
	borderColor: "#7C3AED",
	position: "bottom",
	animationIn: "up",
	animationOut: "down",
});
```

### With Custom Icon (react-native-lucide)

```tsx
import { CheckCircle } from "lucide-react-native";

toast.success("Saved!", {
	icon: <CheckCircle color="#10B981" size={20} />,
});
```

### Non-Dismissable with Long Duration

```tsx
toast.info("Please wait...", {
	dismissable: false,
	duration: 0, // Won't auto-dismiss
});

// Later, dismiss programmatically
const id = toast.info("Loading...", { dismissable: false, duration: 0 });
// ... after loading complete
toast.hide(id);
```

### Centered Toast with Callback

```tsx
toast.warning("Session expiring soon", {
	position: "center",
	duration: 5000,
	onPress: () => {
		// Handle press - e.g., refresh session
		refreshSession();
	},
	onHide: () => {
		console.log("Toast dismissed");
	},
});
```

### Different Animations

```tsx
// Slide from bottom
toast.success("Uploaded!", {
	position: "bottom",
	animationIn: "up",
	animationOut: "down",
});

// Slide from side
toast.info("New message", {
	animationIn: "right",
	animationOut: "left",
});

// Instant (no animation)
toast.error("Error!", {
	animationIn: "none",
	animationOut: "none",
});
```

## 🎯 Positioning Behavior

| Position | Behavior                                                    |
| -------- | ----------------------------------------------------------- |
| `top`    | Full-width, no rounded corners, accounts for status bar     |
| `bottom` | Full-width, no rounded corners, accounts for home indicator |
| `center` | Centered with margins and rounded corners                   |

## 🎨 Default Color Schemes

| Type    | Background | Text      | Border    |
| ------- | ---------- | --------- | --------- |
| Success | `#ECFDF5`  | `#065F46` | `#10B981` |
| Warning | `#FFFBEB`  | `#92400E` | `#F59E0B` |
| Error   | `#FEF2F2`  | `#991B1B` | `#EF4444` |
| Info    | `#EFF6FF`  | `#1E40AF` | `#3B82F6` |
| Default | `#F9FAFB`  | `#374151` | `#D1D5DB` |

All color combinations meet **WCAG 2.1 AA** contrast requirements (4.5:1 minimum).

## ♿ Accessibility

- All toasts are announced to screen readers via `AccessibilityInfo.announceForAccessibility`
- Proper `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"` attributes
- Dismissable toasts have clear accessibility hints
- Color contrasts meet WCAG 2.1 AA standards

## 📄 License

MIT © Earl
