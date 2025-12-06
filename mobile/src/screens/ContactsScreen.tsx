import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Button, RefreshControl } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import client from '../api/client';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'Contacts'>;

type Contact = {
    _id: string;
    name: string;
    phone: string;
    email?: string;
    trustScore?: number;
};

export default function ContactsScreen({ navigation }: Props) {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchContacts = async () => {
        try {
            const response = await client.get('/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchContacts();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchContacts();
    };

    const renderItem = ({ item }: { item: Contact }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name}</Text>
                {item.trustScore !== undefined && (
                    <View style={[styles.badge, { backgroundColor: getTrustColor(item.trustScore) }]}>
                        <Text style={styles.badgeText}>{item.trustScore}</Text>
                    </View>
                )}
            </View>
            <Text style={styles.details}>{item.phone}</Text>
            {item.email && <Text style={styles.details}>{item.email}</Text>}
        </View>
    );

    const getTrustColor = (score: number) => {
        if (score >= 80) return 'green';
        if (score >= 60) return 'orange';
        return 'red';
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.title}>Contacts</Text>
                <Button title="Add" onPress={() => navigation.navigate('AddContact')} />
            </View>

            {loading ? (
                <ActivityIndicator size="large" style={styles.center} />
            ) : (
                <FlatList
                    data={contacts}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={<Text style={styles.emptyText}>No contacts found.</Text>}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
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
        alignItems: 'center',
        marginBottom: 5,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
    },
    details: {
        color: '#666',
        marginTop: 2,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    badgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
});
