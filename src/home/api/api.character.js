import api from '../config/axios';

//Get Characters
export const getCharacters = async () => {
    try {
        const response = await api.get('/Character');
        return response.data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
};

//Get Character by ID
export const getCharacterById = async (id) => {
    try {
        const response = await api.get(`/Character/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching character with ID ${id}:`, error);
        throw error;
    }
};

//Get Characters packages by character ID
export const getCharacterPackagesByCharacterId = async (id) => {
    try {
        const response = await api.get(`/CharacterPackage/character/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching packages for character with ID ${id}:`, error);
        throw error;
    }
};