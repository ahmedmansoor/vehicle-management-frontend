// src/components/VehicleCard.tsx
import React from 'react';
import { Vehicle } from '@/types/Vehicle';
import Image from 'next/image';

interface VehicleCardProps {
  vehicle: Vehicle;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
  const getVehicleSpecificInfo = () => {
    if ('seat_height' in vehicle) {
      return <p className="text-sm">Seat Height: {vehicle.seat_height} mm</p>;
    } else if ('cargo_capacity' in vehicle) {
      return <p className="text-sm">Cargo Capacity: {vehicle.cargo_capacity} liters</p>;
    } else if ('tonnage' in vehicle) {
      return <p className="text-sm">Tonnage: {vehicle.tonnage} tons</p>;
    }
    return null;
  };

  // Placeholder images based on vehicle type
  const getImageSrc = () => {
    switch (vehicle.vehicle_type.name.toLowerCase()) {
      case 'motorcycle': return '/motorcycle-placeholder.jpg';
      case 'car': return '/car-placeholder.jpg';
      case 'pickup truck': return '/pickup-placeholder.jpg';
      default: return '/vehicle-placeholder.jpg';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        <Image 
          src={getImageSrc()}
          alt={`${vehicle.manufacturer} ${vehicle.model}`}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-800">{vehicle.manufacturer} {vehicle.model}</h3>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            {vehicle.vehicle_type.name}
          </span>
        </div>
        <p className="mt-2 text-gray-600 font-medium">{vehicle.registration_number}</p>
        
        <div className="mt-3 space-y-1">
          <p className="text-sm">Engine: {vehicle.engine_capacity}cc</p>
          <p className="text-sm">Seats: {vehicle.seats}</p>
          {getVehicleSpecificInfo()}
        </div>
        
        <div className="mt-4 text-xs text-gray-500">
          Added on {new Date(vehicle.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;