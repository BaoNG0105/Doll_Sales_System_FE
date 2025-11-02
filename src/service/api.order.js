import api from "../config/axios";

//------------------------------------
//Doll Order API
//------------------------------------
//GET All Doll Orders
export const getDollOrders = async (params) => {
  try {
    const response = await api.get("/doll-orders", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

//GET Doll Order by ID
export const getDollOrderById = async (id) => {
  try {
    const response = await api.get(`/doll-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching order with ID ${id}:`, error);
    throw error;
  }
};

//GET Doll Orders by User ID
export const getDollOrdersByUserId = async (id) => {
  try {
    const response = await api.get(`/doll-orders/user/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching orders for user ID ${id}:`, error);
    throw error;
  }
};

//POST Doll Order
export const postDollOrder = async (orderData) => {
  try {
    const response = await api.post("/doll-orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

//PATCH Doll Order
export const patchDollOrder = async (id, orderData) => {
  try {
    const response = await api.patch(`/doll-orders/${id}`, orderData);
    return response.data;
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

//DELETE Doll Order
export const deleteDollOrder = async (id) => {
  try {
    const response = await api.delete(`/doll-orders/${id}`);
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
export const getCharacterOrders = async (params) => {
  try {
    const response = await api.get("/character-orders", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching character orders:", error);
    throw error;
  }
};

//GET Character Order by ID
export const getCharacterOrderById = async (id) => {
  try {
    const response = await api.get(`/character-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching character order with ID ${id}:`, error);
    throw error;
  }
};

//GET Character Orders by User ID
export const getCharacterOrdersByUserId = async (userId) => {
  try {
    const response = await api.get(`/character-orders/user-characters/${userId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching character orders for user ID ${userId}:`, error);
    throw error;
  }
};

//POST Character Order
export const postCharacterOrder = async (orderData) => {
  try {
    const response = await api.post("/character-orders", orderData);
    return response.data;
  } catch (error) {
    console.error("Error creating character order:", error);
    throw error;
  }
};

//PATCH Character Order
export const patchCharacterOrder = async (id, data) => {
  try {
    const response = await api.patch(`/character-orders/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error updating character order with ID ${id}:`, error);
    throw error;
  }
};

//DELETE Character Order
export const deleteCharacterOrder = async (id) => {
  try {
    const response = await api.delete(`/character-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting character order with ID ${id}:`, error);
    throw error;
  }
};


