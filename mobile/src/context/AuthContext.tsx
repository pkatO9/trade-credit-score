import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../api/client';

type AuthContextType = {
    isLoading: boolean;
    userToken: string | null;
    requestOtp: (phone: string) => Promise<string>;
    verifyOtp: (phone: string, requestId: string, otp: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState<string | null>(null);

    const requestOtp = async (phone: string) => {
        const response = await client.post('/auth/request-otp', { phone });
        return response.data.requestId;
    };

    const verifyOtp = async (phone: string, requestId: string, otp: string) => {
        const response = await client.post('/auth/verify-otp', { phone, requestId, otp });
        const token = response.data.access_token;
        await AsyncStorage.setItem('userToken', token);
        setUserToken(token);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        setUserToken(null);
    };

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            setUserToken(userToken);
            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn in error ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoading,
                userToken,
                requestOtp,
                verifyOtp,
                logout,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
