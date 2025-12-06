import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import client from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'AddContact'>;

export default function AddContactScreen({ navigation }: Props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!name || !phone) {
            Alert.alert('Error', 'Name and Phone are required');
            return;
        }

        try {
            setIsSubmitting(true);
            await client.post('/contacts', { name, phone, email });
            Alert.alert('Success', 'Contact created successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create contact');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.form}>
                <Text style={styles.label}>Name</Text>
                <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" />

                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1234567890" keyboardType="phone-pad" />

                <Text style={styles.label}>Email (Optional)</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="john@example.com" keyboardType="email-address" />

                <View style={styles.buttonContainer}>
                    {isSubmitting ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button title="Save Contact" onPress={handleSubmit} />
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    form: {
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 30,
    }
});
