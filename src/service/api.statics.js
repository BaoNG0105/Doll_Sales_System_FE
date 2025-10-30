import api from "../config/axios";

//GET api static revenue
export const getStaticRevenue = async (params) => {
  try {
    const response = await api.get("/statics/revenue", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching static revenue:", error);
    throw error;
  }
};

//GET api static users
export const getStaticUsers = async (params) => {
  try {
    const response = await api.get("/statics/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching static users:", error);
    throw error;
  }
};

//GET api static orders
export const getStaticOrders = async (params) => {
  try {
    const response = await api.get("/statics/orders", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching static orders:", error);
    throw error;
  }
};