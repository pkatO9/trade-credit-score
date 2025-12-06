import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import client from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

type Notification = {
    _id: string;
    type: string;
    message: string;
    date: string;
    invoiceId?: { totalAmount: number; outstandingAmount: number; status: string; dueDate: string };
    contactId?: { name: string };
};

export default function NotificationsScreen({ navigation }: Props) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await client.get('/notifications');
            setNotifications(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchNotifications();
    };

    const triggerReminders = async () => {
        try {
            setLoading(true);
            await client.post('/jobs/send-due-reminders'); // Trigger the background job
            // Wait a moment for the job to process (since it's async queue)
            setTimeout(() => {
                fetchNotifications();
            }, 2000);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to trigger reminders');
            setLoading(false);
        }
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.type}>{item.type.replace('_', ' ').toUpperCase()}</Text>
                <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
            {item.invoiceId && (
                <View style={styles.details}>
                    <Text style={styles.detailText}>Due Date: {new Date(item.invoiceId.dueDate).toLocaleDateString()}</Text>
                    <Text style={styles.detailText}>Outstanding: ${item.invoiceId.outstandingAmount}</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.actionContainer}>
                <Button title="Check for Reminders" onPress={triggerReminders} />
            </View>
            {loading ? (
                <ActivityIndicator size="large" style={styles.center} />
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No notifications</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 15,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    type: {
        fontWeight: 'bold',
        color: '#007bff',
        fontSize: 12,
    },
    date: {
        fontSize: 12,
        color: '#999',
    },
    message: {
        fontSize: 16,
        marginBottom: 5,
    },
    details: {
        marginTop: 5,
        paddingTop: 5,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    detailText: {
        fontSize: 12,
        color: '#666',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
    actionContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});
