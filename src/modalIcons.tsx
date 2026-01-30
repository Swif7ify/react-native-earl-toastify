import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { ModalType } from "./modalTypes";

interface ModalIconProps {
	color: string;
	size: number;
}

/**
 * Confirmation/Check icon for confirm modals
 */
const ConfirmIcon: React.FC<ModalIconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{
				width: size,
				height: size,
				borderColor: color,
				backgroundColor: `${color}15`,
			},
		]}
	>
		<Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>
			✓
		</Text>
	</View>
);

/**
 * Warning icon for warning modals
 */
const WarningIcon: React.FC<ModalIconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{
				width: size,
				height: size,
				borderColor: color,
				backgroundColor: `${color}15`,
			},
		]}
	>
		<Text
			style={[
				styles.iconText,
				{ color, fontSize: size * 0.5, fontWeight: "700" },
			]}
		>
			!
		</Text>
	</View>
);

/**
 * Danger/X icon for danger modals
 */
const DangerIcon: React.FC<ModalIconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{
				width: size,
				height: size,
				borderColor: color,
				backgroundColor: `${color}15`,
			},
		]}
	>
		<Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>
			✕
		</Text>
	</View>
);

/**
 * Info icon for info modals
 */
const InfoIcon: React.FC<ModalIconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{
				width: size,
				height: size,
				borderColor: color,
				backgroundColor: `${color}15`,
			},
		]}
	>
		<Text
			style={[
				styles.iconText,
				{
					color,
					fontSize: size * 0.45,
					fontWeight: "600",
					fontStyle: "italic",
				},
			]}
		>
			i
		</Text>
	</View>
);

/**
 * Default icon for custom modals
 */
const CustomIcon: React.FC<ModalIconProps> = ({ color, size }) => (
	<View
		style={[
			styles.iconCircle,
			{
				width: size,
				height: size,
				borderColor: color,
				backgroundColor: `${color}15`,
			},
		]}
	>
		<Text style={[styles.iconText, { color, fontSize: size * 0.4 }]}>
			?
		</Text>
	</View>
);

/**
 * Default icons for each modal type
 */
export const ModalIcons: Record<ModalType, React.FC<ModalIconProps>> = {
	confirm: ConfirmIcon,
	warning: WarningIcon,
	danger: DangerIcon,
	info: InfoIcon,
	custom: CustomIcon,
};

const styles = StyleSheet.create({
	iconCircle: {
		borderWidth: 3,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
	},
	iconText: {
		textAlign: "center",
		includeFontPadding: false,
		textAlignVertical: "center",
	},
});
