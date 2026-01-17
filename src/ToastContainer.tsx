import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Toast as ToastData, ToastPosition } from "./types";
import { Toast } from "./Toast";

export interface ToastContainerProps {
	toasts: ToastData[];
	position: ToastPosition;
	onHide: (id: string) => void;
}

/**
 * Container component that positions and renders toasts
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({
	toasts,
	position,
	onHide,
}) => {
	// Filter toasts for this position
	const positionedToasts = useMemo(() => {
		return toasts.filter((toast) => (toast.position || "top") === position);
	}, [toasts, position]);

	if (positionedToasts.length === 0) return null;

	// Get container positioning based on position
	const getContainerPositionStyle = () => {
		switch (position) {
			case "top":
				return { top: 0, paddingTop: 50 }; // 50px for status bar
			case "bottom":
				return { bottom: 0, paddingBottom: 34 }; // 34px for home indicator
			case "center":
				return { top: 0, bottom: 0, justifyContent: "center" as const };
			default:
				return { top: 0, paddingTop: 50 };
		}
	};

	return (
		<View
			style={[styles.container, getContainerPositionStyle()]}
			pointerEvents="box-none"
		>
			{positionedToasts.map((toast, index) => (
				<View
					key={toast.id}
					style={index > 0 ? styles.toastGap : undefined}
				>
					<Toast toast={toast} position={position} onHide={onHide} />
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: "absolute",
		left: 0,
		right: 0,
		zIndex: 9999,
		elevation: 9999,
		pointerEvents: "box-none",
	},
	toastGap: {
		marginTop: 8,
	},
});
