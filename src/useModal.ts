import { useContext } from "react";
import { ModalContext } from "./ModalProvider";
import { ModalContextValue } from "./modalTypes";

/**
 * Hook to access the modal context
 *
 * @example
 * ```tsx
 * const modal = useModal();
 *
 * // Show a confirmation modal
 * const confirmed = await modal.confirm('Delete Item', 'Are you sure you want to delete this item?');
 * if (confirmed) {
 *   // User confirmed
 * }
 *
 * // Show a warning modal
 * await modal.warning('Warning', 'This action cannot be undone');
 *
 * // Show a danger modal (for destructive actions)
 * const proceed = await modal.danger('Delete Account', 'This will permanently delete your account');
 *
 * // Show an info modal (single button)
 * await modal.info('Information', 'Your changes have been saved');
 *
 * // Custom modal
 * await modal.show({
 *   title: 'Custom Modal',
 *   message: 'This is a custom modal',
 *   type: 'custom',
 *   confirmText: 'Got it',
 *   cancelText: 'Maybe later',
 * });
 * ```
 */
export const useModal = (): ModalContextValue => {
	const context = useContext(ModalContext);

	if (!context) {
		throw new Error("useModal must be used within a ModalProvider");
	}

	return context;
};
