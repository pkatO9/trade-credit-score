import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../types/navigation';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/LoginScreen';
import VerifyOtpScreen from '../screens/VerifyOtpScreen';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import AddContactScreen from '../screens/AddContactScreen';
import CreateInvoiceScreen from '../screens/CreateInvoiceScreen';
import InvoiceDetailScreen from '../screens/InvoiceDetailScreen';
import PendingInvoicesScreen from '../screens/PendingInvoicesScreen';
import NotificationsScreen from '../screens/NotificationsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { userToken, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userToken == null ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ title: 'Verify OTP' }} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Contacts" component={ContactsScreen} />
                        <Stack.Screen name="AddContact" component={AddContactScreen} options={{ title: 'Add Contact' }} />
                        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} options={{ title: 'New Invoice' }} />
                        <Stack.Screen name="InvoiceDetail" component={InvoiceDetailScreen} options={{ title: 'Invoice Details' }} />
                        <Stack.Screen name="PendingInvoices" component={PendingInvoicesScreen} options={{ title: 'Pending Invoices' }} />
                        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Notifications' }} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
