import React, {
	createContext,
	useState,
	useCallback,
	useMemo,
	useRef,
	ReactNode,
} from "react";
import { View, StyleSheet } from "react-native";
import {
	Modal as ModalData,
	ModalConfig,
	ModalContextValue,
	ModalProviderConfig,
} from "./modalTypes";
import { ConfirmModal } from "./ConfirmModal";

/**
 * Modal context for accessing modal functions
 */
export const ModalContext = createContext<ModalContextValue | null>(null);

/**
 * Generate unique ID for modals
 */
const generateId = (): string => {
	return `modal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<ModalProviderConfig> = {
	defaultAnimationIn: "scale",
	defaultAnimationOut: "scale",
	defaultAnimationDuration: 250,
	defaultConfirmText: "Confirm",
	defaultCancelText: "Cancel",
	defaultDismissOnBackdrop: true,
};

export interface ModalProviderProps {
	children: ReactNode;
	config?: ModalProviderConfig;
}

/**
 * ModalProvider - Wrap your app with this component to enable confirmation modals
 *
 * @example
 * ```tsx
 * <ModalProvider>
 *   <App />
 * </ModalProvider>
 * ```
 */
export const ModalProvider: React.FC<ModalProviderProps> = ({
	children,
	config = {},
}) => {
	const [modal, setModal] = useState<ModalData | null>(null);
	const resolverRef = useRef<((confirmed: boolean) => void) | null>(null);

	// Merge config with defaults
	const mergedConfig = useMemo(
		() => ({ ...DEFAULT_CONFIG, ...config }),
		[config],
	);

	/**
	 * Show a modal notification
	 * Returns a Promise that resolves to true if confirmed, false if cancelled
	 */
	const show = useCallback(
		(modalConfig: ModalConfig): Promise<boolean> => {
			return new Promise((resolve) => {
				// Store resolver for later
				resolverRef.current = resolve;

				const id = generateId();

				const newModal: ModalData = {
					id,
					title: modalConfig.title,
					message: modalConfig.message,
					type: modalConfig.type || "confirm",
					confirmText:
						modalConfig.confirmText ||
						mergedConfig.defaultConfirmText,
					cancelText:
						modalConfig.cancelText ||
						mergedConfig.defaultCancelText,
					showCancel: modalConfig.showCancel ?? true,
					dismissOnBackdrop:
						modalConfig.dismissOnBackdrop ??
						mergedConfig.defaultDismissOnBackdrop,
					animationIn:
						modalConfig.animationIn ||
						mergedConfig.defaultAnimationIn,
					animationOut:
						modalConfig.animationOut ||
						mergedConfig.defaultAnimationOut,
					animationDuration:
						modalConfig.animationDuration ||
						mergedConfig.defaultAnimationDuration,
					icon: modalConfig.icon,
					hideIcon: modalConfig.hideIcon,
					backgroundColor: modalConfig.backgroundColor,
					textColor: modalConfig.textColor,
					confirmButtonColor: modalConfig.confirmButtonColor,
					confirmButtonTextColor: modalConfig.confirmButtonTextColor,
					cancelButtonColor: modalConfig.cancelButtonColor,
					cancelButtonTextColor: modalConfig.cancelButtonTextColor,
					style: modalConfig.style,
					titleStyle: modalConfig.titleStyle,
					messageStyle: modalConfig.messageStyle,
					confirmButtonStyle: modalConfig.confirmButtonStyle,
					cancelButtonStyle: modalConfig.cancelButtonStyle,
					accessibilityLabel: modalConfig.accessibilityLabel,
					onConfirm: modalConfig.onConfirm,
					onCancel: modalConfig.onCancel,
					resolve,
				};

				setModal(newModal);
			});
		},
		[mergedConfig],
	);

	/**
	 * Helper to parse flexible arguments: (message) or (title, description)
	 */
	const parseArgs = (
		titleOrMessage: string,
		messageOrConfig?: string | Partial<ModalConfig>,
		config?: Partial<ModalConfig>,
	): { title: string; message: string; config?: Partial<ModalConfig> } => {
		if (typeof messageOrConfig === "string") {
			// Called as (title, message, config?)
			return {
				title: titleOrMessage,
				message: messageOrConfig,
				config,
			};
		} else {
			// Called as (title, config?) - use title as both title and message
			return {
				title: titleOrMessage,
				message: titleOrMessage,
				config: messageOrConfig,
			};
		}
	};

	/**
	 * Show a confirmation modal
	 */
	const confirm = useCallback(
		(
			titleOrMessage: string,
			messageOrConfig?: string | Partial<ModalConfig>,
			config?: Partial<ModalConfig>,
		): Promise<boolean> => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, messageOrConfig, config);
			return show({ ...cfg, title, message, type: "confirm" });
		},
		[show],
	);

	/**
	 * Show a warning modal
	 */
	const warning = useCallback(
		(
			titleOrMessage: string,
			messageOrConfig?: string | Partial<ModalConfig>,
			config?: Partial<ModalConfig>,
		): Promise<boolean> => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, messageOrConfig, config);
			return show({ ...cfg, title, message, type: "warning" });
		},
		[show],
	);

	/**
	 * Show a danger modal
	 */
	const danger = useCallback(
		(
			titleOrMessage: string,
			messageOrConfig?: string | Partial<ModalConfig>,
			config?: Partial<ModalConfig>,
		): Promise<boolean> => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, messageOrConfig, config);
			return show({
				...cfg,
				title,
				message,
				type: "danger",
				confirmText: cfg?.confirmText || "Delete",
			});
		},
		[show],
	);

	/**
	 * Show an info modal
	 */
	const info = useCallback(
		(
			titleOrMessage: string,
			messageOrConfig?: string | Partial<ModalConfig>,
			config?: Partial<ModalConfig>,
		): Promise<boolean> => {
			const {
				title,
				message,
				config: cfg,
			} = parseArgs(titleOrMessage, messageOrConfig, config);
			return show({
				...cfg,
				title,
				message,
				type: "info",
				showCancel: cfg?.showCancel ?? false,
				confirmText: cfg?.confirmText || "OK",
			});
		},
		[show],
	);

	/**
	 * Hide the current modal (resolves as cancelled)
	 */
	const hide = useCallback((): void => {
		if (resolverRef.current) {
			resolverRef.current(false);
			resolverRef.current = null;
		}
		setModal(null);
	}, []);

	/**
	 * Handle confirm action
	 */
	const handleConfirm = useCallback(() => {
		if (modal) {
			modal.onConfirm?.();
			modal.resolve(true);
		}
		setModal(null);
		resolverRef.current = null;
	}, [modal]);

	/**
	 * Handle cancel action
	 */
	const handleCancel = useCallback(() => {
		if (modal) {
			modal.onCancel?.();
			modal.resolve(false);
		}
		setModal(null);
		resolverRef.current = null;
	}, [modal]);

	// Context value
	const contextValue = useMemo<ModalContextValue>(
		() => ({
			show,
			confirm,
			warning,
			danger,
			info,
			hide,
		}),
		[show, confirm, warning, danger, info, hide],
	);

	return (
		<ModalContext.Provider value={contextValue}>
			<View style={styles.container}>
				{children}
				{/* Render modal if present */}
				{modal && (
					<ConfirmModal
						modal={modal}
						onConfirm={handleConfirm}
						onCancel={handleCancel}
					/>
				)}
			</View>
		</ModalContext.Provider>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
