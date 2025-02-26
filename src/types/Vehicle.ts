// src/types/Vehicle.ts
export interface BaseVehicle {
  id: number;
  registration_number: string;
  manufacturer: string;
  model: string;
  engine_capacity: number;
  seats: number;
  vehicle_type_id: number;
  vehicle_type?: VehicleType; // Make optional since it might not be included in all responses
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  user_id: number;
}

export interface Motorcycle extends BaseVehicle {
  seat_height: number;
  cargo_capacity: null;
  tonnage: null;
}

export interface Car extends BaseVehicle {
  seat_height: null;
  cargo_capacity: number;
  tonnage: null;
}

export interface PickupTruck extends BaseVehicle {
  seat_height: null;
  cargo_capacity: null;
  tonnage: number;
}

// For responses that might have unknown type or missing specific fields
export interface GenericVehicle extends BaseVehicle {
  seat_height: number | null;
  cargo_capacity: number | null;
  tonnage: number | null;
}

export type Vehicle = Motorcycle | Car | PickupTruck | GenericVehicle;

export interface VehicleType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export type VehicleFilterParams = {
  vehicle_type_id?: number;
  search?: string;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
};