import React from "react";
import {
	View,
	StyleSheet,
	SafeAreaView,
	Platform,
	StatusBar,
} from "react-native";
import { Toast as ToastData, ToastPosition } from "./types";
import { Toast } from "./Toast";
import { getContainerStyle, getSafeAreaPadding } from "./styles";

export interface ToastContainerProps {
	toasts: ToastData[];
	position: ToastPosition;
	onHide: (id: string) => void;
}

/**
 * Container component that positions and renders toasts
 * Handles safe area insets for top/bottom positioning
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
	toasts,
	position,
	onHide,
}) => {
	if (toasts.length === 0) return null;

	const containerStyle = getContainerStyle(position);
	const safeAreaPadding = getSafeAreaPadding(position);

	// Filter toasts for this position
	const positionedToasts = toasts.filter(
		(toast) => (toast.position || "top") === position,
	);

	if (positionedToasts.length === 0) return null;

	return (
		<View
			style={[styles.container, containerStyle]}
			pointerEvents="box-none"
		>
			<View
				style={[styles.innerContainer, safeAreaPadding]}
				pointerEvents="box-none"
			>
				{positionedToasts.map((toast, index) => (
					<View
						key={toast.id}
						style={index > 0 ? styles.toastGap : undefined}
					>
						<Toast
							toast={toast}
							position={position}
							onHide={onHide}
						/>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		zIndex: 9999,
		elevation: 9999,
		pointerEvents: "box-none",
	},
	innerContainer: {
		pointerEvents: "box-none",
	},
	toastGap: {
		marginTop: 8,
	},
});
