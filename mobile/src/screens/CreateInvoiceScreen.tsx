import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import client from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateInvoice'>;

type Contact = {
    _id: string;
    name: string;
};

type Item = {
    description: string;
    quantity: string;
    rate: string;
};

export default function CreateInvoiceScreen({ navigation }: Props) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState('');
    const [loadingContacts, setLoadingContacts] = useState(true);
    const [items, setItems] = useState<Item[]>([{ description: '', quantity: '1', rate: '' }]);

    // Due Date Logic
    const [dueMode, setDueMode] = useState<'days' | 'date'>('days');
    const [dueDays, setDueDays] = useState('30');
    const [dueDate, setDueDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await client.get('/contacts');
            setContacts(response.data);
            if (response.data.length > 0) {
                setSelectedContact(response.data[0]._id);
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch contacts');
        } finally {
            setLoadingContacts(false);
        }
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: '1', rate: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const updateItem = (index: number, field: keyof Item, value: string) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || dueDate;
        setShowDatePicker(Platform.OS === 'ios');
        setDueDate(currentDate);
    };

    const handleSubmit = async () => {
        if (!selectedContact) {
            Alert.alert('Error', 'Please select a contact');
            return;
        }

        const formattedItems = items.map(item => ({
            description: item.description,
            quantity: Number(item.quantity),
            rate: Number(item.rate),
        }));

        if (formattedItems.some(i => !i.description || isNaN(i.quantity) || isNaN(i.rate))) {
            Alert.alert('Error', 'Please fill out all item fields correctly');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload: any = {
                buyerId: selectedContact,
                items: formattedItems,
            };

            if (dueMode === 'days') {
                payload.dueDays = Number(dueDays);
            } else {
                payload.dueDate = dueDate.toISOString();
            }

            const response = await client.post('/invoices', payload);
            navigation.replace('InvoiceDetail', { invoiceId: response.data._id });
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to create invoice');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loadingContacts) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.label}>Select Buyer</Text>
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={selectedContact}
                        onValueChange={(itemValue) => setSelectedContact(itemValue)}
                    >
                        {contacts.map((contact) => (
                            <Picker.Item key={contact._id} label={contact.name} value={contact._id} />
                        ))}
                    </Picker>
                </View>

                <Text style={styles.label}>Due Date</Text>
                <View style={styles.modeContainer}>
                    <TouchableOpacity
                        style={[styles.modeButton, dueMode === 'days' && styles.modeActive]}
                        onPress={() => setDueMode('days')}
                    >
                        <Text style={[styles.modeText, dueMode === 'days' && styles.modeTextActive]}>Set Days</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.modeButton, dueMode === 'date' && styles.modeActive]}
                        onPress={() => setDueMode('date')}
                    >
                        <Text style={[styles.modeText, dueMode === 'date' && styles.modeTextActive]}>Set Date</Text>
                    </TouchableOpacity>
                </View>

                {dueMode === 'days' ? (
                    <TextInput
                        style={styles.input}
                        value={dueDays}
                        onChangeText={setDueDays}
                        keyboardType="numeric"
                        placeholder="e.g. 30"
                    />
                ) : (
                    <View>
                        <Button title={dueDate.toLocaleDateString()} onPress={() => setShowDatePicker(true)} />
                        {showDatePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={dueDate}
                                mode="date"
                                display="default"
                                onChange={onChangeDate}
                            />
                        )}
                    </View>
                )}

                <Text style={styles.sectionTitle}>Items</Text>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemCard}>
                        <TextInput
                            style={styles.input}
                            placeholder="Description"
                            value={item.description}
                            onChangeText={(text) => updateItem(index, 'description', text)}
                        />
                        <View style={styles.row}>
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Qty"
                                value={item.quantity}
                                onChangeText={(text) => updateItem(index, 'quantity', text)}
                                keyboardType="numeric"
                            />
                            <TextInput
                                style={[styles.input, styles.halfInput]}
                                placeholder="Rate"
                                value={item.rate}
                                onChangeText={(text) => updateItem(index, 'rate', text)}
                                keyboardType="numeric"
                            />
                        </View>
                        {items.length > 1 && (
                            <Button title="Remove Item" color="red" onPress={() => handleRemoveItem(index)} />
                        )}
                    </View>
                ))}

                <Button title="+ Add Item" onPress={handleAddItem} />

                <View style={styles.submitContainer}>
                    {isSubmitting ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : (
                        <Button title="Create Invoice" onPress={handleSubmit} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scroll: {
        padding: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 10,
    },
    modeContainer: {
        flexDirection: 'row',
        marginBottom: 10,
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    itemCard: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#eee',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    submitContainer: {
        marginTop: 30,
        marginBottom: 50,
    },
});
