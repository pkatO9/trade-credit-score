import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Modal, TextInput, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import client from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceDetail'>;

type Invoice = {
    _id: string;
    totalAmount: number;
    outstandingAmount: number;
    status: string;
    dueDate: string;
    items: { description: string; quantity: number; rate: number; amount: number }[];
};

export default function InvoiceDetailScreen({ route, navigation }: Props) {
    const { invoiceId } = route.params;
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    // Payment State
    const [modalVisible, setModalVisible] = useState(false);
    const [amount, setAmount] = useState('');
    const [mode, setMode] = useState<'cash' | 'upi'>('cash');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchInvoice = async () => {
        try {
            const response = await client.get(`/invoices/${invoiceId}`);
            setInvoice(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, [invoiceId]);

    const handlePayment = async () => {
        if (!amount || isNaN(Number(amount))) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        try {
            setIsSubmitting(true);
            await client.post(`/invoices/${invoiceId}/payments`, {
                amount: Number(amount),
                mode: mode,
                date: new Date().toISOString(),
            });
            setModalVisible(false);
            setAmount('');
            fetchInvoice(); // Refresh data
            Alert.alert('Success', 'Payment recorded successfully');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to record payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!invoice) {
        return (
            <View style={styles.center}>
                <Text>Invoice not found</Text>
            </View>
        );
    }

    const amountPaid = invoice.totalAmount - invoice.outstandingAmount;

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <View style={styles.card}>
                <Text style={styles.title}>Invoice Details</Text>
                <Text style={styles.status}>Status: {invoice.status.toUpperCase()}</Text>
                <Text>Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</Text>

                <View style={styles.divider} />

                <Text style={styles.subtitle}>Items:</Text>
                {invoice.items.map((item, index) => (
                    <View key={index} style={styles.itemRow}>
                        <Text style={styles.itemDesc}>{item.description} ({item.quantity} x {item.rate})</Text>
                        <Text style={styles.itemAmount}>${item.amount}</Text>
                    </View>
                ))}

                <View style={styles.divider} />

                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total:</Text>
                    <Text style={styles.totalAmount}>${invoice.totalAmount}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Paid:</Text>
                    <Text style={[styles.totalAmount, { color: 'blue' }]}>${amountPaid}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Outstanding:</Text>
                    <Text style={[styles.totalAmount, { color: 'red' }]}>${invoice.outstandingAmount}</Text>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                {invoice.outstandingAmount > 0 && (
                    <Button title="Record Payment" onPress={() => setModalVisible(true)} />
                )}
                <View style={{ marginTop: 10 }}>
                    <Button title="Back to Home" onPress={() => navigation.popToTop()} color="gray" />
                </View>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalTitle}>Record Payment</Text>

                    <Text style={styles.label}>Amount</Text>
                    <TextInput
                        style={styles.input}
                        value={amount}
                        onChangeText={setAmount}
                        placeholder={`Max: ${invoice.outstandingAmount}`}
                        keyboardType="numeric"
                    />

                    <Text style={styles.label}>Mode</Text>
                    <View style={styles.modeContainer}>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === 'cash' && styles.modeActive]}
                            onPress={() => setMode('cash')}
                        >
                            <Text style={[styles.modeText, mode === 'cash' && styles.modeTextActive]}>Cash</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modeButton, mode === 'upi' && styles.modeActive]}
                            onPress={() => setMode('upi')}
                        >
                            <Text style={[styles.modeText, mode === 'upi' && styles.modeTextActive]}>UPI</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.modalButtons}>
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                        <View style={{ width: 20 }} />
                        {isSubmitting ? (
                            <ActivityIndicator color="blue" />
                        ) : (
                            <Button title="Submit" onPress={handlePayment} />
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 2,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    status: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 15,
    },
    subtitle: {
        fontWeight: 'bold',
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    itemDesc: {
        flex: 1,
    },
    itemAmount: {
        fontWeight: 'bold',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    totalText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'green',
    },
    buttonContainer: {
        marginTop: 30,
    },
    // Modal Styles
    modalView: {
        margin: 20,
        marginTop: 100,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    label: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    modeContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    modeButton: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        alignItems: 'center',
    },
    modeActive: {
        backgroundColor: '#e6f0ff',
        borderColor: '#007bff',
    },
    modeText: {
        color: 'black',
    },
    modeTextActive: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
});
