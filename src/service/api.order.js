import api from "../config/axios";

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

