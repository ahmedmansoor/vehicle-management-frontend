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

export const fetchVehicles = async (params: VehicleFilterParams = {}): Promise<PaginatedResponse<Vehicle>> => {
  console.log('Fetching vehicles with params:', params); // Check what's being sent
  
  const response = await api.get('/vehicles', { 
    params: {
      // Make sure search parameter aligns with what your backend expects
      search: params.search,
      vehicle_type_id: params.vehicle_type_id,
      sort_by: params.sort_by,
      sort_direction: params.sort_direction,
      page: params.page || 1,
      per_page: params.per_page || 10
    } 
  });
  
  return response.data;
};

export const fetchVehicleTypes = async () => {
  const response = await api.get("/vehicle-types");

  // Handle different response formats by checking the structure
  if (Array.isArray(response.data)) {
    return response.data;
  } else if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  } else if (response.data && typeof response.data === "object") {
    // If we got an object with vehicle types under some property
    // Try common patterns like "vehicleTypes", "types", etc.
    const possibleArrays = Object.values(response.data).filter(Array.isArray);
    if (possibleArrays.length > 0) {
      return possibleArrays[0];
    }
  }

  // If we can't find an array in the response, return empty array
  console.error("Unexpected vehicle types response format:", response.data);
  return [];
};
