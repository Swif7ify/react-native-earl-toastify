import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ToastType } from "./types";

interface IconProps {
	color: string;
	size: number;
}

/**
 * Simple SVG-like icons using View and Text components
 * These are minimal default icons - users can replace with any icon library
 */

const SuccessIcon: React.FC<IconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{ width: size, height: size, borderColor: color },
		]}
	>
		<Text style={[styles.iconText, { color, fontSize: size * 0.6 }]}>
			✓
		</Text>
	</View>
);

const WarningIcon: React.FC<IconProps> = ({ color, size }) => (
	<View style={[styles.iconTriangle, { borderBottomColor: color }]}>
		<Text style={[styles.warningText, { fontSize: size * 0.5 }]}>!</Text>
	</View>
);

const ErrorIcon: React.FC<IconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{
				width: size,
				height: size,
				borderColor: color,
				backgroundColor: color,
			},
		]}
	>
		<Text
			style={[
				styles.iconText,
				{ color: "#FFFFFF", fontSize: size * 0.6 },
			]}
		>
			✕
		</Text>
	</View>
);

const InfoIcon: React.FC<IconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{ width: size, height: size, borderColor: color },
		]}
	>
		<Text
			style={[
				styles.iconText,
				{ color, fontSize: size * 0.6, fontWeight: "bold" },
			]}
		>
			i
		</Text>
	</View>
);

const DefaultIcon: React.FC<IconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{ width: size, height: size, borderColor: color },
		]}
	>
		<Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>
			●
		</Text>
	</View>
);

const CloseIcon: React.FC<IconProps> = ({ color, size }) => (
	<View
		style={{
			width: size,
			height: size,
			alignItems: "center",
			justifyContent: "center",
		}}
	>
		<Text
			style={{
				color,
				fontSize: size,
				lineHeight: size,
				fontWeight: "300",
			}}
		>
			×
		</Text>
	</View>
);

/**
 * Default icons for each toast type
 */
export const DefaultIcons: Record<ToastType | "close", React.FC<IconProps>> = {
	success: SuccessIcon,
	warning: WarningIcon,
	error: ErrorIcon,
	info: InfoIcon,
	default: DefaultIcon,
	custom: DefaultIcon,
	close: CloseIcon,
};

const styles = StyleSheet.create({
	iconCircle: {
		borderWidth: 2,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
	},
	iconText: {
		textAlign: "center",
		includeFontPadding: false,
		textAlignVertical: "center",
	},
	iconTriangle: {
		width: 0,
		height: 0,
		borderLeftWidth: 10,
		borderRightWidth: 10,
		borderBottomWidth: 18,
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
		alignItems: "center",
		justifyContent: "flex-end",
	},
	warningText: {
		color: "#FFFFFF",
		fontWeight: "bold",
		position: "absolute",
		bottom: -16,
	},
});
