import axios, { AxiosResponse } from "axios";

const api_stocks: string = `${import.meta.env.VITE_API}/stocks`;

export function getAllStocks(token?: string): Promise<AxiosResponse> {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${api_stocks}`,
    headers: token ? { Authorization: token } : {},
  };

  return axios.request(config);
}

export function getStockById(
  id: string,
  token?: string
): Promise<AxiosResponse> {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${api_stocks}/${id}`,
    headers: token ? { Authorization: token } : {},
  };

  return axios.request(config);
}
