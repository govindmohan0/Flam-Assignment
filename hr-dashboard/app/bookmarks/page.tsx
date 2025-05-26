"use client"

import { useState, useEffect } from "react"
import { EmployeeCard } from "@/components/employee-card"
import type { Employee } from "@/lib/types"
import { fetchEmployees } from "@/lib/api"
import { useBookmarks } from "@/lib/bookmark-context"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Bookmark, Users, Briefcase } from "lucide-react"

export default function BookmarksPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const { bookmarks } = useBookmarks()

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

  const bookmarkedEmployees = employees.filter((emp) => bookmarks.includes(emp.id))

  const handleBulkAction = (action: string) => {
    console.log(
      `Performing ${action} on bookmarked employees:`,
      bookmarkedEmployees.map((emp) => emp.id),
    )
    // In a real app, this would trigger the appropriate API calls
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black w-full">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-48 bg-gray-800" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4 p-6 border border-gray-700 rounded-lg bg-gray-900/50">
                <div className="flex items-start space-x-4">
                  <Skeleton className="h-16 w-16 rounded-full bg-gray-700" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32 bg-gray-700" />
                    <Skeleton className="h-3 w-48 bg-gray-700" />
                    <Skeleton className="h-3 w-24 bg-gray-700" />
                  </div>
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center space-x-2">
              <Bookmark className="h-8 w-8 text-lime-400" />
              <span className="cyber-text-gradient">Bookmarked Employees</span>
            </h1>
            <p className="text-gray-400 mt-2">Manage your saved employees and perform bulk actions</p>
          </div>

          {bookmarkedEmployees.length > 0 && (
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction("promote")}
                className="flex items-center space-x-2 bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-lime-400 hover:text-lime-400"
              >
                <Users className="h-4 w-4" />
                <span>Bulk Promote</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("assign-project")}
                className="flex items-center space-x-2 bg-gray-900 border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-lime-400 hover:text-lime-400"
              >
                <Briefcase className="h-4 w-4" />
                <span>Assign to Project</span>
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            <span className="font-medium text-lime-400">{bookmarkedEmployees.length}</span> bookmarked employee
            {bookmarkedEmployees.length !== 1 ? "s" : ""}
          </p>
        </div>

        {bookmarkedEmployees.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-800 rounded-full flex items-center justify-center border border-lime-400/30">
              <Bookmark className="h-12 w-12 text-lime-400" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-white">No bookmarked employees</h3>
            <p className="text-gray-400">Start bookmarking employees from the dashboard to see them here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedEmployees.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
