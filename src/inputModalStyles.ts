import { ViewStyle, TextStyle } from "react-native";

/**
 * Input container style wrapper
 */
export const inputContainerStyle: ViewStyle = {
	marginTop: 16,
	width: "100%",
};

/**
 * Label style for input
 */
export const inputLabelStyle: TextStyle = {
	fontSize: 14,
	fontWeight: "500",
	color: "#374151",
	marginBottom: 8,
};

/**
 * Base text input style
 */
export const baseInputStyle: ViewStyle = {
	backgroundColor: "#F9FAFB",
	borderWidth: 2,
	borderColor: "#D1D5DB",
	borderRadius: 12,
	paddingHorizontal: 16,
	paddingVertical: 14,
	minHeight: 52,
};

/**
 * Text input text style
 */
export const inputTextStyle: TextStyle = {
	fontSize: 16,
	color: "#1F2937",
	fontWeight: "400",
};

/**
 * Focused input style
 */
export const inputFocusedStyle: ViewStyle = {
	borderColor: "#3B82F6",
	backgroundColor: "#FFFFFF",
};

/**
 * Error input style
 */
export const inputErrorStyle: ViewStyle = {
	borderColor: "#EF4444",
	backgroundColor: "#FEF2F2",
};

/**
 * Error text style
 */
export const errorTextStyle: TextStyle = {
	fontSize: 13,
	color: "#EF4444",
	marginTop: 6,
	fontWeight: "500",
};

/**
 * Helper text style
 */
export const helperTextStyle: TextStyle = {
	fontSize: 13,
	color: "#6B7280",
	marginTop: 6,
};

/**
 * OTP container style
 */
export const otpContainerStyle: ViewStyle = {
	flexDirection: "row",
	justifyContent: "center",
	alignItems: "center",
	marginTop: 16,
};

/**
 * OTP box base style
 */
export const otpBoxStyle: ViewStyle = {
	justifyContent: "center",
	alignItems: "center",
	borderWidth: 2,
};

/**
 * OTP text style
 */
export const otpTextStyle: TextStyle = {
	fontWeight: "600",
	textAlign: "center",
};

/**
 * Confirmation text highlight style
 */
export const confirmationTextHighlightStyle: TextStyle = {
	fontWeight: "700",
	color: "#1F2937",
	backgroundColor: "#FEF3C7",
	paddingHorizontal: 4,
	borderRadius: 4,
};

/**
 * Match indicator styles
 */
export const matchIndicatorStyle: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	marginTop: 8,
	gap: 6,
};

export const matchTextStyle: TextStyle = {
	fontSize: 13,
	fontWeight: "500",
};

export const matchSuccessTextStyle: TextStyle = {
	...matchTextStyle,
	color: "#059669",
};

export const matchErrorTextStyle: TextStyle = {
	...matchTextStyle,
	color: "#EF4444",
};

/**
 * Character counter style
 */
export const characterCounterStyle: TextStyle = {
	fontSize: 12,
	color: "#9CA3AF",
	textAlign: "right",
	marginTop: 4,
};

export const characterCounterWarningStyle: TextStyle = {
	...characterCounterStyle,
	color: "#F59E0B",
};

export const characterCounterErrorStyle: TextStyle = {
	...characterCounterStyle,
	color: "#EF4444",
};

/**
 * Input modal specific overrides
 */
export const inputModalContainerStyle: ViewStyle = {
	paddingBottom: 20,
};

/**
 * Disabled input style
 */
export const disabledInputStyle: ViewStyle = {
	backgroundColor: "#E5E7EB",
	opacity: 0.7,
};

/**
 * Get OTP box style based on state
 */
export const getOtpBoxStyle = (
	isFocused: boolean,
	isFilled: boolean,
	hasError: boolean,
	config: {
		boxWidth: number;
		boxHeight: number;
		boxBorderRadius: number;
		activeBorderColor: string;
		inactiveBorderColor: string;
		filledBackgroundColor: string;
		emptyBackgroundColor: string;
		errorBorderColor: string;
	},
): ViewStyle => {
	let borderColor = config.inactiveBorderColor;
	let backgroundColor = config.emptyBackgroundColor;

	if (hasError) {
		borderColor = config.errorBorderColor;
	} else if (isFocused) {
		borderColor = config.activeBorderColor;
	}

	if (isFilled) {
		backgroundColor = config.filledBackgroundColor;
	}

	return {
		...otpBoxStyle,
		width: config.boxWidth,
		height: config.boxHeight,
		borderRadius: config.boxBorderRadius,
		borderColor,
		backgroundColor,
	};
};

/**
 * Input validation colors
 */
export const INPUT_VALIDATION_COLORS = {
	success: "#059669",
	error: "#EF4444",
	warning: "#F59E0B",
	info: "#3B82F6",
};
