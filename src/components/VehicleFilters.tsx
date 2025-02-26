import React, { useEffect, useState, useRef } from "react";
import { fetchVehicleTypes } from "@/services/api";
import { VehicleType, VehicleFilterParams } from "@/types/Vehicle";
import { Button } from "./ui/button";
import { SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface VehicleFiltersProps {
  onFilterChange: (filters: {
    vehicle_type_id?: number;
    search?: string;
    sort_by?: string;
    sort_direction?: "asc" | "desc";
  }) => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({ onFilterChange }) => {
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  
  // Use a ref to track if this is the first render
  const isInitialMount = useRef(true);
  // Track previous filter values to avoid unnecessary updates
  const previousFilters = useRef<VehicleFilterParams>({
    vehicle_type_id: undefined,
    search: undefined,
    sort_by: "created_at",
    sort_direction: "desc"
  });

  // Load vehicle types on mount
  useEffect(() => {
    const loadVehicleTypes = async () => {
      try {
        const types = await fetchVehicleTypes();
        setVehicleTypes(Array.isArray(types) ? types : []);
      } catch (error) {
        console.error("Failed to fetch vehicle types:", error);
        setVehicleTypes([]);
      }
    };
    loadVehicleTypes();
  }, []);

  // Apply filters when filter values change, but skip the first render
  useEffect(() => {
    // Skip the first render to avoid initial filter application
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Construct current filters object
    const currentFilters = {
      vehicle_type_id: selectedType && selectedType !== "all" 
        ? parseInt(selectedType) 
        : undefined,
      search: search.trim() || undefined,
      sort_by: sortBy,
      sort_direction: sortDirection,
    };
    
    // Check if filters have actually changed
    const hasChanged = 
      previousFilters.current.vehicle_type_id !== currentFilters.vehicle_type_id ||
      previousFilters.current.search !== currentFilters.search ||
      previousFilters.current.sort_by !== currentFilters.sort_by ||
      previousFilters.current.sort_direction !== currentFilters.sort_direction;
    
    // Only apply filters if they've changed
    if (hasChanged) {
      console.log("Filters changed, applying:", currentFilters);
      onFilterChange(currentFilters);
      
      // Update previous filters (with explicit typing)
      previousFilters.current = {
        vehicle_type_id: currentFilters.vehicle_type_id,
        search: currentFilters.search,
        sort_by: currentFilters.sort_by,
        sort_direction: currentFilters.sort_direction
      };
    }
  }, [selectedType, search, sortBy, sortDirection, onFilterChange]);

  const handleReset = () => {
    setSelectedType("all");
    setSearch("");
    setSortBy("created_at");
    setSortDirection("desc");
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // Debounce search to reduce filter updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isInitialMount.current && search !== previousFilters.current.search) {
        const currentFilters = {
          vehicle_type_id: selectedType && selectedType !== "all" 
            ? parseInt(selectedType) 
            : undefined,
          search: search.trim() || undefined,
          sort_by: sortBy,
          sort_direction: sortDirection,
        };
        
        onFilterChange(currentFilters);
        previousFilters.current = {
          vehicle_type_id: currentFilters.vehicle_type_id,
          search: currentFilters.search,
          sort_by: currentFilters.sort_by,
          sort_direction: currentFilters.sort_direction
        };
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [search, selectedType, sortBy, sortDirection, onFilterChange]);

  return (
    <div className="mb-6">
      <div className="flex flex-row items-center justify-between pb-2 pt-6">
        <h2 className="text-md font-semibold">Vehicles</h2>
      </div>

      <div className="flex gap-2 items-center">
        {/* Search - Always visible */}
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleSearchChange}
              className="pl-10 text-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Filters Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Vehicle Type
                </label>
                <Select
                  value={selectedType}
                  onValueChange={setSelectedType}
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
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Sort By
                </label>
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-neutral-950 dark:text-white">
                    <SelectValue placeholder="Select sort field" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Date Added</SelectItem>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="model">Model</SelectItem>
                    <SelectItem value="registration_number">
                      Registration Number
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                  Sort Direction
                </label>
                <Select
                  value={sortDirection}
                  onValueChange={(value) => 
                    setSortDirection(value as "asc" | "desc")
                  }
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

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors dark:text-white dark:hover:bg-neutral-950"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default VehicleFilters;