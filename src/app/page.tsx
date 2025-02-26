"use client";

import React, { useEffect, useState, useCallback } from "react";
import { fetchVehicles } from "@/services/api";
import {
  PaginatedResponse,
  Vehicle,
  VehicleFilterParams,
} from "@/types/Vehicle";
import VehicleTable from "@/components/VehicleTable";
import VehicleFilters from "@/components/VehicleFilters";
import Pagination from "@/components/Pagination";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    perPage: 10,
    totalPages: 1,
    total: 0,
  });
  const [filters, setFilters] = useState<VehicleFilterParams>({
    sort_by: "created_at",
    sort_direction: "desc",
  });
  
  // Use loadVehicles as a memoized callback to prevent unnecessary rerenders
  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<Vehicle> = await fetchVehicles({
        ...filters,
        page: pagination.currentPage,
        per_page: pagination.perPage,
      });
      setVehicles(response.data);
      setPagination(prev => ({
        ...prev,
        currentPage: response.current_page,
        totalPages: response.last_page,
        total: response.total,
      }));
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.perPage]);

  // Effect for loading vehicles
  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  // Memoized filter change handler
  const handleFilterChange = useCallback((newFilters: Partial<VehicleFilterParams>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      
      // Only update if there are actual changes
      if (JSON.stringify(prevFilters) === JSON.stringify(updatedFilters)) {
        return prevFilters;
      }
      
      // Reset to page 1 when filters change
      setPagination(prev => ({ ...prev, currentPage: 1 }));
      return updatedFilters;
    });
  }, []);

  // Page change handler
  const handlePageChange = useCallback((page: number) => {
    if (page !== pagination.currentPage) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  }, [pagination.currentPage]);

  // Per page change handler
  const handlePerPageChange = useCallback((perPage: number) => {
    if (perPage !== pagination.perPage) {
      setPagination(prev => ({ ...prev, perPage, currentPage: 1 }));
    }
  }, [pagination.perPage]);

  return (
    <main className="container mx-auto pb-8 px-4">
      <h1 className="text-3xl font-bold mb-4">Vehicle Inventory</h1>
      <p className="text-gray-500 text-sm mb-6">
        Search and filter vehicles from our inventory.
      </p>

      <VehicleFilters onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : vehicles.length > 0 ? (
        <>
          <div className="overflow-x-auto">
            <VehicleTable vehicles={vehicles} />
          </div>

          <div className="mt-6">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                Showing {(pagination.currentPage - 1) * pagination.perPage + 1}{" "}
                to{" "}
                {Math.min(
                  pagination.currentPage * pagination.perPage,
                  pagination.total
                )}{" "}
                of {pagination.total} vehicles
              </div>

              <Pagination 
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                perPage={pagination.perPage}
                onPerPageChange={handlePerPageChange}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-sm dark:text-white">
            No vehicles found matching your criteria
          </p>
        </div>
      )}
    </main>
  );
}