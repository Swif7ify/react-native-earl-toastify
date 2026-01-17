// screens/ToastShowcase.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useToast } from 'react-native-earl-toastify';
import Toast from '../utils/Toast';

export const ToastShowcase = () => {
    const toast = useToast();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}> Toast Showcase</Text>

            {/* DEFAULT TOASTS */}
            <Text style={styles.sectionTitle}>Default Toasts (useToast hook)</Text>

            <TouchableOpacity
                style={[styles.button, styles.successBtn]}
                onPress={() => toast.success('Success!', 'Operation completed successfully')}>
                <Text style={styles.buttonText}>Success</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.warningBtn]}
                onPress={() => toast.warning('Warning!', 'Please review your input')}>
                <Text style={styles.buttonText}>Warning</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.errorBtn]}
                onPress={() => toast.error('Error!', 'Something went wrong')}>
                <Text style={styles.buttonText}>Error</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.infoBtn]}
                onPress={() => toast.info('Info', "Here's some useful information")}>
                <Text style={styles.buttonText}>Info</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.defaultBtn]}
                onPress={() => toast.show({ message: 'Default toast message', type: 'default' })}>
                <Text style={styles.buttonText}>Show (Default)</Text>
            </TouchableOpacity>

            {/* CUSTOMIZED TOASTS */}
            <Text style={styles.sectionTitle}>Customized Toasts (Toast utility)</Text>

            <TouchableOpacity
                style={[styles.button, styles.customSuccessBtn]}
                onPress={() =>
                    Toast.success('Custom Success!', 'With custom animation & position')
                }>
                <Text style={styles.buttonText}>Custom Success</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.customWarningBtn]}
                onPress={() => Toast.warning('Custom Warning!', 'Slides from right → left')}>
                <Text style={styles.buttonText}>Custom Warning</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.customErrorBtn]}
                onPress={() => Toast.error('Custom Error!', 'With fade animation')}>
                <Text style={styles.buttonText}>Custom Error</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.customInfoBtn]}
                onPress={() => Toast.info('Custom Info!', 'Slides from left → right')}>
                <Text style={styles.buttonText}>Custom Info</Text>
            </TouchableOpacity>

            {/* SPECIAL CASES */}
            <Text style={styles.sectionTitle}>Special Cases</Text>

            <TouchableOpacity
                style={[styles.button, styles.specialBtn]}
                onPress={() => toast.success('No description, just title')}>
                <Text style={styles.buttonText}>Title Only</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.specialBtn]}
                onPress={() =>
                    toast.show({
                        message: 'Bottom positioned toast',
                        position: 'bottom',
                        type: 'info',
                    })
                }>
                <Text style={styles.buttonText}>Bottom Position</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.specialBtn]}
                onPress={() =>
                    toast.show({ message: 'Centered toast', position: 'center', type: 'success' })
                }>
                <Text style={styles.buttonText}>Center Position</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, styles.specialBtn]}
                onPress={() =>
                    toast.show({ message: 'Long duration (10s)', duration: 10000, type: 'warning' })
                }>
                <Text style={styles.buttonText}>Long Duration</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, { backgroundColor: '#8B5CF6' }]}
                onPress={() =>
                    toast.show({
                        title: 'Custom Styled!',
                        message: 'Purple custom toast',
                        type: 'custom',
                        backgroundColor: '#EDE9FE',
                        textColor: '#5B21B6',
                        borderColor: '#8B5CF6',
                        animationIn: 'up',
                        animationOut: 'fade',
                    })
                }>
                <Text style={styles.buttonText}>Custom Styled</Text>
            </TouchableOpacity>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB', padding: 20 },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 24,
        marginBottom: 12,
        color: '#374151',
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
    successBtn: { backgroundColor: '#10B981' },
    warningBtn: { backgroundColor: '#F59E0B' },
    errorBtn: { backgroundColor: '#EF4444' },
    infoBtn: { backgroundColor: '#3B82F6' },
    defaultBtn: { backgroundColor: '#6B7280' },
    customSuccessBtn: { backgroundColor: '#059669' },
    customWarningBtn: { backgroundColor: '#D97706' },
    customErrorBtn: { backgroundColor: '#DC2626' },
    customInfoBtn: { backgroundColor: '#2563EB' },
    specialBtn: { backgroundColor: '#6366F1' },
});
