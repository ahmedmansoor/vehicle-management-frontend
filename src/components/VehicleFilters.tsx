// src/components/VehicleFilters.tsx
import React, { useEffect, useState } from 'react';
import { fetchVehicleTypes } from '@/services/api';
import { VehicleType } from '@/types/Vehicle';
import { Button } from './ui/button';
import { SearchIcon, FilterIcon, FilterX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface VehicleFiltersProps {
  onFilterChange: (filters: {
    vehicle_type_id?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }) => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({ onFilterChange }) => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

  useEffect(() => {
    const loadVehicleTypes = async () => {
      try {
        const types = await fetchVehicleTypes();
        setVehicleTypes(types);
      } catch (error) {
        console.error('Failed to fetch vehicle types:', error);
      }
    };
    loadVehicleTypes();
  }, []);

  const handleApplyFilters = () => {
    onFilterChange({
      vehicle_type_id: selectedType ? parseInt(selectedType) : undefined,
      search: search || undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
    });
  };

  const handleReset = () => {
    setSelectedType('');
    setSearch('');
    setSortBy('created_at');
    setSortDirection('desc');
    onFilterChange({
      vehicle_type_id: undefined,
      search: undefined,
      sort_by: 'created_at',
      sort_direction: 'desc',
    });
  };

  return (
    <Card className="mb-6 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-6 px-6">
        <CardTitle className="text-md font-semibold">Vehicles</CardTitle>
        <Button 
          variant="ghost"
          size="sm"
          className="md:hidden hover:text-gray-900 hover:bg-gray-100"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          {isFilterExpanded ? (
            <FilterX className="h-4 w-4 mr-1" />
          ) : (
            <FilterIcon className="h-4 w-4 mr-1" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        {/* Search - Always visible */}
        <div className="mb-5">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by registration number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters - Expandable on mobile */}
        <div className={`${isFilterExpanded ? 'block' : 'hidden'} md:block space-y-5`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Vehicle Type</label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {vehicleTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Sort By</label>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white">
                  <SelectValue placeholder="Select sort field" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Date Added</SelectItem>
                  <SelectItem value="manufacturer">Manufacturer</SelectItem>
                  <SelectItem value="model">Model</SelectItem>
                  <SelectItem value="registration_number">Registration Number</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">Sort Direction</label>
              <Select
                value={sortDirection}
                onValueChange={(value) => setSortDirection(value as 'asc' | 'desc')}
              >
                <SelectTrigger className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white">
                  <SelectValue placeholder="Select direction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Ascending</SelectItem>
                  <SelectItem value="desc">Descending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors dark:text-white dark:hover:bg-neutral-950"
            >
              Reset
            </Button>
            <Button
              onClick={handleApplyFilters}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VehicleFilters;