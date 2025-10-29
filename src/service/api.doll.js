import api from '../config/axios';

//----------------------------
//API Doll Types
//----------------------------
// GET all Doll Types
export const getDollTypes = async (params) => {
    try {
        const response = await api.get('/doll-types', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching doll types:', error);
        throw error;
    }
};

// POST Doll Type
export const postDollType = async (data) => {
    try {
        const response = await api.post('/doll-types', data);
        return response.data;
    } catch (error) {
        console.error('Error creating doll type:', error);
        throw error;
    }
};

// PATCH Doll Type by ID
export const pathDollType = async (id, data) => {
    try {
        const response = await api.patch(`/doll-types/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating doll type with ID ${id}:`, error);
        throw error;
    }
};


// DELETE Doll Type by ID
export const deleteDollType = async (id) => {
    try {
        const response = await api.delete(`/doll-types/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting doll type with ID ${id}:`, error);
        throw error;
    }
};

//----------------------------
//API Doll Models
//----------------------------
// GET all Doll Models
export const getDollModels = async (params) => {
    try {
        const response = await api.get('/doll-models', { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching doll models:', error);
        throw error;
    }
};

// GET Doll Model by ID
export const getDollModelById = async (id) => {
    try {
        const response = await api.get(`/doll-models/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doll model with ID ${id}:`, error);
        throw error;
    }
};

// GET Doll Models by Doll Type ID
export const getDollModelsByDollTypeId = async (dollTypeId) => {
    try {
        const response = await api.get(`/doll-models/by-type/${dollTypeId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doll models for doll type with ID ${dollTypeId}:`, error);
        throw error;
    }
};

// POST Doll Model
export const postDollModel = async (data) => {
    try {
        const response = await api.post('/doll-models', data);
        return response.data;
    } catch (error) {
        console.error('Error creating doll model:', error);
        throw error;
    }
};

// PATCH Doll Model by ID
export const patchDollModel = async (id, data) => {
    try {
        const response = await api.patch(`/doll-models/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating doll model with ID ${id}:`, error);
        throw error;
    }
};

// DELETE (Soft) Doll Model by ID
export const softDeleteDollModel = async (id) => {
    try {
        const response = await api.delete(`/doll-models/soft/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error soft-deleting doll model with ID ${id}:`, error);
        throw error;
    }
};

// DELETE (Hard) Doll Model by ID
export const hardDeleteDollModel = async (id) => {
    try {
        const response = await api.delete(`/doll-models/hard/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error hard-deleting doll model with ID ${id}:`, error);
        throw error;
    }
};

//----------------------------
//API Doll Variants
//----------------------------
// GET all Doll Variants
export const getDollVariants = async (params) => {
    try {
      const response = await api.get("/doll-variants", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching doll variants:", error);
      throw error;
    }
  };

// GET Doll Variants by DollModel ID
export const getDollVariantsByDollModelId = async (dollModelId) => {
    try {
        const response = await api.get(`/doll-variants/by-model-id/${dollModelId}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching doll variants for doll model with ID ${dollModelId}:`, error);
        throw error;
    }
};

// PATCH Doll Variant by ID
export const patchDollVariant = async (id, data) => {
    try {
        const response = await api.patch(`/doll-variants/${id}`, data);
        return response.data;
    } catch (error) {
        console.error(`Error updating doll variant with ID ${id}:`, error);
        throw error;
    }
};

// POST Doll Variant
export const postDollVariant = async (data) => {
    try {
        const response = await api.post('/doll-variants', data);
        return response.data;
    } catch (error) {
        console.error('Error creating doll variant:', error);
        throw error;
    }
};

// DELETE Doll Variant by ID
export const deleteDollVariant = async (id) => {
    try {
        const response = await api.delete(`/doll-variants/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error deleting doll variant with ID ${id}:`, error);
        throw error;
    }
};