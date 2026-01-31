// Main exports
export { ToastProvider } from "./ToastProvider";
export { useToast } from "./useToast";
export { Toast } from "./Toast";
export { ToastContainer } from "./ToastContainer";

// Modal exports
export { ModalProvider } from "./ModalProvider";
export { useModal } from "./useModal";
export { ConfirmModal } from "./ConfirmModal";
export { InputModal } from "./InputModal";

// Types
export type {
	ToastType,
	ToastAnimation,
	ToastPosition,
	ToastConfig,
	Toast as ToastData,
	ToastContextValue,
	ToastProviderConfig,
} from "./types";

// Modal Types
export type {
	ModalType,
	ModalAnimation,
	ModalConfig,
	Modal as ModalData,
	ModalContextValue,
	ModalProviderConfig,
} from "./modalTypes";

// Input Modal Types
export type {
	InputMode,
	InputRestrictions,
	OtpConfig,
	InputModalConfig,
	InputModalResult,
	InputModal as InputModalData,
} from "./inputModalTypes";
export { DEFAULT_OTP_CONFIG, DEFAULT_PIN_CONFIG } from "./inputModalTypes";

// Styles (for customization)
export {
	TOAST_COLORS,
	getToastColors,
	baseToastStyle,
	getPositionalStyle,
	getContainerStyle,
} from "./styles";

// Modal Styles (for customization)
export {
	MODAL_COLORS,
	getModalColors,
	modalContainerStyle,
	modalBackdropStyle,
	modalTitleStyle,
	modalMessageStyle,
	modalButtonContainerStyle,
	baseButtonStyle,
	buttonTextStyle,
} from "./modalStyles";

// Input Modal Styles (for customization)
export {
	inputContainerStyle,
	inputLabelStyle,
	baseInputStyle,
	inputTextStyle,
	inputFocusedStyle,
	inputErrorStyle,
	errorTextStyle,
	helperTextStyle,
	otpContainerStyle,
	otpBoxStyle,
	otpTextStyle,
	getOtpBoxStyle,
	INPUT_VALIDATION_COLORS,
} from "./inputModalStyles";

// Animation utilities (for advanced customization)
export {
	getInitialAnimatedValues,
	getFinalAnimatedValues,
	getExitAnimatedValues,
	createEnterAnimation,
	createExitAnimation,
	DEFAULT_ANIMATION_CONFIG,
} from "./animations";

// Modal Animation utilities
export {
	useModalAnimation,
	getModalInitialValues,
	getModalFinalValues,
	getModalExitValues,
	DEFAULT_MODAL_ANIMATION_CONFIG,
} from "./useModalAnimation";

// Animation hook
export { useToastAnimation } from "./useToastAnimation";

// Icons (for reference or custom implementations)
export { DefaultIcons } from "./icons";
export { ModalIcons } from "./modalIcons";
