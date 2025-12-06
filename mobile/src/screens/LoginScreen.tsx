import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { requestOtp } = useAuth();

    const handleSendOtp = async () => {
        if (!phone) {
            Alert.alert('Error', 'Please enter a phone number');
            return;
        }

        try {
            setIsSubmitting(true);
            const requestId = await requestOtp(phone);
            navigation.navigate('VerifyOtp', { phone, requestId });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to send OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Trade Cred</Text>
                <Text style={styles.subtitle}>Enter your phone number to continue</Text>

                <TextInput
                    style={styles.input}
                    placeholder="+1234567890"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                />

                {isSubmitting ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Send OTP" onPress={handleSendOtp} />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 20,
        justifyContent: 'center',
        flex: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 20,
        fontSize: 16,
    },
});
