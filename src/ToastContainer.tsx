import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast as ToastData, ToastPosition } from "./types";
import { Toast } from "./Toast";

export interface ToastContainerProps {
	toasts: ToastData[];
	position: ToastPosition;
	onHide: (id: string) => void;
}

/**
 * Container component that positions and renders toasts
 * Uses SafeAreaView for proper safe area handling across all devices
 * Layout animations are handled by ToastProvider
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
				return { top: 0 };
			case "bottom":
				return { bottom: 0 };
			case "center":
				return { top: 0, bottom: 0, justifyContent: "center" as const };
			default:
				return { top: 0 };
		}
	};

	// Get SafeAreaView edges based on position
	const getSafeAreaEdges = (): ("top" | "bottom" | "left" | "right")[] => {
		switch (position) {
			case "top":
				return ["top"];
			case "bottom":
				return ["bottom"];
			case "center":
				return [];
			default:
				return ["top"];
		}
	};

	// For center position, don't use SafeAreaView
	if (position === "center") {
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
						<Toast
							toast={toast}
							position={position}
							onHide={onHide}
						/>
					</View>
				))}
			</View>
		);
	}

	return (
		<SafeAreaView
			style={[styles.container, getContainerPositionStyle()]}
			edges={getSafeAreaEdges()}
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
		</SafeAreaView>
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
