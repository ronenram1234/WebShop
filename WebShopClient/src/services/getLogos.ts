import axios, { AxiosResponse } from "axios";
// import { Logo } from "../interfaces/Logo";

const api_stocks: string = `${import.meta.env.VITE_API}/stocks/brands`;
const api_logos: string = `${import.meta.env.VITE_API}/logos`;

// Cache for logo responses
const logoCache: Record<string, Promise<AxiosResponse>> = {};

export function getAllLogos(): Promise<AxiosResponse> {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `${api_stocks}`,
    headers: {},
  };

  return axios.request(config);
}

export function getLogoFile(fileName: string): Promise<AxiosResponse> {
  // Check localStorage first
  const savedLogoStatuses = localStorage.getItem("logoStatuses");
  if (savedLogoStatuses) {
    const statuses = JSON.parse(savedLogoStatuses);
    if (statuses[fileName] === 404) {
      // Return a rejected promise with 404 status
      return Promise.reject({ response: { status: 404 } });
    }
  }

  // Check memory cache
  if (fileName in logoCache) {
    return logoCache[fileName];
  }

  // Make the request and cache it
  const request = axios
    .get(`${api_logos}/${fileName}`, {
      responseType: "blob",
    })
    .then((response) => {
      // Cache successful responses
      return response;
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        // Update localStorage for 404s
        const statuses = JSON.parse(
          localStorage.getItem("logoStatuses") || "{}"
        );
        statuses[fileName] = 404;
        localStorage.setItem("logoStatuses", JSON.stringify(statuses));
      }
      throw error;
    });

  logoCache[fileName] = request;
  return request;
}
