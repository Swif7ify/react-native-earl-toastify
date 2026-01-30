// Main exports
export { ToastProvider } from "./ToastProvider";
export { useToast } from "./useToast";
export { Toast } from "./Toast";
export { ToastContainer } from "./ToastContainer";

// Modal exports
export { ModalProvider } from "./ModalProvider";
export { useModal } from "./useModal";
export { ConfirmModal } from "./ConfirmModal";

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
