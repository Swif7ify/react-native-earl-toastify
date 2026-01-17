import { useContext } from "react";
import { ToastContext } from "./ToastProvider";
import { ToastContextValue } from "./types";

/**
 * Hook to access toast functions
 *
 * @returns Toast context with show, success, warning, error, info, hide, and hideAll methods
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * // Show different toast types
 * toast.success('Operation completed!');
 * toast.error('Something went wrong');
 * toast.warning('Please check your input');
 * toast.info('New update available');
 *
 * // Show with custom configuration
 * toast.show({
 *   message: 'Custom toast',
 *   type: 'custom',
 *   backgroundColor: '#8B5CF6',
 *   textColor: '#FFFFFF',
 *   position: 'bottom',
 *   duration: 5000,
 *   animationIn: 'up',
 *   animationOut: 'down',
 * });
 *
 * // Hide specific toast
 * const id = toast.success('Saving...');
 * toast.hide(id);
 *
 * // Hide all toasts
 * toast.hideAll();
 * ```
 *
 * @throws Error if used outside of ToastProvider
 */
export const useToast = (): ToastContextValue => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error(
			"useToast must be used within a ToastProvider. " +
				"Wrap your app with <ToastProvider> to use toast notifications.",
		);
	}

	return context;
};
