import React, { useEffect, useCallback, useRef } from "react";
import {
	Animated,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	AccessibilityInfo,
	Pressable,
} from "react-native";

import { Modal as ModalData } from "./modalTypes";
import { useModalAnimation } from "./useModalAnimation";
import {
	getModalColors,
	modalContainerStyle,
	modalBackdropStyle,
	modalTitleStyle,
	modalMessageStyle,
	modalIconContainerStyle,
	modalButtonContainerStyle,
	baseButtonStyle,
	buttonTextStyle,
	modalOverlayStyle,
} from "./modalStyles";
import { ModalIcons } from "./modalIcons";

export interface ConfirmModalProps {
	modal: ModalData;
	onConfirm: () => void;
	onCancel: () => void;
}

/**
 * Confirmation Modal component with accessibility support
 * Implements WCAG 2.1 AA compliance:
 * - accessibilityRole="alert" for dialog announcement
 * - Screen reader announcements
 * - Minimum touch target sizes (48px)
 * - Proper color contrast
 * - Focus management
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
	modal,
	onConfirm,
	onCancel,
}) => {
	const {
		title,
		message,
		type = "confirm",
		confirmText = "Confirm",
		cancelText = "Cancel",
		showCancel = true,
		dismissOnBackdrop = true,
		animationIn = "scale",
		animationOut = "scale",
		animationDuration = 250,
		icon,
		hideIcon = false,
		backgroundColor,
		textColor,
		confirmButtonColor,
		confirmButtonTextColor,
		cancelButtonColor,
		cancelButtonTextColor,
		style,
		titleStyle,
		messageStyle: customMessageStyle,
		confirmButtonStyle,
		cancelButtonStyle,
		accessibilityLabel,
	} = modal;

	const isAnimatingRef = useRef(false);

	// Get colors based on type
	const colors = getModalColors(type);
	const finalBackgroundColor = backgroundColor || colors.background;
	const finalTextColor = textColor || colors.text;
	const finalConfirmButtonColor = confirmButtonColor || colors.confirmButton;
	const finalConfirmButtonTextColor =
		confirmButtonTextColor || colors.confirmButtonText;
	const finalCancelButtonColor = cancelButtonColor || colors.cancelButton;
	const finalCancelButtonTextColor =
		cancelButtonTextColor || colors.cancelButtonText;

	// Animation hook
	const {
		backdropOpacity,
		contentOpacity,
		contentScale,
		contentTranslateY,
		startEnterAnimation,
		startExitAnimation,
	} = useModalAnimation(animationIn, animationOut, animationDuration);

	/**
	 * Handle confirm button press
	 */
	const handleConfirm = useCallback(() => {
		if (isAnimatingRef.current) return;
		isAnimatingRef.current = true;

		startExitAnimation(() => {
			onConfirm();
		});
	}, [onConfirm, startExitAnimation]);

	/**
	 * Handle cancel button press
	 */
	const handleCancel = useCallback(() => {
		if (isAnimatingRef.current) return;
		isAnimatingRef.current = true;

		startExitAnimation(() => {
			onCancel();
		});
	}, [onCancel, startExitAnimation]);

	/**
	 * Handle backdrop press
	 */
	const handleBackdropPress = useCallback(() => {
		if (dismissOnBackdrop) {
			handleCancel();
		}
	}, [dismissOnBackdrop, handleCancel]);

	// Start enter animation and announce to screen readers
	useEffect(() => {
		startEnterAnimation();

		// Announce modal content to screen readers
		const announcement = accessibilityLabel || `${title}. ${message}`;
		AccessibilityInfo.announceForAccessibility(announcement);
	}, [startEnterAnimation, title, message, accessibilityLabel]);

	// Render icon
	const renderIcon = () => {
		if (hideIcon) return null;

		if (icon) {
			return <View style={modalIconContainerStyle}>{icon}</View>;
		}

		// Use default icon based on type
		const IconComponent = ModalIcons[type];
		if (IconComponent) {
			return (
				<View style={modalIconContainerStyle}>
					<IconComponent color={colors.icon} size={48} />
				</View>
			);
		}

		return null;
	};

	// Accessibility label for the modal
	const modalAccessibilityLabel =
		accessibilityLabel || `${title}. ${message}`;

	return (
		<View style={modalOverlayStyle} pointerEvents="box-none">
			{/* Backdrop */}
			<Animated.View
				style={[
					modalBackdropStyle,
					{
						opacity: backdropOpacity,
					},
				]}
			>
				<Pressable
					style={StyleSheet.absoluteFill}
					onPress={handleBackdropPress}
					accessibilityRole="button"
					accessibilityLabel="Close modal"
					accessibilityHint="Double tap to cancel and close this dialog"
				/>
			</Animated.View>

			{/* Modal Content */}
			<Animated.View
				style={[
					styles.centeredContainer,
					{
						opacity: contentOpacity,
						transform: [
							{ scale: contentScale },
							{ translateY: contentTranslateY },
						],
					},
				]}
				pointerEvents="box-none"
			>
				<View
					style={[
						modalContainerStyle,
						{ backgroundColor: finalBackgroundColor },
						style,
					]}
					accessibilityRole="alert"
					accessibilityLabel={modalAccessibilityLabel}
					accessibilityViewIsModal={true}
				>
					{/* Icon */}
					{renderIcon()}

					{/* Title */}
					<Text
						style={[
							modalTitleStyle,
							{ color: finalTextColor },
							titleStyle,
						]}
						accessibilityRole="header"
						numberOfLines={2}
					>
						{title}
					</Text>

					{/* Message */}
					<Text
						style={[
							modalMessageStyle,
							{ color: finalTextColor },
							customMessageStyle,
						]}
						numberOfLines={4}
					>
						{message}
					</Text>

					{/* Buttons */}
					<View style={modalButtonContainerStyle}>
						{/* Cancel Button */}
						{showCancel && (
							<TouchableOpacity
								style={[
									baseButtonStyle,
									{ backgroundColor: finalCancelButtonColor },
									cancelButtonStyle,
								]}
								onPress={handleCancel}
								accessibilityRole="button"
								accessibilityLabel={cancelText}
								accessibilityHint="Double tap to cancel"
								activeOpacity={0.8}
							>
								<Text
									style={[
										buttonTextStyle,
										{ color: finalCancelButtonTextColor },
									]}
								>
									{cancelText}
								</Text>
							</TouchableOpacity>
						)}

						{/* Confirm Button */}
						<TouchableOpacity
							style={[
								baseButtonStyle,
								{ backgroundColor: finalConfirmButtonColor },
								confirmButtonStyle,
							]}
							onPress={handleConfirm}
							accessibilityRole="button"
							accessibilityLabel={confirmText}
							accessibilityHint="Double tap to confirm"
							activeOpacity={0.8}
						>
							<Text
								style={[
									buttonTextStyle,
									{ color: finalConfirmButtonTextColor },
								]}
							>
								{confirmText}
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	centeredContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "box-none",
	},
});
