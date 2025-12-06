import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyOtp'>;

export default function VerifyOtpScreen({ route, navigation }: Props) {
    const { phone, requestId } = route.params;
    const [otp, setOtp] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { verifyOtp } = useAuth();

    const handleVerify = async () => {
        if (!otp) {
            Alert.alert('Error', 'Please enter OTP');
            return;
        }

        try {
            setIsSubmitting(true);
            await verifyOtp(phone, requestId, otp);
            // AuthContext will update userToken, and navigation will automatically switch to Home
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Invalid OTP');
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Verify OTP</Text>
                <Text style={styles.subtitle}>Enter the code sent to {phone}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="123456"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                />

                {isSubmitting ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <Button title="Verify" onPress={handleVerify} />
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
        fontSize: 28,
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
        textAlign: 'center',
        letterSpacing: 5,
    },
});
