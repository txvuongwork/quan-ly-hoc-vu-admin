import { ACCESS_TOKEN_KEY } from "@/constants";
import type { IResponse, IResponseError } from "@/types";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  detail?: string;
  status?: number;
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:8082/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export const handleResponse = async <T>(
  promise: Promise<{ data: T }>
): Promise<IResponse<T>> => {
  try {
    const response = await promise;
    return {
      ok: true,
      body: response.data,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const responseError: IResponseError = {
      message: axiosError?.response?.data?.detail || "internal-error",
      status: axiosError?.response?.status || 500,
    };

    return {
      ok: false,
      error: responseError,
    };
  }
};

export default axiosInstance;
