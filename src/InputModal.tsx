import React, {
	useEffect,
	useCallback,
	useRef,
	useState,
	useMemo,
} from "react";
import {
	Animated,
	Text,
	TouchableOpacity,
	View,
	StyleSheet,
	AccessibilityInfo,
	Pressable,
	TextInput,
	Keyboard,
	NativeSyntheticEvent,
	TextInputKeyPressEventData,
	KeyboardAvoidingView,
	Platform,
} from "react-native";

import {
	InputModal as InputModalData,
	InputModalResult,
	DEFAULT_OTP_CONFIG,
	DEFAULT_PIN_CONFIG,
	OtpConfig,
	InputRestrictions,
} from "./inputModalTypes";
import { useModalAnimation } from "./useModalAnimation";
import {
	getModalColors,
	modalContainerStyle,
	modalBackdropStyle,
	modalTitleStyle,
	modalMessageStyle,
	modalIconContainerStyle,
	modalButtonContainerStyle,
	baseButtonStyle,
	buttonTextStyle,
	modalOverlayStyle,
} from "./modalStyles";
import {
	inputContainerStyle,
	inputLabelStyle,
	baseInputStyle,
	inputTextStyle,
	inputFocusedStyle,
	inputErrorStyle,
	errorTextStyle,
	helperTextStyle,
	otpContainerStyle,
	otpTextStyle,
	getOtpBoxStyle,
	matchSuccessTextStyle,
	matchErrorTextStyle,
	characterCounterStyle,
	characterCounterWarningStyle,
	characterCounterErrorStyle,
} from "./inputModalStyles";
import { ModalIcons } from "./modalIcons";

export interface InputModalProps {
	modal: InputModalData;
	onConfirm: (value: string) => void;
	onCancel: () => void;
}

/**
 * Input Modal component with text and OTP input modes
 * Supports various input restrictions and validation options
 */
