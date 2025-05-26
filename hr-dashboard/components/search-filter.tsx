"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"

interface SearchFilterProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedDepartments: string[]
  onDepartmentChange: (departments: string[]) => void
  selectedRatings: number[]
  onRatingChange: (ratings: number[]) => void
}

const departments = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
  "Operations",
  "Design",
  "Product",
  "Legal",
  "Support",
]

const ratings = [1, 2, 3, 4, 5]

export function SearchFilter({
  searchTerm,
  onSearchChange,
  selectedDepartments,
  onDepartmentChange,
  selectedRatings,
  onRatingChange,
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const handleDepartmentToggle = (department: string) => {
    if (selectedDepartments.includes(department)) {
      onDepartmentChange(selectedDepartments.filter((d) => d !== department))
    } else {
      onDepartmentChange([...selectedDepartments, department])
    }
  }

  const handleRatingToggle = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      onRatingChange(selectedRatings.filter((r) => r !== rating))
    } else {
      onRatingChange([...selectedRatings, rating])
    }
  }

  const clearFilters = () => {
    onDepartmentChange([])
    onRatingChange([])
    onSearchChange("")
  }

  const hasActiveFilters = selectedDepartments.length > 0 || selectedRatings.length > 0 || searchTerm

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-lime-400 h-4 w-4" />
          <Input
            placeholder="Search by name, email, or department..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-lime-400 focus:ring-lime-400"
          />
        </div>

        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center space-x-2 bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-lime-400 hover:text-lime-400"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <Badge className="ml-2 bg-lime-400 text-black">
                  {selectedDepartments.length + selectedRatings.length}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 bg-gray-900 border-gray-700" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-white">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-lime-400 hover:text-lime-300 hover:bg-gray-800"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Departments</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map((dept) => (
                    <Badge
                      key={dept}
                      variant={selectedDepartments.includes(dept) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedDepartments.includes(dept)
                          ? "bg-lime-400 text-black hover:bg-lime-300"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-lime-400 hover:text-lime-400"
                      }`}
                      onClick={() => handleDepartmentToggle(dept)}
                    >
                      {dept}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block text-gray-300">Performance Rating</label>
                <div className="flex gap-2">
                  {ratings.map((rating) => (
                    <Badge
                      key={rating}
                      variant={selectedRatings.includes(rating) ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedRatings.includes(rating)
                          ? "bg-lime-400 text-black hover:bg-lime-300"
                          : "border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-lime-400 hover:text-lime-400"
                      }`}
                      onClick={() => handleRatingToggle(rating)}
                    >
                      {rating}★
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge className="flex items-center space-x-1 bg-gray-800 text-lime-400 border border-lime-400/30">
              <span>Search: {searchTerm}</span>
              <X className="h-3 w-3 cursor-pointer hover:text-lime-300" onClick={() => onSearchChange("")} />
            </Badge>
          )}
          {selectedDepartments.map((dept) => (
            <Badge
              key={dept}
              className="flex items-center space-x-1 bg-gray-800 text-lime-400 border border-lime-400/30"
            >
              <span>{dept}</span>
              <X className="h-3 w-3 cursor-pointer hover:text-lime-300" onClick={() => handleDepartmentToggle(dept)} />
            </Badge>
          ))}
          {selectedRatings.map((rating) => (
            <Badge
              key={rating}
              className="flex items-center space-x-1 bg-gray-800 text-lime-400 border border-lime-400/30"
            >
              <span>{rating}★</span>
              <X className="h-3 w-3 cursor-pointer hover:text-lime-300" onClick={() => handleRatingToggle(rating)} />
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
