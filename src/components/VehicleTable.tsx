import React from "react";
import { Vehicle } from "@/types/Vehicle";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, XCircle } from "lucide-react";

interface VehicleTableProps {
  vehicles: Vehicle[];
}

const VehicleTable: React.FC<VehicleTableProps> = ({ vehicles }) => {
  // Get badge color based on vehicle type
  const getTypeBadgeStyle = (typeId: number) => {
    switch (typeId) {
      case 1: // Motorcycle
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case 2: // Car
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case 3: // Pickup Truck
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get vehicle type name safely
  const getVehicleTypeName = (vehicle: Vehicle) => {
    // Check if vehicle_type object exists
    if (vehicle.vehicle_type && vehicle.vehicle_type.name) {
      return vehicle.vehicle_type.name;
    }

    // Fallback using ID mapping if vehicle_type object is missing
    const typeMap: Record<number, string> = {
      1: "Motorcycle",
      2: "Car",
      3: "Pickup Truck",
    };

    return typeMap[vehicle.vehicle_type_id] || "Unknown";
  };

  const getVehicleSpecificInfo = (vehicle: Vehicle) => {
    if (vehicle.seat_height) {
      return `Seat Height: ${vehicle.seat_height} mm`;
    } else if (vehicle.cargo_capacity) {
      return `Cargo Capacity: ${vehicle.cargo_capacity} liters`;
    } else if (vehicle.tonnage) {
      return `Tonnage: ${vehicle.tonnage} tons`;
    }
    return "-";
  };

  // Render approval status with icon and tooltip
  const renderApprovalStatus = (isApproved: boolean) => {
    return isApproved ? (
      <div className="flex items-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
          <CheckCircle className="h-3.5 w-3.5" />
          Approved
        </span>
      </div>
    ) : (
      <div className="flex items-center">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neutral/10 text-neutral">
          <XCircle className="h-3.5 w-3.5" />
          Pending
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-3">Registration</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Engine</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Specific Info</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Added On</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              <TableCell className="font-medium pl-3">
                {vehicle.registration_number}
              </TableCell>
              <TableCell>
                {vehicle.manufacturer} {vehicle.model}
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getTypeBadgeStyle(
                    vehicle.vehicle_type_id
                  )}`}
                >
                  {getVehicleTypeName(vehicle)}
                </span>
              </TableCell>
              <TableCell>{vehicle.engine_capacity}cc</TableCell>
              <TableCell>{vehicle.seats}</TableCell>
              <TableCell>{getVehicleSpecificInfo(vehicle)}</TableCell>
              <TableCell>{renderApprovalStatus(vehicle.is_approved)}</TableCell>
              <TableCell>
                {new Date(vehicle.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default VehicleTable;
