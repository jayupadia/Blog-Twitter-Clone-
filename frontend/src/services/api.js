import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

// User registration
export const registerUser = async (name, email, password) => {
    const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
    return response.data;
};

// User login
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error during login');
    }
};

// Fetch all blogs
export const fetchBlogs = async () => {
    const response = await axios.get(`${API_URL}/blogs`);
    return response.data;
};
