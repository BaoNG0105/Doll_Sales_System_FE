import api from '../config/axios';


// GET all Doll Types
export const getDollTypes = async () => {
  try {
    const response = await api.get('/DollType');
    return response.data;
  } catch (error) {
    console.error('Error fetching doll types:', error);
    throw error;
  }
};

// POST create Doll Type
export const createDollType = async (data) => {
  try {
    const response = await api.post('/DollType', data);
    return response.data;
  } catch (error) {
    console.error('Error creating doll type:', error);
    throw error;
  }
};

// DELETE Doll Type by ID
export const deleteDollType = async (id) => {
  try {
    const response = await api.delete(`/DollType/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting doll type with ID ${id}:`, error);
    throw error;
  }
};

// GET all Doll Models
export const getDollModels = async () => {
  try {
    const response = await api.get('/DollModel');
    return response.data;
  } catch (error) {
    console.error('Error fetching doll models:', error);
    throw error;
  }
};

// GET Doll Model by ID
export const getDollModelById = async (id) => {
  try {
    const response = await api.get(`/DollModel/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doll model with ID ${id}:`, error);
    throw error;
  }
};

// GET Doll Models by DollType ID
export const getDollModelsByDollTypeId = async (id) => {
  try {
    const response = await api.get(`/DollModel/by-type/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doll models for doll type with ID ${id}:`, error);
    throw error;
  }
};

// POST create Doll Model
export const createDollModel = async (data) => {
  try {
    const response = await api.post('/DollModel', data);
    return response.data;
  } catch (error) {
    console.error('Error creating doll model:', error);
    throw error;
  }
};

// DELETE (Soft) Doll Model by ID
export const softDeleteDollModel = async (id) => {
  try {
    const response = await api.delete(`/DollModel/soft/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error soft-deleting doll model with ID ${id}:`, error);
    throw error;
  }
};

// DELETE (Hard) Doll Model by ID
export const hardDeleteDollModel = async (id) => {
  try {
    const response = await api.delete(`/DollModel/hard/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error hard-deleting doll model with ID ${id}:`, error);
    throw error;
  }
};

// GET Doll Variants by DollModel ID
export const getDollVariantsByDollModelId = async (id) => {
  try {
    const response = await api.get(`/DollVariant/by-model/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching doll variants for doll model with ID ${id}:`, error);
    throw error;
  }
};

// POST create Doll Variant
export const createDollVariant = async (data) => {
  try {
    const response = await api.post('/DollVariant', data);
    return response.data;
  } catch (error) {
    console.error('Error creating doll variant:', error);
    throw error;
  }
};

// DELETE Doll Variant by ID
export const deleteDollVariant = async (id) => {
  try {
    const response = await api.delete(`/DollVariant/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting doll variant with ID ${id}:`, error);
    throw error;
  }
};
// 🟢 GET all Doll Variants
export const getDollVariants = async () => {
  try {
    const response = await api.get("/DollVariant");
    // ✅ API trả về danh sách JSON trực tiếp (không bọc data)
    // nên ta trả luôn response.data
    return {
      message: "Fetched successfully",
      data: response.data, // Mảng các variant
    };
  } catch (error) {
    console.error("Error fetching doll variants:", error);
    throw error;
  }
};