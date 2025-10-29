import api from '../config/axios';

//Get Characters
export const getCharacters = async (params) => {
    try {
        const response = await api.get('/characters', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching characters:', error);
        throw error;
    }
};

//Post Character
export const postCharacter = async (characterData) => {
    try {
        const response = await api.post('/characters', characterData);
        return response.data;
    } catch (error) {
        console.error('Error creating character:', error);
        throw error;
    }
};

//Path Character
export const pathCharacter = async (id, characterData) => {
    try {
        const response = await api.patch(`/characters/${id}`, characterData);
        return response.data;
    } catch (error) {
        console.error(`Error updating character with ID ${id}:`, error);
        throw error;
    }
};


//Delete Character
export const deleteCharacter = async (id) => {
    try {
        const response = await api.delete(`/characters/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting character with ID ${id}:`, error);
        throw error;
    }
};

//Get Character by ID
export const getCharacterById = async (id) => {
    try {
        const response = await api.get(`/characters/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching character with ID ${id}:`, error);
        throw error;
    }
};

//Get Characters packages by character ID
export const getCharacterPackagesByCharacterId = async (id) => {
    try {
        const response = await api.get(`/character-packages/character/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching packages for character with ID ${id}:`, error);
        throw error;
    }
};