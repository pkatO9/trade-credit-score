import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Replace '192.168.1.3' with your machine's local IP address if it changes
const localIp = '192.168.1.3';
const baseURL = `http://${localIp}:3000/api/v1`;

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

export default client;
