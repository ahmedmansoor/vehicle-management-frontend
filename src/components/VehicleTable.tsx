import React from 'react';
import { Vehicle } from '@/types/Vehicle';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
  const getVehicleSpecificInfo = (vehicle: Vehicle) => {
    if ('seat_height' in vehicle) {
      return `Seat Height: ${vehicle.seat_height} mm`;
    } else if ('cargo_capacity' in vehicle) {
      return `Cargo Capacity: ${vehicle.cargo_capacity} liters`;
    } else if ('tonnage' in vehicle) {
      return `Tonnage: ${vehicle.tonnage} tons`;
    }
    return '-';
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Engine</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Specific Info</TableHead>
            <TableHead>Added On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium">{vehicle.registration_number}</TableCell>
              <TableCell>{vehicle.manufacturer} {vehicle.model}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    vehicle.vehicle_type.name === "Motorcycle" ? "default" :
                    vehicle.vehicle_type.name === "Car" ? "secondary" :
                    vehicle.vehicle_type.name === "Truck" ? "destructive" : 
                    "outline"
                  }
                >
                  {vehicle.vehicle_type.name}
                </Badge>
              </TableCell>
              <TableCell>{vehicle.engine_capacity}cc</TableCell>
              <TableCell>{vehicle.seats}</TableCell>
              <TableCell>{getVehicleSpecificInfo(vehicle)}</TableCell>
              <TableCell>{new Date(vehicle.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable; 