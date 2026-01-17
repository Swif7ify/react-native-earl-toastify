import { useRef, useEffect, useCallback } from "react";
import { Animated } from "react-native";
import { ToastAnimation, ToastPosition } from "./types";
import {
	getInitialAnimatedValues,
	createEnterAnimation,
	createExitAnimation,
	DEFAULT_ANIMATION_CONFIG,
} from "./animations";

type TransformStyle =
	| { translateX: Animated.Value }
	| { translateY: Animated.Value };

/**
 * Hook return type
 */
export interface UseToastAnimationReturn {
	animatedStyle: {
		opacity: Animated.Value;
		transform: TransformStyle[];
	};
	startEnterAnimation: () => void;
	startExitAnimation: (callback?: () => void) => void;
}

/**
 * Custom hook for managing toast animations
 */
export const useToastAnimation = (
	animationIn: ToastAnimation,
	animationOut: ToastAnimation,
	position: ToastPosition,
	animationDuration: number = DEFAULT_ANIMATION_CONFIG.duration,
): UseToastAnimationReturn => {
	// Get initial values based on enter animation
	const initialValues = getInitialAnimatedValues(animationIn, position);

	// Create animated values
	const opacity = useRef(new Animated.Value(initialValues.opacity)).current;
	const translateX = useRef(
		new Animated.Value(initialValues.translateX),
	).current;
	const translateY = useRef(
		new Animated.Value(initialValues.translateY),
	).current;

	// Animation config
	const config = {
		duration: animationDuration,
		useNativeDriver: true,
	};

	/**
	 * Start enter animation
	 */
	const startEnterAnimation = useCallback(() => {
		const animation = createEnterAnimation(
			{ opacity, translateX, translateY },
			config,
		);
		animation.start();
	}, [opacity, translateX, translateY, config.duration]);

	/**
	 * Start exit animation with optional callback
	 */
	const startExitAnimation = useCallback(
		(callback?: () => void) => {
			const animation = createExitAnimation(
				{ opacity, translateX, translateY },
				animationOut,
				position,
				config,
			);
			animation.start(({ finished }) => {
				if (finished && callback) {
					callback();
				}
			});
		},
		[
			opacity,
			translateX,
			translateY,
			animationOut,
			position,
			config.duration,
		],
	);

	// Start enter animation on mount
	useEffect(() => {
		startEnterAnimation();
	}, []);

	// Animated style object
	const animatedStyle: UseToastAnimationReturn["animatedStyle"] = {
		opacity,
		transform: [{ translateX }, { translateY }] as TransformStyle[],
	};

	return {
		animatedStyle,
		startEnterAnimation,
		startExitAnimation,
	};
};
