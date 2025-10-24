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

//Post Character
export const postCharacter = async (characterData) => {
    try {
        const response = await api.post('/Character', characterData);
        return response.data;
    } catch (error) {
        console.error('Error creating character:', error);
        throw error;
    }
};

//Path Character
export const pathCharacter = async (id, characterData) => {
    try {
        const response = await api.patch(`/Character/${id}`, characterData);
        return response.data;
    } catch (error) {
        console.error(`Error updating character with ID ${id}:`, error);
        throw error;
    }
};


//Delete Character
export const deleteCharacter = async (id) => {
    try {
        const response = await api.delete(`/Character/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting character with ID ${id}:`, error);
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