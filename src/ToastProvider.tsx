import React, {
	createContext,
	useState,
	useCallback,
	useMemo,
	ReactNode,
} from "react";
import { View, StyleSheet } from "react-native";
import {
	Toast as ToastData,
	ToastConfig,
	ToastContextValue,
	ToastProviderConfig,
	ToastPosition,
} from "./types";
import { ToastContainer } from "./ToastContainer";

/**
 * Toast context for accessing toast functions
 */
export const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * Generate unique ID for toasts
 */
const generateId = (): string => {
	return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<ToastProviderConfig> = {
	defaultPosition: "top",
	defaultDuration: 3000,
	defaultAnimationIn: "fade",
	defaultAnimationOut: "fade",
	defaultAnimationDuration: 300,
	maxToasts: 5,
};

export interface ToastProviderProps {
	children: ReactNode;
	config?: ToastProviderConfig;
}

/**
 * ToastProvider - Wrap your app with this component to enable toasts
 *
 * @example
 * ```tsx
 * <ToastProvider config={{ defaultPosition: 'bottom' }}>
 *   <App />
 * </ToastProvider>
 * ```
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
	children,
	config = {},
}) => {
	const [toasts, setToasts] = useState<ToastData[]>([]);

	// Merge config with defaults
	const mergedConfig = useMemo(
		() => ({ ...DEFAULT_CONFIG, ...config }),
		[config],
	);

	/**
	 * Show a toast notification
	 */
	const show = useCallback(
		(toastConfig: ToastConfig): string => {
			const id = generateId();

			const newToast: ToastData = {
				id,
				title: toastConfig.title,
				message: toastConfig.message,
				type: toastConfig.type || "default",
				position: toastConfig.position || mergedConfig.defaultPosition,
				duration: toastConfig.duration ?? mergedConfig.defaultDuration,
				animationIn:
					toastConfig.animationIn || mergedConfig.defaultAnimationIn,
				animationOut:
					toastConfig.animationOut ||
					mergedConfig.defaultAnimationOut,
				animationDuration:
					toastConfig.animationDuration ||
					mergedConfig.defaultAnimationDuration,
				dismissable: toastConfig.dismissable ?? true,
				icon: toastConfig.icon,
				hideIcon: toastConfig.hideIcon,
				backgroundColor: toastConfig.backgroundColor,
				textColor: toastConfig.textColor,
				borderColor: toastConfig.borderColor,
				style: toastConfig.style,
				textStyle: toastConfig.textStyle,
				onShow: toastConfig.onShow,
				onHide: toastConfig.onHide,
				onPress: toastConfig.onPress,
			};

			setToasts((prev) => {
				// Limit to maxToasts
				const updated = [...prev, newToast];
				if (updated.length > mergedConfig.maxToasts) {
					return updated.slice(-mergedConfig.maxToasts);
				}
				return updated;
			});

			return id;
		},
		[mergedConfig],
	);

	/**
	 * Helper to parse flexible arguments: (message) or (title, description)
	 * This function properly handles both literal strings and variables
	 */
	const parseArgs = useCallback(
		(
			titleOrMessage: string,
			descriptionOrConfig?: string | Partial<ToastConfig>,
			config?: Partial<ToastConfig>,
		): {
			title?: string;
			message: string;
			config?: Partial<ToastConfig>;
		} => {
			// Check if second argument is a string (either literal or variable)
			if (
				descriptionOrConfig !== undefined &&
				typeof descriptionOrConfig === "string"
			) {
				// Called as (title, description, config?)
				return {
					title: titleOrMessage,
					message: descriptionOrConfig,
					config,
				};
			} else {
				// Called as (message, config?) - no title, just message
				return {
					message: titleOrMessage,
					config: descriptionOrConfig as
						| Partial<ToastConfig>
						| undefined,
				};
			}
		},
		[],
	);

	/**
	 * Show a success toast
	 */
	const success = useCallback(
		(
			titleOrMessage: string,
			descriptionOrConfig?: string | Partial<ToastConfig>,
			config?: Partial<ToastConfig>,
		): string => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, descriptionOrConfig, config);
			return show({ ...cfg, title, message, type: "success" });
		},
		[show],
	);

	/**
	 * Show a warning toast
	 */
	const warning = useCallback(
		(
			titleOrMessage: string,
			descriptionOrConfig?: string | Partial<ToastConfig>,
			config?: Partial<ToastConfig>,
		): string => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, descriptionOrConfig, config);
			return show({ ...cfg, title, message, type: "warning" });
		},
		[show],
	);

	/**
	 * Show an error toast
	 */
	const error = useCallback(
		(
			titleOrMessage: string,
			descriptionOrConfig?: string | Partial<ToastConfig>,
			config?: Partial<ToastConfig>,
		): string => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, descriptionOrConfig, config);
			return show({ ...cfg, title, message, type: "error" });
		},
		[show],
	);

	/**
	 * Show an info toast
	 */
	const info = useCallback(
		(
			titleOrMessage: string,
			descriptionOrConfig?: string | Partial<ToastConfig>,
			config?: Partial<ToastConfig>,
		): string => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, descriptionOrConfig, config);
			return show({ ...cfg, title, message, type: "info" });
		},
		[show],
	);

	/**
	 * Hide a specific toast by ID
	 */
	const hide = useCallback((id: string): void => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	/**
	 * Hide all toasts
	 */
	const hideAll = useCallback((): void => {
		setToasts([]);
	}, []);

	// Context value
	const contextValue = useMemo<ToastContextValue>(
		() => ({
			show,
			success,
			warning,
			error,
			info,
			hide,
			hideAll,
		}),
		[show, success, warning, error, info, hide, hideAll],
	);

	// Group toasts by position
	const positions: ToastPosition[] = ["top", "center", "bottom"];

	return (
		<ToastContext.Provider value={contextValue}>
			<View style={styles.container}>
				{children}
				{/* Render toast containers for each position */}
				{positions.map((position) => (
					<ToastContainer
						key={position}
						toasts={toasts}
						position={position}
						onHide={hide}
					/>
				))}
			</View>
		</ToastContext.Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
