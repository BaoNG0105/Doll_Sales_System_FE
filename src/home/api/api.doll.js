import api from '../config/axios';

//Get DollTypes
export const getDollTypes = async () => {
    try {
        const response = await api.get('/DollType');
        return response.data;
    } catch (error) {
        console.error('Error fetching doll types:', error);
        throw error;
    }
};

//Get DollModels
export const getDollModels = async () => {
    try {
        const response = await api.get('/DollModel');
        return response.data;
    } catch (error) {
        console.error('Error fetching doll models:', error);
        throw error;
    }
};

//Get DollModel by ID
export const getDollModelById = async (id) => {
    try {
        const response = await api.get(`/DollModel/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doll model with ID ${id}:`, error);
        throw error;
    }
};

//Get DollModel by DollType ID
export const getDollModelsByDollTypeId = async (id) => {
    try {
        const response = await api.get(`/DollModel/by-type/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doll models for doll type with ID ${id}:`, error);
        throw error;
    }
};

//Get DollVariant by DollModel ID
export const getDollVariantsByDollModelId = async (id) => {
    try {
        const response = await api.get(`/DollVariant/by-model/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doll variants for doll model with ID ${id}:`, error);
        throw error;
    }
};