import axios from "axios";

interface CustomerRequest {
  name: string;
  email: string;
  message: string;
}

const api = `${import.meta.env.VITE_API}/customerrequest`;


export const submitCustomerRequest = async (
  request: CustomerRequest
): Promise<any> => {
  try {
    const response = await axios.post(api, request);
    return response.data;
  } catch (error) {
    console.error("Error submitting customer request:", error);
    throw error;
  }
};
