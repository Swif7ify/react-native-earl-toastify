import { ReactNode } from "react";
import { ViewStyle, TextStyle, KeyboardTypeOptions } from "react-native";
import { ModalType, ModalAnimation } from "./modalTypes";

/**
 * Input mode determines the input field type and behavior
 * - "text": Standard text input field
 * - "otp": Separate boxes for OTP/verification codes
 * - "pin": Similar to OTP but typically for PINs (masked by default)
 */
export type InputMode = "text" | "otp" | "pin";

/**
 * Input restrictions for validation and input control
 */
export interface InputRestrictions {
	/** Only allow letters (a-zA-Z) */
	lettersOnly?: boolean;

	/** Only allow numbers (0-9) */
	numbersOnly?: boolean;

	/** Only allow alphanumeric characters (a-zA-Z0-9) */
	alphanumericOnly?: boolean;

	/** Disable copy/paste functionality */
	disableCopyPaste?: boolean;

	/** Force uppercase input */
	uppercase?: boolean;

	/** Force lowercase input */
	lowercase?: boolean;

	/** Minimum character length */
	minLength?: number;

	/** Maximum character length */
	maxLength?: number;

	/** Custom regex pattern for validation */
	pattern?: RegExp;

	/** Custom error message when pattern doesn't match */
	patternError?: string;

	/** Required confirmation text (user must type exactly this) */
	confirmationText?: string;

	/** Case-sensitive confirmation text matching (default: true) */
	caseSensitive?: boolean;

	/** Allow whitespace in input (default: true for text, false for otp/pin) */
	allowWhitespace?: boolean;

	/** Trim whitespace from input value on submit */
	trimOnSubmit?: boolean;
}

/**
 * OTP/PIN input specific configuration
 */
export interface OtpConfig {
	/** Number of input boxes (default: 6) */
	length?: number;

	/** Mask input with dots (like password) */
	masked?: boolean;

	/** Auto-submit when all boxes are filled */
	autoSubmit?: boolean;

	/** Input box width (default: 48) */
	boxWidth?: number;

	/** Input box height (default: 56) */
	boxHeight?: number;

	/** Gap between boxes (default: 12) */
	boxGap?: number;

	/** Box border radius (default: 12) */
	boxBorderRadius?: number;

	/** Active/focused box border color */
	activeBorderColor?: string;

	/** Inactive box border color */
	inactiveBorderColor?: string;

	/** Filled box background color */
	filledBackgroundColor?: string;

	/** Empty box background color */
	emptyBackgroundColor?: string;

	/** Error state border color */
	errorBorderColor?: string;

	/** Text color inside boxes */
	textColor?: string;

	/** Font size inside boxes */
	fontSize?: number;
}

/**
 * Configuration options for an input modal
 */
export interface InputModalConfig {
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

	/** Callback when confirm button is pressed (receives input value) */
	onConfirm?: (value: string) => void;

	/** Callback when cancel button is pressed */
	onCancel?: () => void;

	/** Whether to show cancel button (default: true) */
	showCancel?: boolean;

	/** Whether tapping the backdrop dismisses the modal (default: false for input modals) */
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

	// ============ Input Specific Properties ============

	/** Input mode: text, otp, or pin */
	inputMode?: InputMode;

	/** Placeholder text for text input */
	placeholder?: string;

	/** Default value for the input */
	defaultValue?: string;

	/** Input restrictions and validation rules */
	restrictions?: InputRestrictions;

	/** OTP/PIN specific configuration */
	otpConfig?: OtpConfig;

	/** Validate input on every change (default: false) */
	validateOnChange?: boolean;

	/** Custom validator function - returns error message or null if valid */
	customValidator?: (value: string) => string | null;

	/** Label text shown above the input */
	inputLabel?: string;

	/** Helper text shown below the input */
	helperText?: string;

	// ============ Keyboard Configuration ============

	/** Keyboard type for the input */
	keyboardType?: KeyboardTypeOptions;

	/** Auto-capitalize behavior */
	autoCapitalize?: "none" | "sentences" | "words" | "characters";

	/** Mask input as password (for text mode) */
	secureTextEntry?: boolean;

	/** Auto-focus input when modal opens (default: true) */
	autoFocus?: boolean;

	/** Return key type */
	returnKeyType?: "done" | "go" | "next" | "search" | "send";

	// ============ Styling ============

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

	/** Custom input container style */
	inputContainerStyle?: ViewStyle;

	/** Custom input text style */
	inputStyle?: TextStyle;

	/** Custom error text style */
	errorStyle?: TextStyle;

	/** Custom label text style */
	labelStyle?: TextStyle;

	/** Custom helper text style */
	helperStyle?: TextStyle;

	/** Custom confirm button style */
	confirmButtonStyle?: ViewStyle;

	/** Custom cancel button style */
	cancelButtonStyle?: ViewStyle;

	/** Accessibility label for the modal */
	accessibilityLabel?: string;

	/** Accessibility hint for the input */
	inputAccessibilityHint?: string;

	/** Whether the modal has rounded corners (default: false for full-width look) */
	rounded?: boolean;
}

/**
 * Input modal result returned when modal is dismissed
 */
export interface InputModalResult {
	/** Whether the user confirmed (true) or cancelled (false) */
	confirmed: boolean;

	/** The input value (empty string if cancelled) */
	value: string;
}

/**
 * Internal input modal data with unique ID and promise resolver
 */
export interface InputModal extends InputModalConfig {
	id: string;
	resolve: (result: InputModalResult) => void;
}

/**
 * Default OTP configuration
 */
export const DEFAULT_OTP_CONFIG: Required<OtpConfig> = {
	length: 6,
	masked: false,
	autoSubmit: false,
	boxWidth: 48,
	boxHeight: 56,
	boxGap: 12,
	boxBorderRadius: 12,
	activeBorderColor: "#3B82F6",
	inactiveBorderColor: "#D1D5DB",
	filledBackgroundColor: "#F3F4F6",
	emptyBackgroundColor: "#FFFFFF",
	errorBorderColor: "#EF4444",
	textColor: "#1F2937",
	fontSize: 24,
};

/**
 * Default PIN configuration (masked by default)
 */
export const DEFAULT_PIN_CONFIG: Required<OtpConfig> = {
	...DEFAULT_OTP_CONFIG,
	length: 4,
	masked: true,
};
