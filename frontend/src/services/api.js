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
        return {
            token: response.data.token,
            role: response.data.role,
        };
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Error during login');
    }
};

// Get Admin Statistics
export const fetchStats = async (token) => {
    const response = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Fetch all likes for blogs
export const fetchLikes = async (token) => {
    const response = await axios.get(`${API_URL}/admin/likes`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Fetch all comments
export const fetchComments = async (token) => {
    const response = await axios.get(`${API_URL}/admin/comments`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Block/Unblock admin
export const toggleAdminBlock = async (token, adminId, block) => {
    const response = await axios.post(
        `${API_URL}/admin/toggle-admin-block`,
        { adminId, block },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Delete a blog
export const deleteBlog = async (token, blogId) => {
    const response = await axios.delete(`${API_URL}/admin/delete-blog/${blogId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Delete a comment
export const deleteComment = async (token, commentId) => {
    const response = await axios.delete(`${API_URL}/admin/delete-comment/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
