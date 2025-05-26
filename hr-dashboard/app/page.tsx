"use client"

import { useState, useEffect, useMemo } from "react"
import { EmployeeCard } from "@/components/employee-card"
import { SearchFilter } from "@/components/search-filter"
import { CreateUserModal } from "@/components/create-user-modal"
import { Pagination } from "@/components/pagination"
import type { Employee } from "@/lib/types"
import { fetchEmployees } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedRatings, setSelectedRatings] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (error) {
        console.error("Failed to load employees:", error)
      } finally {
        setLoading(false)
      }
    }

    loadEmployees()
  }, [])

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const matchesSearch =
        employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.company.department.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment =
        selectedDepartments.length === 0 || selectedDepartments.includes(employee.company.department)

      const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(employee.rating)

      return matchesSearch && matchesDepartment && matchesRating
    })
  }, [employees, searchTerm, selectedDepartments, selectedRatings])

  // Pagination logic
  const totalPages = Math.ceil(filteredEmployees.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedDepartments, selectedRatings, pageSize])

  const handleUserCreated = (newUser: Employee) => {
    setEmployees((prev) => [newUser, ...prev])
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black w-full">
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full max-w-md bg-gray-800" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20 bg-gray-800" />
              <Skeleton className="h-8 w-24 bg-gray-800" />
              <Skeleton className="h-8 w-16 bg-gray-800" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 border border-gray-700 rounded-lg bg-gray-900/50">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <Skeleton className="h-3 w-48 bg-gray-700" />
                    <Skeleton className="h-3 w-24 bg-gray-700" />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-16 bg-gray-700" />
                  <Skeleton className="h-8 w-20 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="p-4 space-y-4">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400/10 to-lime-400/5 rounded-2xl blur-3xl"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-lime-400/20 cyber-glow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-4xl font-bold tracking-tight">
                  <span className="cyber-text-gradient">Employee Dashboard</span>
                </h1>
                <p className="text-gray-400 mt-2 text-lg">
                  Manage and track employee performance across your organization
                </p>
              </div>
              <CreateUserModal onUserCreated={handleUserCreated} />
            </div>
          </div>
        </div>

        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedDepartments={selectedDepartments}
          onDepartmentChange={setSelectedDepartments}
          selectedRatings={selectedRatings}
          onRatingChange={setSelectedRatings}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing <span className="font-medium text-lime-400">{paginatedEmployees.length}</span> of{" "}
            <span className="font-medium text-lime-400">{filteredEmployees.length}</span> employees
            {filteredEmployees.length !== employees.length && <span> (filtered from {employees.length} total)</span>}
          </p>
        </div>

        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center border border-lime-400/30">
              <span className="text-2xl">🔍</span>
            </div>
            <p className="text-gray-400 text-lg">No employees found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
              {paginatedEmployees.map((employee, index) => (
                <div
                  key={employee.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationDuration: "500ms",
                    animationFillMode: "both",
                  }}
                >
                  <EmployeeCard employee={employee} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={filteredEmployees.length}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
