import api from "../config/axios";

//Post Payment
export const postPayment = async (paymentData) => {
  try {
    const response = await api.post("/payments", paymentData);
    return response.data;
  } catch (error) {
    console.error("Error processing payment:", error);
    throw error;
  }
};