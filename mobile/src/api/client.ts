import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Replace '192.168.1.3' with your machine's local IP address if it changes
const localIp = '192.168.1.3';
const baseURL = `http://${localIp}:3002/api/v1`;

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

client.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // Token is invalid or expired
            await AsyncStorage.removeItem('userToken');
            // Optional: You might want to trigger a navigation to login here,
            // or let the AuthContext update its state if it's listening to storage changes associated with focus/app state.
            // For now, clearing the token ensures the next app launch/check will treat user as logged out.
        }
        return Promise.reject(error);
    }
);

export default client;
