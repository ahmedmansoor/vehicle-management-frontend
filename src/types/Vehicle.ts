// src/types/Vehicle.ts
export interface BaseVehicle {
  id: number;
  registration_number: string;
  manufacturer: string;
  model: string;
  engine_capacity: number;
  seats: number;
  vehicle_type_id: number;
  vehicle_type: VehicleType;
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  user_id: number;
}

export interface Motorcycle extends BaseVehicle {
  seat_height: number;
}

export interface Car extends BaseVehicle {
  cargo_capacity: number;
}

export interface PickupTruck extends BaseVehicle {
  tonnage: number;
}

export type Vehicle = Motorcycle | Car | PickupTruck;

export interface VehicleType {
  id: number;
  name: string; // "Motorcycle", "Car", "Pickup Truck"
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
