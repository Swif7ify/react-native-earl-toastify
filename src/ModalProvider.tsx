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
import {
	InputModal as InputModalData,
	InputModalConfig,
	InputModalResult,
} from "./inputModalTypes";
import { ConfirmModal } from "./ConfirmModal";
import { InputModal } from "./InputModal";

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
 * ModalProvider - Wrap your app with this component to enable confirmation and input modals
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
	// Confirm modal state
	const [confirmModal, setConfirmModal] = useState<ModalData | null>(null);
	const confirmResolverRef = useRef<((confirmed: boolean) => void) | null>(
		null,
	);

	// Input modal state
	const [inputModal, setInputModal] = useState<InputModalData | null>(null);
	const inputResolverRef = useRef<
		((result: InputModalResult) => void) | null
	>(null);

	// Merge config with defaults
	const mergedConfig = useMemo(
		() => ({ ...DEFAULT_CONFIG, ...config }),
		[config],
	);

	// ============ Confirm Modal Methods ============

	/**
	 * Show a modal notification
	 * Returns a Promise that resolves to true if confirmed, false if cancelled
	 */
	const show = useCallback(
		(modalConfig: ModalConfig): Promise<boolean> => {
			return new Promise((resolve) => {
				// Store resolver for later
				confirmResolverRef.current = resolve;

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

				setConfirmModal(newModal);
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
		if (confirmResolverRef.current) {
			confirmResolverRef.current(false);
			confirmResolverRef.current = null;
		}
		if (inputResolverRef.current) {
			inputResolverRef.current({ confirmed: false, value: "" });
			inputResolverRef.current = null;
		}
		setConfirmModal(null);
		setInputModal(null);
	}, []);

	/**
	 * Handle confirm action for confirm modal
	 */
	const handleConfirmConfirm = useCallback(() => {
		if (confirmModal) {
			confirmModal.onConfirm?.();
			confirmModal.resolve(true);
		}
		setConfirmModal(null);
		confirmResolverRef.current = null;
	}, [confirmModal]);

	/**
	 * Handle cancel action for confirm modal
	 */
	const handleConfirmCancel = useCallback(() => {
		if (confirmModal) {
			confirmModal.onCancel?.();
			confirmModal.resolve(false);
		}
		setConfirmModal(null);
		confirmResolverRef.current = null;
	}, [confirmModal]);

	// ============ Input Modal Methods ============

	/**
	 * Show an input modal
	 * Returns a Promise that resolves to InputModalResult
	 */
	const input = useCallback(
		(inputConfig: InputModalConfig): Promise<InputModalResult> => {
			return new Promise((resolve) => {
				// Store resolver for later
				inputResolverRef.current = resolve;

				const id = generateId();

				const newInputModal: InputModalData = {
					id,
					title: inputConfig.title,
					message: inputConfig.message,
					type: inputConfig.type || "confirm",
					confirmText:
						inputConfig.confirmText ||
						mergedConfig.defaultConfirmText,
					cancelText:
						inputConfig.cancelText ||
						mergedConfig.defaultCancelText,
					showCancel: inputConfig.showCancel ?? true,
					dismissOnBackdrop: inputConfig.dismissOnBackdrop ?? false, // Default false for input
					animationIn:
						inputConfig.animationIn ||
						mergedConfig.defaultAnimationIn,
					animationOut:
						inputConfig.animationOut ||
						mergedConfig.defaultAnimationOut,
					animationDuration:
						inputConfig.animationDuration ||
						mergedConfig.defaultAnimationDuration,
					icon: inputConfig.icon,
					hideIcon: inputConfig.hideIcon,
					inputMode: inputConfig.inputMode || "text",
					placeholder: inputConfig.placeholder,
					defaultValue: inputConfig.defaultValue,
					restrictions: inputConfig.restrictions,
					otpConfig: inputConfig.otpConfig,
					validateOnChange: inputConfig.validateOnChange,
					customValidator: inputConfig.customValidator,
					inputLabel: inputConfig.inputLabel,
					helperText: inputConfig.helperText,
					keyboardType: inputConfig.keyboardType,
					autoCapitalize: inputConfig.autoCapitalize,
					secureTextEntry: inputConfig.secureTextEntry,
					autoFocus: inputConfig.autoFocus ?? true,
					returnKeyType: inputConfig.returnKeyType,
					backgroundColor: inputConfig.backgroundColor,
					textColor: inputConfig.textColor,
					confirmButtonColor: inputConfig.confirmButtonColor,
					confirmButtonTextColor: inputConfig.confirmButtonTextColor,
					cancelButtonColor: inputConfig.cancelButtonColor,
					cancelButtonTextColor: inputConfig.cancelButtonTextColor,
					style: inputConfig.style,
					titleStyle: inputConfig.titleStyle,
					messageStyle: inputConfig.messageStyle,
					inputContainerStyle: inputConfig.inputContainerStyle,
					inputStyle: inputConfig.inputStyle,
					errorStyle: inputConfig.errorStyle,
					labelStyle: inputConfig.labelStyle,
					helperStyle: inputConfig.helperStyle,
					confirmButtonStyle: inputConfig.confirmButtonStyle,
					cancelButtonStyle: inputConfig.cancelButtonStyle,
					accessibilityLabel: inputConfig.accessibilityLabel,
					inputAccessibilityHint: inputConfig.inputAccessibilityHint,
					onConfirm: inputConfig.onConfirm,
					onCancel: inputConfig.onCancel,
					resolve,
				};

				setInputModal(newInputModal);
			});
		},
		[mergedConfig],
	);

	/**
	 * Show a confirmation text input modal
	 * User must type the exact confirmation text to proceed
	 */
	const confirmWithText = useCallback(
		(
			title: string,
			message: string,
			confirmationText: string,
			config?: Partial<InputModalConfig>,
		): Promise<InputModalResult> => {
			return input({
				...config,
				title,
				message,
				type: config?.type || "danger",
				inputMode: "text",
				restrictions: {
					...config?.restrictions,
					confirmationText,
					caseSensitive: config?.restrictions?.caseSensitive ?? false,
				},
				confirmText: config?.confirmText || "Confirm",
				helperText:
					config?.helperText ||
					`Type "${confirmationText}" to confirm`,
			});
		},
		[input],
	);

	/**
	 * Show an OTP/verification code input modal
	 */
	const otp = useCallback(
		(
			title: string,
			message: string,
			config?: Partial<InputModalConfig>,
		): Promise<InputModalResult> => {
			return input({
				...config,
				title,
				message,
				type: config?.type || "confirm",
				inputMode: "otp",
				restrictions: {
					numbersOnly: true,
					...config?.restrictions,
				},
			});
		},
		[input],
	);

	/**
	 * Show a PIN input modal (masked by default)
	 */
	const pin = useCallback(
		(
			title: string,
			message: string,
			config?: Partial<InputModalConfig>,
		): Promise<InputModalResult> => {
			return input({
				...config,
				title,
				message,
				type: config?.type || "confirm",
				inputMode: "pin",
				restrictions: {
					numbersOnly: true,
					...config?.restrictions,
				},
			});
		},
		[input],
	);

	/**
	 * Handle confirm action for input modal
	 */
	const handleInputConfirm = useCallback(
		(value: string) => {
			if (inputModal) {
				inputModal.onConfirm?.(value);
				inputModal.resolve({ confirmed: true, value });
			}
			setInputModal(null);
			inputResolverRef.current = null;
		},
		[inputModal],
	);

	/**
	 * Handle cancel action for input modal
	 */
	const handleInputCancel = useCallback(() => {
		if (inputModal) {
			inputModal.onCancel?.();
			inputModal.resolve({ confirmed: false, value: "" });
		}
		setInputModal(null);
		inputResolverRef.current = null;
	}, [inputModal]);

	// Context value
	const contextValue = useMemo<ModalContextValue>(
		() => ({
			show,
			confirm,
			warning,
			danger,
			info,
			hide,
			input,
			confirmWithText,
			otp,
			pin,
		}),
		[
			show,
			confirm,
			warning,
			danger,
			info,
			hide,
			input,
			confirmWithText,
			otp,
			pin,
		],
	);

	return (
		<ModalContext.Provider value={contextValue}>
			<View style={styles.container}>
				{children}
				{/* Render confirm modal if present */}
				{confirmModal && (
					<ConfirmModal
						modal={confirmModal}
						onConfirm={handleConfirmConfirm}
						onCancel={handleConfirmCancel}
					/>
				)}
				{/* Render input modal if present */}
				{inputModal && (
					<InputModal
						modal={inputModal}
						onConfirm={handleInputConfirm}
						onCancel={handleInputCancel}
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
