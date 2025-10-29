import api from "../config/axios";

//GET Users
export const getUsers = async (params) => {
    try {
        const response = await api.get("/users", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

//GET User by ID
export const getUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching user with ID ${id}:`, error);
        throw error;
    }
};

//POST User
export const postUser = async (userData) => {
    try {
        const response = await api.post("/users", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};

//PATH User
export const pathUser = async (id, userData) => {
    try {
        const response = await api.patch(`/users/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error(`Error updating user with ID ${id}:`, error);
        throw error;
    }
};

// PATH status User
export const pathUserStatus = async (id, statusData) => {
    try {
        const response = await api.patch(`/users/${id}/status`, statusData);
        return response.data;
    } catch (error) {
        console.error(`Error updating status for user with ID ${id}:`, error);
        throw error;
    }
};

//DELETE User Permanently
export const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/users/${id}/Permanent`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting user with ID ${id}:`, error);
        throw error;
    }
};