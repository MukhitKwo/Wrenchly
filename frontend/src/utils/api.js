import axios from 'axios';

// Create the axios instance
const apiInstance = axios.create({
    baseURL: 'http://localhost:8001/api/',
    withCredentials: true, // This sends cookies/session headers
    headers: {
        'Content-Type': 'application/json',
    }
});

export const postApi = async (endpoint, data = {}) => {
    try {
        // We force data to be {} if it's missing, so headers/credentials always work
        const response = await apiInstance.post(endpoint, data);
        return response.data;
    } catch (error) {
        // Optional: meaningful error logging
        console.error(`Error in POST ${endpoint}:`, error.response || error.message);
        throw error;
    }
};