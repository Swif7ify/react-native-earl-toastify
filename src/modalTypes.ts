import { ReactNode } from "react";
import { ViewStyle, TextStyle } from "react-native";
import { InputModalConfig, InputModalResult } from "./inputModalTypes";

/**
 * Modal type determines the color scheme and default icon
 */
export type ModalType = "confirm" | "warning" | "danger" | "info" | "custom";

/**
 * Animation type for modal enter/exit
 */
export type ModalAnimation = "fade" | "scale" | "slide" | "none";

/**
 * Configuration options for a confirmation modal
 */
export interface ModalConfig {
	/** Title displayed at the top of the modal */
	title: string;

	/** Message/description displayed in the modal body */
	message: string;

	/** Type of modal - determines color scheme and icon */
	type?: ModalType;

	/** Text for the confirm button */
	confirmText?: string;

	/** Text for the cancel button */
	cancelText?: string;

	/** Callback when confirm button is pressed */
	onConfirm?: () => void;

	/** Callback when cancel button is pressed */
	onCancel?: () => void;

	/** Whether to show cancel button (default: true) */
	showCancel?: boolean;

	/** Whether tapping the backdrop dismisses the modal (default: true) */
	dismissOnBackdrop?: boolean;

	/** Animation type for entering */
	animationIn?: ModalAnimation;

	/** Animation type for exiting */
	animationOut?: ModalAnimation;

	/** Animation duration in milliseconds */
	animationDuration?: number;

	/** Custom icon element */
	icon?: ReactNode;

	/** Hide the default icon */
	hideIcon?: boolean;

	/** Custom background color for modal */
	backgroundColor?: string;

	/** Custom text color */
	textColor?: string;

	/** Custom confirm button background color */
	confirmButtonColor?: string;

	/** Custom confirm button text color */
	confirmButtonTextColor?: string;

	/** Custom cancel button background color */
	cancelButtonColor?: string;

	/** Custom cancel button text color */
	cancelButtonTextColor?: string;

	/** Custom container style for the modal */
	style?: ViewStyle;

	/** Custom title text style */
	titleStyle?: TextStyle;

	/** Custom message text style */
	messageStyle?: TextStyle;

	/** Custom confirm button style */
	confirmButtonStyle?: ViewStyle;

	/** Custom cancel button style */
	cancelButtonStyle?: ViewStyle;

	/** Accessibility label for the modal (defaults to title + message) */
	accessibilityLabel?: string;
}

/**
 * Internal modal data with unique ID and promise resolver
 */
export interface Modal extends ModalConfig {
	id: string;
	resolve: (confirmed: boolean) => void;
}

/**
 * Modal context value for useModal hook
 */
export interface ModalContextValue {
	/** Show a modal with configuration - returns Promise<boolean> */
	show: (config: ModalConfig) => Promise<boolean>;

	/** Show a confirmation modal */
	confirm: (
		titleOrMessage: string,
		messageOrConfig?: string | Partial<ModalConfig>,
		config?: Partial<ModalConfig>,
	) => Promise<boolean>;

	/** Show a warning modal */
	warning: (
		titleOrMessage: string,
		messageOrConfig?: string | Partial<ModalConfig>,
		config?: Partial<ModalConfig>,
	) => Promise<boolean>;

	/** Show a danger modal (destructive action confirmation) */
	danger: (
		titleOrMessage: string,
		messageOrConfig?: string | Partial<ModalConfig>,
		config?: Partial<ModalConfig>,
	) => Promise<boolean>;

	/** Show an info modal */
	info: (
		titleOrMessage: string,
		messageOrConfig?: string | Partial<ModalConfig>,
		config?: Partial<ModalConfig>,
	) => Promise<boolean>;

	/** Hide the current modal (resolves as cancelled) */
	hide: () => void;

	// ============ Input Modal Methods ============

	/** Show an input modal - returns Promise<InputModalResult> */
	input: (config: InputModalConfig) => Promise<InputModalResult>;

	/**
	 * Show a confirmation text input modal
	 * User must type the exact confirmation text to proceed
	 */
	confirmWithText: (
		title: string,
		message: string,
		confirmationText: string,
		config?: Partial<InputModalConfig>,
	) => Promise<InputModalResult>;

	/**
	 * Show an OTP/verification code input modal
	 * Returns the entered code in the result value
	 */
	otp: (
		title: string,
		message: string,
		config?: Partial<InputModalConfig>,
	) => Promise<InputModalResult>;

	/**
	 * Show a PIN input modal (masked by default)
	 * Returns the entered PIN in the result value
	 */
	pin: (
		title: string,
		message: string,
		config?: Partial<InputModalConfig>,
	) => Promise<InputModalResult>;
}

/**
 * Global configuration for ModalProvider
 */
export interface ModalProviderConfig {
	/** Default animation in */
	defaultAnimationIn?: ModalAnimation;

	/** Default animation out */
	defaultAnimationOut?: ModalAnimation;

	/** Default animation duration */
	defaultAnimationDuration?: number;

	/** Default confirm button text */
	defaultConfirmText?: string;

	/** Default cancel button text */
	defaultCancelText?: string;

	/** Whether backdrop dismisses modal by default */
	defaultDismissOnBackdrop?: boolean;
}
