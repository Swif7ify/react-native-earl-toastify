import { Animated, Dimensions } from "react-native";
import { ToastAnimation, ToastPosition } from "./types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

/**
 * Animation configuration
 */
export interface AnimationConfig {
	duration: number;
	useNativeDriver: boolean;
}

/**
 * Default animation configuration
 */
export const DEFAULT_ANIMATION_CONFIG: AnimationConfig = {
	duration: 300,
	useNativeDriver: true,
};

/**
 * Get initial animated values based on animation type
 */
export const getInitialAnimatedValues = (
	animation: ToastAnimation,
	position: ToastPosition,
): { opacity: number; translateX: number; translateY: number } => {
	switch (animation) {
		case "fade":
			return { opacity: 0, translateX: 0, translateY: 0 };
		case "up":
			return {
				opacity: 1,
				translateX: 0,
				translateY: position === "bottom" ? 100 : -100,
			};
		case "down":
			return {
				opacity: 1,
				translateX: 0,
				translateY: position === "top" ? -100 : 100,
			};
		case "left":
			return { opacity: 1, translateX: -SCREEN_WIDTH, translateY: 0 };
		case "right":
			return { opacity: 1, translateX: SCREEN_WIDTH, translateY: 0 };
		case "none":
		default:
			return { opacity: 1, translateX: 0, translateY: 0 };
	}
};

/**
 * Get final animated values (visible state)
 */
export const getFinalAnimatedValues = (): {
	opacity: number;
	translateX: number;
	translateY: number;
} => {
	return { opacity: 1, translateX: 0, translateY: 0 };
};

/**
 * Get exit animated values based on animation type
 */
export const getExitAnimatedValues = (
	animation: ToastAnimation,
	position: ToastPosition,
): { opacity: number; translateX: number; translateY: number } => {
	switch (animation) {
		case "fade":
			return { opacity: 0, translateX: 0, translateY: 0 };
		case "up":
			return {
				opacity: 1,
				translateX: 0,
				translateY: position === "top" ? -100 : 100,
			};
		case "down":
			return {
				opacity: 1,
				translateX: 0,
				translateY: position === "bottom" ? 100 : -100,
			};
		case "left":
			return { opacity: 1, translateX: -SCREEN_WIDTH, translateY: 0 };
		case "right":
			return { opacity: 1, translateX: SCREEN_WIDTH, translateY: 0 };
		case "none":
		default:
			return { opacity: 0, translateX: 0, translateY: 0 };
	}
};

/**
 * Create enter animation
 */
export const createEnterAnimation = (
	animatedValues: {
		opacity: Animated.Value;
		translateX: Animated.Value;
		translateY: Animated.Value;
	},
	config: AnimationConfig = DEFAULT_ANIMATION_CONFIG,
): Animated.CompositeAnimation => {
	const finalValues = getFinalAnimatedValues();

	return Animated.parallel([
		Animated.timing(animatedValues.opacity, {
			toValue: finalValues.opacity,
			duration: config.duration,
			useNativeDriver: config.useNativeDriver,
		}),
		Animated.timing(animatedValues.translateX, {
			toValue: finalValues.translateX,
			duration: config.duration,
			useNativeDriver: config.useNativeDriver,
		}),
		Animated.timing(animatedValues.translateY, {
			toValue: finalValues.translateY,
			duration: config.duration,
			useNativeDriver: config.useNativeDriver,
		}),
	]);
};

/**
 * Create exit animation
 */
export const createExitAnimation = (
	animatedValues: {
		opacity: Animated.Value;
		translateX: Animated.Value;
		translateY: Animated.Value;
	},
	animation: ToastAnimation,
	position: ToastPosition,
	config: AnimationConfig = DEFAULT_ANIMATION_CONFIG,
): Animated.CompositeAnimation => {
	const exitValues = getExitAnimatedValues(animation, position);

	return Animated.parallel([
		Animated.timing(animatedValues.opacity, {
			toValue: exitValues.opacity,
			duration: config.duration,
			useNativeDriver: config.useNativeDriver,
		}),
		Animated.timing(animatedValues.translateX, {
			toValue: exitValues.translateX,
			duration: config.duration,
			useNativeDriver: config.useNativeDriver,
		}),
		Animated.timing(animatedValues.translateY, {
			toValue: exitValues.translateY,
			duration: config.duration,
			useNativeDriver: config.useNativeDriver,
		}),
	]);
};
