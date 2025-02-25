// src/services/api.ts
import axios from "axios";
import {
  PaginatedResponse,
  Vehicle,
  VehicleFilterParams,
} from "@/types/Vehicle";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://vehicle-api.laravel.cloud/api";

// Create an axios instance that includes authentication
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add token from environment or localStorage
api.interceptors.request.use((config) => {
  // First try environment variable (for development)
  const envToken = process.env.NEXT_PUBLIC_API_TOKEN;
  // Then fallback to localStorage (for production/user login)
  const storageToken = localStorage.getItem("token");

  const token = envToken || storageToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Get CSRF cookie
export const getCsrfCookie = async () => {
  return axios.get(`${API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// Login function to get token
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    const token = response.data.token;
    if (token) {
      localStorage.setItem("token", token);
    }
    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const fetchVehicles = async (
  params: VehicleFilterParams = {}
): Promise<PaginatedResponse<Vehicle>> => {
  const response = await api.get("/vehicles", { params });
  return response.data;
};

export const fetchVehicleTypes = async () => {
  const response = await api.get("/vehicle-types");
  return response.data;
};
