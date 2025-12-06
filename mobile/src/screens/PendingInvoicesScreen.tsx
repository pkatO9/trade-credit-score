import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import client from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'PendingInvoices'>;

type Invoice = {
    _id: string;
    totalAmount: number;
    outstandingAmount: number;
    amountPaid: number;
    status: string;
    dueDate: string;
    items: { description: string }[];
    buyerId: { name: string };
};

export default function PendingInvoicesScreen({ navigation }: Props) {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchInvoices = async () => {
        try {
            const response = await client.get('/invoices');
            // Filter for pending or partially_paid
            const pending = response.data.filter((inv: Invoice) =>
                inv.status === 'pending' || inv.status === 'partially_paid'
            );
            setInvoices(pending);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchInvoices();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchInvoices();
    };

    const renderItem = ({ item }: { item: Invoice }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('InvoiceDetail', { invoiceId: item._id })}
        >
            <View style={styles.cardHeader}>
                <View>
                    <Text style={styles.amount}>${item.status === 'partially_paid' ? item.outstandingAmount : item.totalAmount}</Text>
                    {item.status === 'partially_paid' && <Text style={styles.subtext}>Outstanding</Text>}
                </View>
                <Text style={[styles.status, { color: item.status === 'partially_paid' ? 'orange' : 'red' }]}>
                    {item.status.toUpperCase()}
                </Text>
            </View>
            <Text style={styles.buyerName}>{item.buyerId?.name || 'Unknown Buyer'}</Text>
            <Text style={styles.date}>Due: {new Date(item.dueDate).toLocaleDateString()}</Text>
            <Text style={styles.items} numberOfLines={1}>
                {item.items.map(i => i.description).join(', ')}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            {loading ? (
                <ActivityIndicator size="large" style={styles.center} />
            ) : (
                <FlatList
                    data={invoices}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text style={styles.emptyText}>No pending invoices!</Text>
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
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subtext: {
        fontSize: 10,
        color: '#666',
    },
    buyerName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    status: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 5,
    },
    date: {
        color: '#666',
        marginBottom: 5,
    },
    items: {
        color: '#888',
        fontStyle: 'italic',
    },
    emptyText: {
        fontSize: 16,
        color: '#888',
    },
});
