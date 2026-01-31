import React from "react";
import {
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { useModal, useToast } from "react-native-earl-toastify";
import Toast from "../utils/Toast";

export default function ToastShowcase() {
	const toast = useToast();
	const modal = useModal();

	const toastVariable = "Success!";

	return (
		<ScrollView style={styles.container}>
			<Text style={styles.header}>Earl Toastify</Text>
			<Text style={styles.subTitle}>Toast & Modal Showcase</Text>

			{/* DEFAULT TOASTS */}
			<Text style={styles.sectionTitle}>
				Default Toasts (useToast hook)
			</Text>
			<TouchableOpacity
				style={[styles.button, styles.successBtn]}
				onPress={() =>
					toast.success(
						toastVariable,
						"Operation completed successfully",
					)
				}
			>
				<Text style={styles.buttonText}>Success</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.warningBtn]}
				onPress={() =>
					toast.warning("Warning!", "Please review your input")
				}
			>
				<Text style={styles.buttonText}>Warning</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.errorBtn]}
				onPress={() => toast.error("Error!", "Something went wrong")}
			>
				<Text style={styles.buttonText}>Error</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.infoBtn]}
				onPress={() =>
					toast.info("Info", "Here's some useful information")
				}
			>
				<Text style={styles.buttonText}>Info</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.defaultBtn]}
				onPress={() =>
					toast.show({
						message: "Default toast message",
						type: "default",
					})
				}
			>
				<Text style={styles.buttonText}>Show (Default)</Text>
			</TouchableOpacity>

			{/* CUSTOMIZED TOASTS */}
			<Text style={styles.sectionTitle}>
				Customized Toasts (Toast utility)
			</Text>
			<TouchableOpacity
				style={[styles.button, styles.customSuccessBtn]}
				onPress={() =>
					Toast.success(
						"Custom Success!",
						"With custom animation & position",
					)
				}
			>
				<Text style={styles.buttonText}>Custom Success</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.customWarningBtn]}
				onPress={() =>
					Toast.warning("Custom Warning!", "Slides from right → left")
				}
			>
				<Text style={styles.buttonText}>Custom Warning</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.customErrorBtn]}
				onPress={() =>
					Toast.error("Custom Error!", "With fade animation")
				}
			>
				<Text style={styles.buttonText}>Custom Error</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.customInfoBtn]}
				onPress={() =>
					Toast.info("Custom Info!", "Slides from left → right")
				}
			>
				<Text style={styles.buttonText}>Custom Info</Text>
			</TouchableOpacity>

			{/* SPECIAL CASES */}
			<Text style={styles.sectionTitle}>Special Cases</Text>
			<TouchableOpacity
				style={[styles.button, styles.specialBtn]}
				onPress={() => toast.success("No description, just title")}
			>
				<Text style={styles.buttonText}>Title Only</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.specialBtn]}
				onPress={() =>
					toast.show({
						message: "Bottom positioned toast",
						position: "bottom",
						type: "info",
					})
				}
			>
				<Text style={styles.buttonText}>Bottom Position</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.specialBtn]}
				onPress={() =>
					toast.show({
						message: "Centered toast",
						position: "center",
						type: "success",
					})
				}
			>
				<Text style={styles.buttonText}>Center Position</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.specialBtn]}
				onPress={() =>
					toast.show({
						message: "Long duration (10s)",
						duration: 10000,
						type: "warning",
					})
				}
			>
				<Text style={styles.buttonText}>Long Duration</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, { backgroundColor: "#8B5CF6" }]}
				onPress={() =>
					toast.show({
						title: "Custom Styled!",
						message: "Purple custom toast",
						type: "custom",
						backgroundColor: "#EDE9FE",
						textColor: "#5B21B6",
						borderColor: "#8B5CF6",
						animationIn: "up",
						animationOut: "fade",
					})
				}
			>
				<Text style={styles.buttonText}>Custom Styled</Text>
			</TouchableOpacity>

			{/* CONFIRMATION MODALS */}
			<Text style={styles.sectionTitle}>Confirmation Modals</Text>
			<TouchableOpacity
				style={[styles.button, styles.modalConfirmBtn]}
				onPress={async () => {
					const confirmed = await modal.confirm(
						"Confirm Action",
						"Are you sure you want to proceed with this action?",
					);
					if (confirmed) {
						toast.success("Confirmed!", "Action was confirmed");
					} else {
						toast.info("Cancelled", "Action was cancelled");
					}
				}}
			>
				<Text style={styles.buttonText}>Confirm Modal</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.modalWarningBtn]}
				onPress={async () => {
					const proceed = await modal.warning(
						"Warning",
						"This action may have unintended consequences. Do you want to continue?",
					);
					if (proceed) {
						toast.warning("Proceeded", "You chose to continue");
					}
				}}
			>
				<Text style={styles.buttonText}>Warning Modal</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.modalDangerBtn]}
				onPress={async () => {
					const deleted = await modal.danger(
						"Delete Item",
						"This will permanently delete this item. This action cannot be undone.",
						{
							confirmText: "Delete Forever",
							cancelText: "Keep Item",
						},
					);
					if (deleted) {
						toast.error("Deleted!", "Item was permanently deleted");
					}
				}}
			>
				<Text style={styles.buttonText}>Danger Modal</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.modalInfoBtn]}
				onPress={async () => {
					await modal.info(
						"Information",
						"This is an informational message. Only one button to dismiss.",
					);
					toast.info("Dismissed", "Info modal was closed");
				}}
			>
				<Text style={styles.buttonText}>Info Modal</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.modalCustomBtn]}
				onPress={async () => {
					const result = await modal.show({
						title: "Premium Feature",
						message: "Upgrade to Pro to unlock all features!",
						type: "custom",
						confirmText: "Upgrade Now",
						cancelText: "Maybe Later",
						confirmButtonColor: "#8B5CF6",
						confirmButtonTextColor: "#FFFFFF",
						animationIn: "slide",
						animationOut: "fade",
					});
					if (result) {
						toast.success(
							"Upgrading!",
							"Taking you to checkout...",
						);
					}
				}}
			>
				<Text style={styles.buttonText}>Custom Modal</Text>
			</TouchableOpacity>

			{/* INPUT MODALS */}
			<Text style={styles.sectionTitle}>Input Modals (NEW!)</Text>
			<TouchableOpacity
				style={[styles.button, styles.inputConfirmTextBtn]}
				onPress={async () => {
					const result = await modal.confirmWithText(
						"Delete Account",
						"This action is permanent. Type DELETE to confirm.",
						"DELETE",
						{
							type: "danger",
							confirmText: "Delete Forever",
							restrictions: {
								uppercase: true,
								caseSensitive: false,
							},
						},
					);
					if (result.confirmed) {
						toast.error("Deleted!", `You typed: ${result.value}`);
					} else {
						toast.info("Cancelled", "Account deletion cancelled");
					}
				}}
			>
				<Text style={styles.buttonText}>Confirm with Text</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.inputOtpBtn]}
				onPress={async () => {
					const result = await modal.otp(
						"Verify Email",
						"Enter the 6-digit code sent to your email",
						{
							helperText:
								"Check your spam folder if not received",
							otpConfig: {
								length: 6,
								autoSubmit: true,
							},
						},
					);
					if (result.confirmed) {
						toast.success("Verified!", `Code: ${result.value}`);
					} else {
						toast.info("Cancelled", "Verification cancelled");
					}
				}}
			>
				<Text style={styles.buttonText}>OTP Input (6 digits)</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.inputPinBtn]}
				onPress={async () => {
					const result = await modal.pin(
						"Enter PIN",
						"Enter your 4-digit security PIN",
						{
							otpConfig: {
								length: 4,
								masked: true,
							},
							restrictions: {
								disableCopyPaste: true,
							},
						},
					);
					if (result.confirmed) {
						toast.success("PIN Accepted!", "Access granted");
					} else {
						toast.warning("Cancelled", "PIN entry cancelled");
					}
				}}
			>
				<Text style={styles.buttonText}>PIN Input (Masked)</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.inputCustomBtn]}
				onPress={async () => {
					const result = await modal.input({
						title: "Transfer Funds",
						message: "Enter the amount to transfer",
						inputLabel: "Amount ($)",
						placeholder: "0.00",
						keyboardType: "decimal-pad",
						restrictions: {
							numbersOnly: false,
							maxLength: 10,
						},
						customValidator: (value) => {
							const amount = parseFloat(value);
							if (isNaN(amount) || amount <= 0)
								return "Please enter a valid amount";
							if (amount > 10000)
								return "Maximum transfer is $10,000";
							return null;
						},
						confirmText: "Transfer",
						type: "confirm",
					});
					if (result.confirmed) {
						toast.success(
							"Transferred!",
							`$${result.value} sent successfully`,
						);
					}
				}}
			>
				<Text style={styles.buttonText}>Custom Input (Amount)</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.inputLettersBtn]}
				onPress={async () => {
					const result = await modal.input({
						title: "Enter Your Name",
						message: "Please enter your first name",
						inputLabel: "First Name",
						placeholder: "John",
						restrictions: {
							lettersOnly: true,
							minLength: 2,
							maxLength: 30,
						},
						confirmText: "Submit",
					});
					if (result.confirmed) {
						toast.success("Hello!", `Welcome, ${result.value}!`);
					}
				}}
			>
				<Text style={styles.buttonText}>Letters Only Input</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.inputNoPasteBtn]}
				onPress={async () => {
					const result = await modal.input({
						title: "Secure Code",
						message: "Enter the code manually (no paste)",
						inputMode: "otp",
						otpConfig: {
							length: 4,
						},
						restrictions: {
							numbersOnly: true,
							disableCopyPaste: true,
						},
						type: "warning",
						helperText: "Copy/paste is disabled for security",
					});
					if (result.confirmed) {
						toast.success(
							"Code Accepted!",
							`Code: ${result.value}`,
						);
					}
				}}
			>
				<Text style={styles.buttonText}>No Paste (Security)</Text>
			</TouchableOpacity>

			{/* MODAL ANIMATIONS */}
			<Text style={styles.sectionTitle}>Modal Animations</Text>
			<TouchableOpacity
				style={[styles.button, styles.animationBtn]}
				onPress={() =>
					modal.confirm(
						"Scale Animation",
						"This uses the default scale animation",
						{
							animationIn: "scale",
							animationOut: "scale",
						},
					)
				}
			>
				<Text style={styles.buttonText}>Scale (Default)</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.animationBtn]}
				onPress={() =>
					modal.confirm("Fade Animation", "Smooth fade in and out", {
						animationIn: "fade",
						animationOut: "fade",
					})
				}
			>
				<Text style={styles.buttonText}>Fade Animation</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.animationBtn]}
				onPress={() =>
					modal.confirm(
						"Slide Animation",
						"Slides up from the bottom",
						{
							animationIn: "slide",
							animationOut: "slide",
						},
					)
				}
			>
				<Text style={styles.buttonText}>Slide Animation</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={[styles.button, styles.animationBtn]}
				onPress={() =>
					modal.confirm("No Animation", "Instant appear/disappear", {
						animationIn: "none",
						animationOut: "none",
					})
				}
			>
				<Text style={styles.buttonText}>No Animation</Text>
			</TouchableOpacity>

			<View style={{ height: 50 }} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F9FAFB", padding: 20 },
	header: {
		fontSize: 28,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 5,
		marginTop: 40,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		marginTop: 24,
		marginBottom: 12,
		color: "#374151",
	},
	subTitle: {
		fontSize: 16,
		fontWeight: "400",
		marginTop: 12,
		marginBottom: 12,
		color: "#374151",
		textAlign: "center",
	},
	button: {
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
	},
	buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
	successBtn: { backgroundColor: "#10B981" },
	warningBtn: { backgroundColor: "#F59E0B" },
	errorBtn: { backgroundColor: "#EF4444" },
	infoBtn: { backgroundColor: "#3B82F6" },
	defaultBtn: { backgroundColor: "#6B7280" },
	customSuccessBtn: { backgroundColor: "#059669" },
	customWarningBtn: { backgroundColor: "#D97706" },
	customErrorBtn: { backgroundColor: "#DC2626" },
	customInfoBtn: { backgroundColor: "#2563EB" },
	specialBtn: { backgroundColor: "#6366F1" },
	// Modal button styles
	modalConfirmBtn: { backgroundColor: "#3B82F6" },
	modalWarningBtn: { backgroundColor: "#F59E0B" },
	modalDangerBtn: { backgroundColor: "#EF4444" },
	modalInfoBtn: { backgroundColor: "#6366F1" },
	modalCustomBtn: { backgroundColor: "#8B5CF6" },
	animationBtn: { backgroundColor: "#14B8A6" },
	// Input Modal button styles
	inputConfirmTextBtn: { backgroundColor: "#DC2626" },
	inputOtpBtn: { backgroundColor: "#0891B2" },
	inputPinBtn: { backgroundColor: "#7C3AED" },
	inputCustomBtn: { backgroundColor: "#059669" },
	inputLettersBtn: { backgroundColor: "#EA580C" },
	inputNoPasteBtn: { backgroundColor: "#BE185D" },
});
