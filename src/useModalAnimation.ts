import { useRef, useCallback } from "react";
import { Animated } from "react-native";
import { ModalAnimation } from "./modalTypes";

/**
 * Default animation configuration for modals
 */
export const DEFAULT_MODAL_ANIMATION_CONFIG = {
	duration: 250,
	useNativeDriver: true,
};

/**
 * Get initial animated values based on animation type
 */
export const getModalInitialValues = (
	animation: ModalAnimation,
): { opacity: number; scale: number; translateY: number } => {
	switch (animation) {
		case "fade":
			return { opacity: 0, scale: 1, translateY: 0 };
		case "scale":
			return { opacity: 0, scale: 0.8, translateY: 0 };
		case "slide":
			return { opacity: 0, scale: 1, translateY: 100 };
		case "none":
		default:
			return { opacity: 1, scale: 1, translateY: 0 };
	}
};

/**
 * Get final animated values (visible state)
 */
export const getModalFinalValues = (): {
	opacity: number;
	scale: number;
	translateY: number;
} => {
	return { opacity: 1, scale: 1, translateY: 0 };
};

/**
 * Get exit animated values based on animation type
 */
export const getModalExitValues = (
	animation: ModalAnimation,
): { opacity: number; scale: number; translateY: number } => {
	switch (animation) {
		case "fade":
			return { opacity: 0, scale: 1, translateY: 0 };
		case "scale":
			return { opacity: 0, scale: 0.8, translateY: 0 };
		case "slide":
			return { opacity: 0, scale: 1, translateY: 100 };
		case "none":
		default:
			return { opacity: 0, scale: 1, translateY: 0 };
	}
};

/**
 * Hook return type
 */
export interface UseModalAnimationReturn {
	backdropOpacity: Animated.Value;
	contentOpacity: Animated.Value;
	contentScale: Animated.Value;
	contentTranslateY: Animated.Value;
	startEnterAnimation: () => void;
	startExitAnimation: (callback?: () => void) => void;
}

/**
 * Custom hook for managing modal animations
 */
export const useModalAnimation = (
	animationIn: ModalAnimation = "scale",
	animationOut: ModalAnimation = "scale",
	animationDuration: number = DEFAULT_MODAL_ANIMATION_CONFIG.duration,
): UseModalAnimationReturn => {
	// Get initial values based on enter animation
	const initialValues = getModalInitialValues(animationIn);

	// Create animated values
	const backdropOpacity = useRef(new Animated.Value(0)).current;
	const contentOpacity = useRef(
		new Animated.Value(initialValues.opacity),
	).current;
	const contentScale = useRef(
		new Animated.Value(initialValues.scale),
	).current;
	const contentTranslateY = useRef(
		new Animated.Value(initialValues.translateY),
	).current;

	/**
	 * Start enter animation
	 */
	const startEnterAnimation = useCallback(() => {
		const finalValues = getModalFinalValues();

		Animated.parallel([
			Animated.timing(backdropOpacity, {
				toValue: 1,
				duration: animationDuration,
				useNativeDriver: true,
			}),
			Animated.timing(contentOpacity, {
				toValue: finalValues.opacity,
				duration: animationDuration,
				useNativeDriver: true,
			}),
			Animated.spring(contentScale, {
				toValue: finalValues.scale,
				tension: 100,
				friction: 10,
				useNativeDriver: true,
			}),
			Animated.timing(contentTranslateY, {
				toValue: finalValues.translateY,
				duration: animationDuration,
				useNativeDriver: true,
			}),
		]).start();
	}, [
		backdropOpacity,
		contentOpacity,
		contentScale,
		contentTranslateY,
		animationDuration,
	]);

	/**
	 * Start exit animation with optional callback
	 */
	const startExitAnimation = useCallback(
		(callback?: () => void) => {
			const exitValues = getModalExitValues(animationOut);

			Animated.parallel([
				Animated.timing(backdropOpacity, {
					toValue: 0,
					duration: animationDuration,
					useNativeDriver: true,
				}),
				Animated.timing(contentOpacity, {
					toValue: exitValues.opacity,
					duration: animationDuration,
					useNativeDriver: true,
				}),
				Animated.timing(contentScale, {
					toValue: exitValues.scale,
					duration: animationDuration,
					useNativeDriver: true,
				}),
				Animated.timing(contentTranslateY, {
					toValue: exitValues.translateY,
					duration: animationDuration,
					useNativeDriver: true,
				}),
			]).start(({ finished }) => {
				if (finished && callback) {
					callback();
				}
			});
		},
		[
			backdropOpacity,
			contentOpacity,
			contentScale,
			contentTranslateY,
			animationOut,
			animationDuration,
		],
	);

	return {
		backdropOpacity,
		contentOpacity,
		contentScale,
		contentTranslateY,
		startEnterAnimation,
		startExitAnimation,
	};
};
