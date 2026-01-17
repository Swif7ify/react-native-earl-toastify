import { ReactNode } from "react";
import { ViewStyle, TextStyle } from "react-native";

/**
 * Toast type determines the color scheme and default icon
 */
export type ToastType =
	| "success"
	| "warning"
	| "error"
	| "default"
	| "info"
	| "custom";

/**
 * Animation type for toast enter/exit
 */
export type ToastAnimation = "fade" | "up" | "down" | "left" | "right" | "none";

/**
 * Position of the toast on screen
 */
export type ToastPosition = "top" | "bottom" | "center";

/**
 * Configuration options for a toast notification
 */
export interface ToastConfig {
	/** Title to display in the toast (primary text, larger) */
	title?: string;

	/** Message/description to display in the toast (secondary text, smaller) */
	message: string;

	/** Type of toast - determines color scheme */
	type?: ToastType;

	/** Position on screen */
	position?: ToastPosition;

	/** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
	duration?: number;

	/** Animation type for entering */
	animationIn?: ToastAnimation;

	/** Animation type for exiting */
	animationOut?: ToastAnimation;

	/** Animation duration in milliseconds */
	animationDuration?: number;

	/** Whether toast can be dismissed by tapping */
	dismissable?: boolean;

	/** Custom icon element (e.g., from react-native-lucide) */
	icon?: ReactNode;

	/** Hide the default icon */
	hideIcon?: boolean;

	/** Custom background color (for 'custom' type) */
	backgroundColor?: string;

	/** Custom text color (for 'custom' type) */
	textColor?: string;

	/** Custom border color (for 'custom' type) */
	borderColor?: string;

	/** Custom container style */
	style?: ViewStyle;

	/** Custom text style */
	textStyle?: TextStyle;

	/** Callback when toast is shown */
	onShow?: () => void;

	/** Callback when toast is hidden */
	onHide?: () => void;

	/** Callback when toast is pressed */
	onPress?: () => void;
}

/**
 * Internal toast data with unique ID
 */
export interface Toast extends ToastConfig {
	id: string;
}

/**
 * Toast context value for useToast hook
 */
export interface ToastContextValue {
	/** Show a toast with configuration */
	show: (config: ToastConfig) => string;

	/** Show a success toast - can be (message) or (title, description) */
	success: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => string;

	/** Show a warning toast - can be (message) or (title, description) */
	warning: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => string;

	/** Show an error toast - can be (message) or (title, description) */
	error: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => string;

	/** Show an info toast - can be (message) or (title, description) */
	info: (
		titleOrMessage: string,
		descriptionOrConfig?: string | Partial<ToastConfig>,
		config?: Partial<ToastConfig>,
	) => string;

	/** Hide a specific toast by ID */
	hide: (id: string) => void;

	/** Hide all toasts */
	hideAll: () => void;
}

/**
 * Global configuration for ToastProvider
 */
export interface ToastProviderConfig {
	/** Default position for all toasts */
	defaultPosition?: ToastPosition;

	/** Default duration for all toasts */
	defaultDuration?: number;

	/** Default animation in */
	defaultAnimationIn?: ToastAnimation;

	/** Default animation out */
	defaultAnimationOut?: ToastAnimation;

	/** Default animation duration */
	defaultAnimationDuration?: number;

	/** Maximum number of toasts visible at once */
	maxToasts?: number;
}
