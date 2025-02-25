// src/app/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { fetchVehicles } from '@/services/api';
import { PaginatedResponse, Vehicle, VehicleFilterParams } from '@/types/Vehicle';
import VehicleTable from '@/components/VehicleTable';
import VehicleFilters from '@/components/VehicleFilters';
import Pagination from '@/components/Pagination';
import { Loader2 } from 'lucide-react';

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
    sort_by: 'created_at',
    sort_direction: 'desc',
  });

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response: PaginatedResponse<Vehicle> = await fetchVehicles({
        ...filters,
        page: pagination.currentPage,
        per_page: pagination.perPage,
      });
      setVehicles(response.data);
      setPagination({
        currentPage: response.current_page,
        perPage: response.per_page,
        totalPages: response.last_page,
        total: response.total,
      });
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.currentPage, pagination.perPage, filters]);

  const handleFilterChange = (newFilters: Partial<VehicleFilterParams>) => {
    setFilters({ ...filters, ...newFilters });
    setPagination({ ...pagination, currentPage: 1 }); // Reset to first page on filter change
  };

  const handlePageChange = (page: number) => {
    setPagination({ ...pagination, currentPage: page });
  };

  const handlePerPageChange = (perPage: number) => {
    setPagination({ ...pagination, perPage, currentPage: 1 });
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Vehicle Inventory</h1>
      
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
                Showing {((pagination.currentPage - 1) * pagination.perPage) + 1} to {Math.min(pagination.currentPage * pagination.perPage, pagination.total)} of {pagination.total} vehicles
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
          <p className="text-gray-500 text-xl">No vehicles found matching your criteria</p>
        </div>
      )}
    </main>
  );
}