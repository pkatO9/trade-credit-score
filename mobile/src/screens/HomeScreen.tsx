import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../api/client';

import { RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await client.get('/users/me');
            setProfile(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Home</Text>
                <Button title="Logout" onPress={logout} color="red" />
            </View>

            <View style={styles.content}>
                <Text style={styles.welcome}>Welcome,</Text>
                <Text style={styles.name}>{profile?.name || 'User'}</Text>
                <Text style={styles.phone}>{profile?.phone}</Text>

                <View style={styles.actions}>
                    <View style={styles.actionButton}>
                        <Button title="Create Invoice" onPress={() => navigation.navigate('CreateInvoice')} />
                    </View>
                    <View style={styles.actionButton}>
                        <Button title="My Contacts" onPress={() => navigation.navigate('Contacts')} />
                    </View>
                    <View style={styles.actionButton}>
                        <Button title="Pending Invoices" onPress={() => navigation.navigate('PendingInvoices')} color="orange" />
                    </View>
                    <View style={styles.actionButton}>
                        <Button title="Notifications" onPress={() => navigation.navigate('Notifications')} color="#007bff" />
                    </View>
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    welcome: {
        fontSize: 18,
        color: '#666',
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    phone: {
        fontSize: 16,
        color: '#888',
        marginBottom: 30,
    },
    actions: {
        gap: 15,
    },
    actionButton: {
        marginBottom: 10,
    }
});
