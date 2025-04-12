import axios from "axios";

export interface CustomerRequest {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: string;
  createdAt: string;
}

const api = `${import.meta.env.VITE_API}/customersrequests`;

export const submitCustomerRequest = async (
  request: Omit<CustomerRequest, "_id" | "status" | "createdAt">
): Promise<CustomerRequest> => {
  try {
    const response = await axios.post(api, request);
    return response.data;
  } catch (error) {
    console.error("Error submitting customer request:", error);
    throw error;
  }
};

export const getCustomerRequests = async (): Promise<CustomerRequest[]> => {
  try {
    const response = await axios.get(api);
    return response.data;
  } catch (error) {
    console.error("Error fetching customer requests:", error);
    throw error;
  }
};
