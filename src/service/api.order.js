import api from "../config/axios";

//------------------------------------
//Doll Order API
//------------------------------------
//GET Orders
export const getOrders = async () => {
  try {
    const response = await api.get("/Order");
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

//GET Order by ID
export const getOrderById = async (id) => {
  try {
    const response = await api.get(`/Order/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

//POST Order
export const postOrder = async (orderData) => {
  try {
    const response = await api.post("/Order", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

//PATCH Order
export const patchOrder = async (id, orderData) => {
  try {
    const response = await api.patch(`/Order/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

//DELETE Order
export const deleteOrder = async (id) => {
  try {
    const response = await api.delete(`/Order/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};

//------------------------------------
//Character Order API
//------------------------------------
//GET Character Orders
export const getCharacterOrders = async () => {
  try {
    const response = await api.get("/CharacterOrder");
    return response.data;
  } catch (error) {
    console.error("Error fetching character orders:", error);
    throw error;
  }
};

//GET Character Order by ID
export const getCharacterOrderById = async (id) => {
  try {
    const response = await api.get(`/CharacterOrder/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching character order with ID ${id}:`, error);
    throw error;
  }
};

//POST Character Order
export const postCharacterOrder = async (orderData) => {
  try {
    const response = await api.post("/CharacterOrder", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating character order:", error);
    throw error;
  }
};

//PATCH Character Order
export const patchCharacterOrder = async (id, data) => {
  try {
    const response = await api.patch(`/CharacterOrder/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating character order with ID ${id}:`, error);
    throw error;
  }
};

//DELETE Character Order
export const deleteCharacterOrder = async (id) => {
  try {
    const response = await api.delete(`/CharacterOrder/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting character order with ID ${id}:`, error);
    throw error;
  }
};


