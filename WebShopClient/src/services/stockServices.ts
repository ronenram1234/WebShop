import axios, { AxiosResponse } from "axios";

const api_stocks: string = `${import.meta.env.VITE_API}/stocks`;
const api_cart: string = `${import.meta.env.VITE_API}/cart`;
const api_favorites: string = `${import.meta.env.VITE_API}/favorites`;

export function toggleStockFavorite(
  stockId: string,
  token: string
): Promise<AxiosResponse> {
  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${api_favorites}/${stockId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.request(config);
}

export function getUserFavorites(token: string): Promise<AxiosResponse> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: api_favorites,
    headers: {
      Authorization: token,
    },
  };

  return axios.request(config);
}

export function toggleStockCart(
  stockId: string,
  token: string
): Promise<AxiosResponse> {
  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${api_cart}/${stockId}`,
    headers: {
      Authorization: token,
    },
  };

  return axios.request(config);
}

export function getUserCart(token: string): Promise<AxiosResponse> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: api_cart,
    headers: {
      Authorization: token,
    },
  };

  return axios.request(config);
}

export function updateStock(
  stockId: string,
  updatedFields: { [key: string]: any },
  token: string
): Promise<AxiosResponse> {
  const config = {
    method: "patch",
    maxBodyLength: Infinity,
    url: `${api_stocks}/${stockId}`,
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    data: updatedFields,
  };

  return axios.request(config);
}

export function getAllFavorites(token: string): Promise<AxiosResponse> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${api_favorites}/all`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.request(config);
}

export function getAllCartItems(token: string): Promise<AxiosResponse> {
  const config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${api_cart}/all`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.request(config);
}

export const requestQuota = async (
  stockId: string,
  requestedQuota: number,
  token: string
) => {
  return axios.post(
    `${api_cart}/${stockId}/request-quota`,
    { requestedQuota },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const markQuotaHandled = async (stockId: string, token: string) => {
  return axios.patch(
    `${api_cart}/${stockId}/mark-handled`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