export const InputModal: React.FC<InputModalProps> = ({
	modal,
	onConfirm,
	onCancel,
}) => {
	const {
		title,
		message,
		type = "confirm",
		confirmText = "Confirm",
		cancelText = "Cancel",
		showCancel = true,
		dismissOnBackdrop = false,
		animationIn = "scale",
		animationOut = "scale",
		animationDuration = 250,
		icon,
		hideIcon = false,
		inputMode = "text",
		placeholder = "",
		defaultValue = "",
		restrictions = {},
		otpConfig: customOtpConfig,
		validateOnChange = false,
		customValidator,
		inputLabel,
		helperText,
		keyboardType,
		autoCapitalize,
		secureTextEntry = false,
		autoFocus = true,
		returnKeyType = "done",
		backgroundColor,
		textColor,
		confirmButtonColor,
		confirmButtonTextColor,
		cancelButtonColor,
		cancelButtonTextColor,
		style,
		titleStyle,
		messageStyle: customMessageStyle,
		inputContainerStyle: customInputContainerStyle,
		inputStyle: customInputStyle,
		errorStyle: customErrorStyle,
		labelStyle: customLabelStyle,
		helperStyle: customHelperStyle,
		confirmButtonStyle,
		cancelButtonStyle,
		accessibilityLabel,
		inputAccessibilityHint,
		rounded = false,
	} = modal;

	const isAnimatingRef = useRef(false);
	const textInputRef = useRef<TextInput>(null);
	const otpInputRefs = useRef<(TextInput | null)[]>([]);

	// State
	const [value, setValue] = useState(defaultValue);
	const [otpValues, setOtpValues] = useState<string[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isFocused, setIsFocused] = useState(false);
	const [focusedOtpIndex, setFocusedOtpIndex] = useState(0);

	// Get OTP config based on input mode
	const otpConfig = useMemo<Required<OtpConfig>>(() => {
		const defaults =
			inputMode === "pin" ? DEFAULT_PIN_CONFIG : DEFAULT_OTP_CONFIG;
		return { ...defaults, ...customOtpConfig };
	}, [inputMode, customOtpConfig]);

	// Initialize OTP values
	useEffect(() => {
		if (inputMode === "otp" || inputMode === "pin") {
			const initialValues = defaultValue
				? defaultValue.split("").slice(0, otpConfig.length)
				: [];
			setOtpValues([
				...initialValues,
				...Array(otpConfig.length - initialValues.length).fill(""),
			]);
		}
	}, [inputMode, otpConfig.length, defaultValue]);

	// Get colors based on type
	const colors = getModalColors(type);
	const finalBackgroundColor = backgroundColor || colors.background;
	const finalTextColor = textColor || colors.text;
	const finalConfirmButtonColor = confirmButtonColor || colors.confirmButton;
	const finalConfirmButtonTextColor =
		confirmButtonTextColor || colors.confirmButtonText;
	const finalCancelButtonColor = cancelButtonColor || colors.cancelButton;
	const finalCancelButtonTextColor =
		cancelButtonTextColor || colors.cancelButtonText;

	// Animation hook
	const {
		backdropOpacity,
		contentOpacity,
		contentScale,
		contentTranslateY,
		startEnterAnimation,
		startExitAnimation,
	} = useModalAnimation(animationIn, animationOut, animationDuration);

	/**
	 * Apply input restrictions to a value
	 */
	const applyRestrictions = useCallback(
		(input: string): string => {
			let result = input;

			// Remove whitespace if not allowed
			if (
				restrictions.allowWhitespace === false ||
				((inputMode === "otp" || inputMode === "pin") &&
					restrictions.allowWhitespace !== true)
			) {
				result = result.replace(/\s/g, "");
			}

			// Apply character filters
			if (restrictions.lettersOnly) {
				result = result.replace(/[^a-zA-Z]/g, "");
			} else if (restrictions.numbersOnly) {
				result = result.replace(/[^0-9]/g, "");
			} else if (restrictions.alphanumericOnly) {
				result = result.replace(/[^a-zA-Z0-9]/g, "");
			}

			// Apply case transformation
			if (restrictions.uppercase) {
				result = result.toUpperCase();
			} else if (restrictions.lowercase) {
				result = result.toLowerCase();
			}

			// Apply max length
			if (
				restrictions.maxLength &&
				result.length > restrictions.maxLength
			) {
				result = result.slice(0, restrictions.maxLength);
			}

			return result;
		},
		[restrictions, inputMode],
	);

	/**
	 * Validate input value
	 */
	const validateInput = useCallback(
		(inputValue: string): string | null => {
			const trimmedValue = restrictions.trimOnSubmit
				? inputValue.trim()
				: inputValue;

			// Min length check
			if (
				restrictions.minLength &&
				trimmedValue.length < restrictions.minLength
			) {
				return `Minimum ${restrictions.minLength} characters required`;
			}

			// Pattern check
			if (
				restrictions.pattern &&
				!restrictions.pattern.test(trimmedValue)
			) {
				return restrictions.patternError || "Invalid input format";
			}

			// Confirmation text check
			if (restrictions.confirmationText) {
				const matches =
					restrictions.caseSensitive !== false
						? trimmedValue === restrictions.confirmationText
						: trimmedValue.toLowerCase() ===
							restrictions.confirmationText.toLowerCase();
				if (!matches) {
					return `Please type "${restrictions.confirmationText}" to confirm`;
				}
			}

			// Custom validator
			if (customValidator) {
				const customError = customValidator(trimmedValue);
				if (customError) return customError;
			}

			return null;
		},
		[restrictions, customValidator],
	);

	/**
	 * Get current input value (text or OTP)
	 */
	const getCurrentValue = useCallback((): string => {
		if (inputMode === "otp" || inputMode === "pin") {
			return otpValues.join("");
		}
		return value;
	}, [inputMode, value, otpValues]);

	/**
	 * Check if confirm button should be disabled
	 */
	const isConfirmDisabled = useMemo(() => {
		const currentValue = getCurrentValue();

		// For OTP/PIN, require all boxes to be filled
		if (inputMode === "otp" || inputMode === "pin") {
			return otpValues.some((v) => v === "");
		}

		// For text with confirmation text, check if it matches
		if (restrictions.confirmationText) {
			const matches =
				restrictions.caseSensitive !== false
					? currentValue === restrictions.confirmationText
					: currentValue.toLowerCase() ===
						restrictions.confirmationText.toLowerCase();
			return !matches;
		}

		// Check min length
		if (
			restrictions.minLength &&
			currentValue.length < restrictions.minLength
		) {
			return true;
		}

		return false;
	}, [inputMode, otpValues, restrictions, getCurrentValue]);

	/**
	 * Handle confirm button press
	 */
	const handleConfirm = useCallback(() => {
		if (isAnimatingRef.current || isConfirmDisabled) return;

		const currentValue = getCurrentValue();
		const finalValue = restrictions.trimOnSubmit
			? currentValue.trim()
			: currentValue;
		const validationError = validateInput(finalValue);

		if (validationError) {
			setError(validationError);
			return;
		}

		isAnimatingRef.current = true;
		Keyboard.dismiss();

		startExitAnimation(() => {
			onConfirm(finalValue);
		});
	}, [
		getCurrentValue,
		validateInput,
		restrictions,
		isConfirmDisabled,
		onConfirm,
		startExitAnimation,
	]);

	/**
	 * Handle cancel button press
	 */
	const handleCancel = useCallback(() => {
		if (isAnimatingRef.current) return;
		isAnimatingRef.current = true;
		Keyboard.dismiss();

		startExitAnimation(() => {
			onCancel();
		});
	}, [onCancel, startExitAnimation]);

	/**
	 * Handle backdrop press
	 */
	const handleBackdropPress = useCallback(() => {
		if (dismissOnBackdrop) {
			handleCancel();
		}
	}, [dismissOnBackdrop, handleCancel]);

	/**
	 * Handle text input change
	 */
	const handleTextChange = useCallback(
		(text: string) => {
			// Handle copy/paste prevention
			if (
				restrictions.disableCopyPaste &&
				text.length > value.length + 1
			) {
				// Likely a paste, reject it
				return;
			}

			const newValue = applyRestrictions(text);
			setValue(newValue);

			if (validateOnChange) {
				setError(validateInput(newValue));
			} else {
				setError(null);
			}
		},
		[
			restrictions,
			value,
			applyRestrictions,
			validateOnChange,
			validateInput,
		],
	);

	/**
	 * Handle OTP box input
	 */
	const handleOtpChange = useCallback(
		(text: string, index: number) => {
			const char = applyRestrictions(text.slice(-1));

			if (!char && text.length === 0) {
				// Backspace - clear current box
				const newValues = [...otpValues];
				newValues[index] = "";
				setOtpValues(newValues);
				return;
			}

			if (!char) return;

			const newValues = [...otpValues];
			newValues[index] = char;
			setOtpValues(newValues);

			// Auto-advance to next box
			if (index < otpConfig.length - 1) {
				otpInputRefs.current[index + 1]?.focus();
				setFocusedOtpIndex(index + 1);
			}

			// Auto-submit if enabled and all filled
			if (otpConfig.autoSubmit && index === otpConfig.length - 1) {
				const allFilled = newValues.every((v) => v !== "");
				if (allFilled) {
					setTimeout(() => {
						handleConfirm();
					}, 100);
				}
			}
		},
		[otpValues, otpConfig, applyRestrictions, handleConfirm],
	);

	/**
	 * Handle OTP key press (for backspace)
	 */
	const handleOtpKeyPress = useCallback(
		(
			e: NativeSyntheticEvent<TextInputKeyPressEventData>,
			index: number,
		) => {
			if (e.nativeEvent.key === "Backspace" && otpValues[index] === "") {
				// Move to previous box on backspace if current is empty
				if (index > 0) {
					otpInputRefs.current[index - 1]?.focus();
					setFocusedOtpIndex(index - 1);
					// Clear the previous box
					const newValues = [...otpValues];
					newValues[index - 1] = "";
					setOtpValues(newValues);
				}
			}
		},
		[otpValues],
	);

	/**
	 * Handle OTP paste
	 */
	const handleOtpPaste = useCallback(
		(text: string) => {
			if (restrictions.disableCopyPaste) return;

			const chars = applyRestrictions(text)
				.split("")
				.slice(0, otpConfig.length);
			const newValues = [
				...chars,
				...Array(otpConfig.length - chars.length).fill(""),
			];
			setOtpValues(newValues);

			// Focus last filled box or first empty
			const lastFilledIndex = chars.length - 1;
			const focusIndex = Math.min(
				lastFilledIndex + 1,
				otpConfig.length - 1,
			);
			otpInputRefs.current[focusIndex]?.focus();
			setFocusedOtpIndex(focusIndex);

			// Auto-submit if all filled
			if (otpConfig.autoSubmit && chars.length === otpConfig.length) {
				setTimeout(() => {
					handleConfirm();
				}, 100);
			}
		},
		[restrictions, applyRestrictions, otpConfig, handleConfirm],
	);

	// Start enter animation and focus input
	useEffect(() => {
		startEnterAnimation();

		// Announce modal content to screen readers
		const announcement = accessibilityLabel || `${title}. ${message}`;
		AccessibilityInfo.announceForAccessibility(announcement);

		// Auto-focus input
		if (autoFocus) {
			setTimeout(() => {
				if (inputMode === "otp" || inputMode === "pin") {
					otpInputRefs.current[0]?.focus();
				} else {
					textInputRef.current?.focus();
				}
			}, 300);
		}
	}, [
		startEnterAnimation,
		title,
		message,
		accessibilityLabel,
		autoFocus,
		inputMode,
	]);

	// Render icon
	const renderIcon = () => {
		if (hideIcon) return null;

		if (icon) {
			return <View style={modalIconContainerStyle}>{icon}</View>;
		}

		const IconComponent = ModalIcons[type];
		if (IconComponent) {
			return (
				<View style={modalIconContainerStyle}>
					<IconComponent color={colors.icon} size={48} />
				</View>
			);
		}

		return null;
	};

	// Render confirmation text indicator
	const renderConfirmationIndicator = () => {
		if (!restrictions.confirmationText || inputMode !== "text") return null;

		const currentValue = getCurrentValue();
		const matches =
			restrictions.caseSensitive !== false
				? currentValue === restrictions.confirmationText
				: currentValue.toLowerCase() ===
					restrictions.confirmationText.toLowerCase();

		return (
			<View style={styles.matchIndicator}>
				<Text
					style={
						matches ? matchSuccessTextStyle : matchErrorTextStyle
					}
				>
					{matches
						? "✓ Text matches"
						: `Type "${restrictions.confirmationText}"`}
				</Text>
			</View>
		);
	};

	// Render character counter
	const renderCharacterCounter = () => {
		if (!restrictions.maxLength && !restrictions.minLength) return null;
		if (inputMode !== "text") return null;

		const currentLength = value.length;
		const maxLength = restrictions.maxLength;
		const minLength = restrictions.minLength || 0;

		let counterStyle = characterCounterStyle;
		if (maxLength && currentLength >= maxLength * 0.9) {
			counterStyle = characterCounterWarningStyle;
		}
		if (maxLength && currentLength >= maxLength) {
			counterStyle = characterCounterErrorStyle;
		}

		return (
			<Text style={counterStyle}>
				{currentLength}
				{maxLength ? ` / ${maxLength}` : ` (min: ${minLength})`}
			</Text>
		);
	};

	// Render text input
	const renderTextInput = () => {
		const hasError = error !== null;

		// Determine keyboard type based on restrictions
		let finalKeyboardType = keyboardType;
		if (!finalKeyboardType) {
			if (restrictions.numbersOnly) {
				finalKeyboardType = "numeric";
			}
		}

		// Determine auto-capitalize based on restrictions
		let finalAutoCapitalize = autoCapitalize;
		if (!finalAutoCapitalize) {
			if (restrictions.uppercase) {
				finalAutoCapitalize = "characters";
			} else if (restrictions.lowercase) {
				finalAutoCapitalize = "none";
			}
		}

		return (
			<View style={[inputContainerStyle, customInputContainerStyle]}>
				{inputLabel && (
					<Text style={[inputLabelStyle, customLabelStyle]}>
						{inputLabel}
					</Text>
				)}
				<TextInput
					ref={textInputRef}
					style={[
						baseInputStyle,
						inputTextStyle,
						isFocused && inputFocusedStyle,
						hasError && inputErrorStyle,
						customInputStyle,
					]}
					value={value}
					onChangeText={handleTextChange}
					onFocus={() => setIsFocused(true)}
					onBlur={() => setIsFocused(false)}
					placeholder={placeholder}
					placeholderTextColor="#9CA3AF"
					keyboardType={finalKeyboardType}
					autoCapitalize={finalAutoCapitalize}
					secureTextEntry={secureTextEntry}
					returnKeyType={returnKeyType}
					onSubmitEditing={handleConfirm}
					contextMenuHidden={restrictions.disableCopyPaste}
					accessibilityLabel={inputLabel || "Input field"}
					accessibilityHint={
						inputAccessibilityHint ||
						(restrictions.confirmationText
							? `Type ${restrictions.confirmationText} to confirm`
							: undefined)
					}
				/>
				{renderConfirmationIndicator()}
				{renderCharacterCounter()}
				{helperText && !error && (
					<Text style={[helperTextStyle, customHelperStyle]}>
						{helperText}
					</Text>
				)}
				{error && (
					<Text style={[errorTextStyle, customErrorStyle]}>
						{error}
					</Text>
				)}
			</View>
		);
	};

	// Render OTP/PIN input
	const renderOtpInput = () => {
		const hasError = error !== null;

		return (
			<View style={[inputContainerStyle, customInputContainerStyle]}>
				{inputLabel && (
					<Text style={[inputLabelStyle, customLabelStyle]}>
						{inputLabel}
					</Text>
				)}
				<View style={[otpContainerStyle, { gap: otpConfig.boxGap }]}>
					{Array.from({ length: otpConfig.length }).map(
						(_, index) => {
							const isFocusedBox =
								focusedOtpIndex === index && isFocused;
							const isFilled = otpValues[index] !== "";

							return (
								<TextInput
									key={index}
									ref={(ref) =>
										(otpInputRefs.current[index] = ref)
									}
									style={[
										getOtpBoxStyle(
											isFocusedBox,
											isFilled,
											hasError,
											{
												boxWidth: otpConfig.boxWidth,
												boxHeight: otpConfig.boxHeight,
												boxBorderRadius:
													otpConfig.boxBorderRadius,
												activeBorderColor:
													otpConfig.activeBorderColor,
												inactiveBorderColor:
													otpConfig.inactiveBorderColor,
												filledBackgroundColor:
													otpConfig.filledBackgroundColor,
												emptyBackgroundColor:
													otpConfig.emptyBackgroundColor,
												errorBorderColor:
													otpConfig.errorBorderColor,
											},
										),
										otpTextStyle,
										{
											color: otpConfig.textColor,
											fontSize: otpConfig.fontSize,
										},
										customInputStyle,
									]}
									value={
										otpConfig.masked && otpValues[index]
											? "●"
											: otpValues[index]
									}
									onChangeText={(text) => {
										// Check if this is a paste action (more than 1 char)
										if (text.length > 1) {
											handleOtpPaste(text);
										} else {
											handleOtpChange(text, index);
										}
									}}
									onKeyPress={(e) =>
										handleOtpKeyPress(e, index)
									}
									onFocus={() => {
										setIsFocused(true);
										setFocusedOtpIndex(index);
									}}
									onBlur={() => setIsFocused(false)}
									keyboardType={
										restrictions.numbersOnly !== false
											? "numeric"
											: "default"
									}
									maxLength={1}
									selectTextOnFocus
									contextMenuHidden={
										restrictions.disableCopyPaste
									}
									accessibilityLabel={`${inputMode === "pin" ? "PIN" : "Code"} digit ${index + 1} of ${otpConfig.length}`}
								/>
							);
						},
					)}
				</View>
				{helperText && !error && (
					<Text
						style={[
							helperTextStyle,
							{ textAlign: "center" },
							customHelperStyle,
						]}
					>
						{helperText}
					</Text>
				)}
				{error && (
					<Text
						style={[
							errorTextStyle,
							{ textAlign: "center" },
							customErrorStyle,
						]}
					>
						{error}
					</Text>
				)}
			</View>
		);
	};

	// Accessibility label for the modal
	const modalAccessibilityLabel =
		accessibilityLabel || `${title}. ${message}`;

	return (
		<View style={modalOverlayStyle} pointerEvents="box-none">
			{/* Backdrop */}
			<Animated.View
				style={[
					modalBackdropStyle,
					{
						opacity: backdropOpacity,
					},
				]}
			>
				<Pressable
					style={StyleSheet.absoluteFill}
					onPress={handleBackdropPress}
					accessibilityRole="button"
					accessibilityLabel="Close modal"
					accessibilityHint="Double tap to cancel and close this dialog"
				/>
			</Animated.View>

			{/* Modal Content with Keyboard Avoidance */}
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}
				style={styles.keyboardAvoidingContainer}
				pointerEvents="box-none"
			>
				<Animated.View
					style={[
						styles.centeredContainer,
						{
							opacity: contentOpacity,
							transform: [
								{ scale: contentScale },
								{ translateY: contentTranslateY },
							],
						},
					]}
					pointerEvents="box-none"
				>
					<View
						style={[
							modalContainerStyle,
							{ backgroundColor: finalBackgroundColor },
							// Apply rounded corners only if rounded is true, otherwise no border radius
							!rounded && styles.fullWidthModal,
							style,
						]}
						accessibilityRole="alert"
						accessibilityLabel={modalAccessibilityLabel}
						accessibilityViewIsModal={true}
					>
						{/* Icon */}
						{renderIcon()}

						{/* Title */}
						<Text
							style={[
								modalTitleStyle,
								{ color: finalTextColor },
								titleStyle,
							]}
							accessibilityRole="header"
							numberOfLines={2}
						>
							{title}
						</Text>

						{/* Message */}
						<Text
							style={[
								modalMessageStyle,
								{ color: finalTextColor },
								customMessageStyle,
							]}
							numberOfLines={4}
						>
							{message}
						</Text>

						{/* Input */}
						{inputMode === "text"
							? renderTextInput()
							: renderOtpInput()}

						{/* Buttons */}
						<View style={modalButtonContainerStyle}>
							{/* Cancel Button */}
							{showCancel && (
								<TouchableOpacity
									style={[
										baseButtonStyle,
										{
											backgroundColor:
												finalCancelButtonColor,
										},
										cancelButtonStyle,
									]}
									onPress={handleCancel}
									accessibilityRole="button"
									accessibilityLabel={cancelText}
									accessibilityHint="Double tap to cancel"
									activeOpacity={0.8}
								>
									<Text
										style={[
											buttonTextStyle,
											{
												color: finalCancelButtonTextColor,
											},
										]}
									>
										{cancelText}
									</Text>
								</TouchableOpacity>
							)}

							{/* Confirm Button */}
							<TouchableOpacity
								style={[
									baseButtonStyle,
									{
										backgroundColor:
											finalConfirmButtonColor,
									},
									isConfirmDisabled && styles.disabledButton,
									confirmButtonStyle,
								]}
								onPress={handleConfirm}
								disabled={isConfirmDisabled}
								accessibilityRole="button"
								accessibilityLabel={confirmText}
								accessibilityHint={
									isConfirmDisabled
										? "Button disabled until input is complete"
										: "Double tap to confirm"
								}
								accessibilityState={{
									disabled: isConfirmDisabled,
								}}
								activeOpacity={0.8}
							>
								<Text
									style={[
										buttonTextStyle,
										{ color: finalConfirmButtonTextColor },
										isConfirmDisabled &&
											styles.disabledButtonText,
									]}
								>
									{confirmText}
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Animated.View>
			</KeyboardAvoidingView>
		</View>
	);
};

const styles = StyleSheet.create({
	keyboardAvoidingContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
	},
	centeredContainer: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		pointerEvents: "box-none",
	},
	fullWidthModal: {
		borderRadius: 0,
		marginHorizontal: 0,
		maxWidth: "100%",
	},
	matchIndicator: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 8,
	},
	disabledButton: {
		opacity: 0.5,
	},
	disabledButtonText: {
		opacity: 0.7,
	},
});
