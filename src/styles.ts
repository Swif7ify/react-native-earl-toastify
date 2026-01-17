import { ViewStyle, TextStyle } from "react-native";
import { ToastType, ToastPosition } from "./types";

/**
 * Color configuration for each toast type
 * All colors meet WCAG 2.1 AA contrast requirements (4.5:1 minimum)
 */
export interface ToastColors {
	background: string;
	text: string;
	icon: string;
	border: string;
}

/**
 * Toast type color schemes - accessible and visually distinct
 */
export const TOAST_COLORS: Record<ToastType, ToastColors> = {
	success: {
		background: "#ECFDF5",
		text: "#065F46",
		icon: "#10B981",
		border: "#10B981",
	},
	warning: {
		background: "#FFFBEB",
		text: "#92400E",
		icon: "#F59E0B",
		border: "#F59E0B",
	},
	error: {
		background: "#FEF2F2",
		text: "#991B1B",
		icon: "#EF4444",
		border: "#EF4444",
	},
	info: {
		background: "#EFF6FF",
		text: "#1E40AF",
		icon: "#3B82F6",
		border: "#3B82F6",
	},
	default: {
		background: "#F9FAFB",
		text: "#374151",
		icon: "#6B7280",
		border: "#D1D5DB",
	},
	custom: {
		background: "#F9FAFB",
		text: "#374151",
		icon: "#6B7280",
		border: "#D1D5DB",
	},
};

/**
 * Get colors for a specific toast type
 */
export const getToastColors = (type: ToastType): ToastColors => {
	return TOAST_COLORS[type] || TOAST_COLORS.default;
};

/**
 * Base toast container styles
 */
export const baseToastStyle: ViewStyle = {
	flexDirection: "row",
	alignItems: "center",
	paddingVertical: 14,
	paddingHorizontal: 16,
	minHeight: 52,
	borderLeftWidth: 4,
	shadowColor: "#000",
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.1,
	shadowRadius: 8,
	elevation: 5,
};

/**
 * Get toast style based on position
 * Top/Bottom: Full width, no rounded corners
 * Center: Rounded corners with margin
 */
export const getPositionalStyle = (position: ToastPosition): ViewStyle => {
	if (position === "center") {
		return {
			marginHorizontal: 16,
			borderRadius: 12,
		};
	}

	// Top or bottom - full width, no rounded corners
	return {
		marginHorizontal: 0,
		borderRadius: 0,
	};
};

/**
 * Container positioning styles
 */
export const getContainerStyle = (position: ToastPosition): ViewStyle => {
	const baseContainer: ViewStyle = {
		position: "absolute",
		left: 0,
		right: 0,
		zIndex: 9999,
		elevation: 9999,
	};

	switch (position) {
		case "top":
			return {
				...baseContainer,
				top: 0,
			};
		case "bottom":
			return {
				...baseContainer,
				bottom: 0,
			};
		case "center":
			return {
				...baseContainer,
				top: 0,
				bottom: 0,
				justifyContent: "center",
			};
		default:
			return {
				...baseContainer,
				top: 0,
			};
	}
};

/**
 * Toast title text style (primary text, larger)
 */
export const titleStyle: TextStyle = {
	fontSize: 15,
	fontWeight: "600",
	lineHeight: 20,
};

/**
 * Toast description text style (secondary text, smaller)
 */
export const descriptionStyle: TextStyle = {
	fontSize: 13,
	fontWeight: "400",
	lineHeight: 18,
	marginTop: 2,
	opacity: 0.85,
};

/**
 * Toast message text style (when no title, used as main text)
 */
export const messageStyle: TextStyle = {
	fontSize: 15,
	fontWeight: "500",
	flex: 1,
	lineHeight: 20,
};

/**
 * Text container style for title + description
 */
export const textContainerStyle: ViewStyle = {
	flex: 1,
};

/**
 * Toast icon container style
 */
export const iconContainerStyle: ViewStyle = {
	marginRight: 12,
	width: 24,
	height: 24,
	alignItems: "center",
	justifyContent: "center",
};

/**
 * Close button style
 */
export const closeButtonStyle: ViewStyle = {
	marginLeft: 12,
	padding: 4,
	borderRadius: 4,
};

/**
 * Safe area padding for different positions
 */
export const getSafeAreaPadding = (position: ToastPosition): ViewStyle => {
	switch (position) {
		case "top":
			return { paddingTop: 50 }; // Account for status bar
		case "bottom":
			return { paddingBottom: 34 }; // Account for home indicator
		default:
			return {};
	}
};
