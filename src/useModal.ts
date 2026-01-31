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
 * // ============ Confirmation Modals ============
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
 *
 * // ============ Input Modals ============
 *
 * // Text input with confirmation text requirement
 * const result = await modal.confirmWithText(
 *   'Delete Account',
 *   'Type DELETE to confirm account deletion',
 *   'DELETE',
 *   { caseSensitive: false }
 * );
 * if (result.confirmed) {
 *   // User typed "DELETE" and confirmed
 * }
 *
 * // OTP/Verification code input
 * const otpResult = await modal.otp(
 *   'Verify Email',
 *   'Enter the 6-digit code sent to your email',
 *   { otpConfig: { length: 6, autoSubmit: true } }
 * );
 * if (otpResult.confirmed) {
 *   console.log('Code:', otpResult.value); // e.g., "123456"
 * }
 *
 * // PIN input (masked by default)
 * const pinResult = await modal.pin(
 *   'Enter PIN',
 *   'Enter your 4-digit PIN',
 *   { otpConfig: { length: 4 } }
 * );
 *
 * // Custom input modal
 * const inputResult = await modal.input({
 *   title: 'Enter Amount',
 *   message: 'How much would you like to transfer?',
 *   placeholder: '0.00',
 *   keyboardType: 'numeric',
 *   restrictions: {
 *     numbersOnly: true,
 *     maxLength: 10,
 *   },
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
