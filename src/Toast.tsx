import React, { useEffect, useRef, useCallback } from "react";
import {
	Animated,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	AccessibilityInfo,
} from "react-native";
import { Toast as ToastData, ToastPosition, ToastAnimation } from "./types";
import { useToastAnimation } from "./useToastAnimation";
import {
	getToastColors,
	baseToastStyle,
	getPositionalStyle,
	titleStyle,
	descriptionStyle,
	messageStyle,
	textContainerStyle,
	iconContainerStyle,
	closeButtonStyle,
} from "./styles";
import { DefaultIcons } from "../src/icons";

export interface ToastProps {
	toast: ToastData;
	position: ToastPosition;
	onHide: (id: string) => void;
}

/**
 * Individual Toast component with animations
 */
export const Toast: React.FC<ToastProps> = ({ toast, position, onHide }) => {
	const {
		id,
		title,
		message,
		type = "default",
		duration = 3000,
		animationIn = "fade",
		animationOut = "fade",
		animationDuration = 300,
		dismissable = true,
		icon,
		hideIcon = false,
		backgroundColor,
		textColor,
		borderColor,
		style,
		textStyle,
		onShow,
		onHide: onHideCallback,
		onPress,
	} = toast;

	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const isHidingRef = useRef(false);

	// Get colors based on type
	const colors = getToastColors(type);
	const finalBackgroundColor = backgroundColor || colors.background;
	const finalTextColor = textColor || colors.text;
	const finalBorderColor = borderColor || colors.border;

	// Animation hook
	const { animatedStyle, startExitAnimation } = useToastAnimation(
		animationIn,
		animationOut,
		position,
		animationDuration,
	);

	/**
	 * Handle hiding the toast
	 */
	const handleHide = useCallback(() => {
		if (isHidingRef.current) return;
		isHidingRef.current = true;

		// Clear timer
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}

		// Start exit animation
		startExitAnimation(() => {
			onHideCallback?.();
			onHide(id);
		});
	}, [id, onHide, onHideCallback, startExitAnimation]);

	/**
	 * Handle press on toast
	 */
	const handlePress = useCallback(() => {
		onPress?.();
		if (dismissable) {
			handleHide();
		}
	}, [onPress, dismissable, handleHide]);

	// Setup auto-dismiss timer
	useEffect(() => {
		// Call onShow callback
		onShow?.();

		// Announce to accessibility
		AccessibilityInfo.announceForAccessibility(message);

		// Setup auto-dismiss if duration > 0
		if (duration > 0) {
			timerRef.current = setTimeout(() => {
				handleHide();
			}, duration);
		}

		return () => {
			if (timerRef.current) {
				clearTimeout(timerRef.current);
			}
		};
	}, [duration, message, onShow, handleHide]);

	// Render icon
	const renderIcon = () => {
		if (hideIcon) return null;

		if (icon) {
			return <View style={iconContainerStyle}>{icon}</View>;
		}

		// Use default icon based on type
		const DefaultIcon = DefaultIcons[type];
		if (DefaultIcon) {
			return (
				<View style={iconContainerStyle}>
					<DefaultIcon color={colors.icon} size={20} />
				</View>
			);
		}

		return null;
	};

	// Render close button
	const renderCloseButton = () => {
		if (!dismissable) return null;

		return (
			<TouchableOpacity
				style={closeButtonStyle}
				onPress={handleHide}
				accessibilityRole="button"
				accessibilityLabel="Dismiss notification"
				hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
			>
				<DefaultIcons.close color={colors.icon} size={16} />
			</TouchableOpacity>
		);
	};

	const containerStyles = [
		baseToastStyle,
		getPositionalStyle(position),
		{
			backgroundColor: finalBackgroundColor,
			borderLeftColor: finalBorderColor,
		},
		style,
	];

	// Accessibility label combines title and message
	const accessibilityLabel = title ? `${title}. ${message}` : message;

	// Render text content - title + description or just message
	const renderTextContent = () => {
		if (title) {
			// Has title: render title (larger) + message as description (smaller)
			return (
				<View style={textContainerStyle}>
					<Text
						style={[
							titleStyle,
							{ color: finalTextColor },
							textStyle,
						]}
						numberOfLines={2}
					>
						{title}
					</Text>
					<Text
						style={[descriptionStyle, { color: finalTextColor }]}
						numberOfLines={2}
					>
						{message}
					</Text>
				</View>
			);
		}
		// No title: render message as main text
		return (
			<Text
				style={[messageStyle, { color: finalTextColor }, textStyle]}
				numberOfLines={3}
			>
				{message}
			</Text>
		);
	};

	return (
		<Animated.View
			style={[
				containerStyles,
				{
					opacity: animatedStyle.opacity,
					transform: animatedStyle.transform,
				},
			]}
			accessibilityRole="alert"
			accessibilityLiveRegion="polite"
		>
			<TouchableOpacity
				style={styles.content}
				onPress={handlePress}
				activeOpacity={dismissable ? 0.8 : 1}
				disabled={!dismissable && !onPress}
				accessibilityRole="button"
				accessibilityLabel={accessibilityLabel}
				accessibilityHint={
					dismissable ? "Double tap to dismiss" : undefined
				}
			>
				{renderIcon()}
				{renderTextContent()}
				{renderCloseButton()}
			</TouchableOpacity>
		</Animated.View>
	);
};

const styles = StyleSheet.create({
	content: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
	},
});
