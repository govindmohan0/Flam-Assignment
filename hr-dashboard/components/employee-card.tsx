"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Bookmark, Eye, TrendingUp, BookmarkCheck } from "lucide-react"
import type { Employee } from "@/lib/types"
import { useBookmarks } from "@/lib/bookmark-context"
import { cn } from "@/lib/utils"

interface EmployeeCardProps {
  employee: Employee
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks()
  const [isPromoted, setIsPromoted] = useState(false)
  const bookmarked = isBookmarked(employee.id)

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(employee.id)
    } else {
      addBookmark(employee.id)
    }
  }

  const handlePromote = () => {
    setIsPromoted(true)
    setTimeout(() => setIsPromoted(false), 2000)
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-lime-400"
    if (rating >= 3) return "text-yellow-400"
    return "text-red-400"
  }

  const getDepartmentColor = (department: string) => {
    const colors = {
      Engineering: "bg-gray-900 text-lime-400 border border-lime-400/30",
      Marketing: "bg-gray-900 text-pink-400 border border-pink-400/30",
      Sales: "bg-gray-900 text-emerald-400 border border-emerald-400/30",
      HR: "bg-gray-900 text-purple-400 border border-purple-400/30",
      Finance: "bg-gray-900 text-yellow-400 border border-yellow-400/30",
      Operations: "bg-gray-900 text-blue-400 border border-blue-400/30",
      Design: "bg-gray-900 text-red-400 border border-red-400/30",
      Product: "bg-gray-900 text-orange-400 border border-orange-400/30",
      Legal: "bg-gray-900 text-gray-400 border border-gray-400/30",
      Support: "bg-gray-900 text-teal-400 border border-teal-400/30",
    }
    return colors[department as keyof typeof colors] || "bg-gray-900 text-gray-400 border border-gray-400/30"
  }

  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gray-900/50 border-gray-700 hover:border-lime-400/50 cyber-border hover:cyber-glow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div className="relative overflow-hidden rounded-full">
              <Image
                src={employee.image || "/placeholder.svg"}
                alt={`${employee.firstName} ${employee.lastName}`}
                width={64}
                height={64}
                className="rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-lime-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            {isPromoted && (
              <div className="absolute -top-2 -right-2 bg-lime-400 text-black rounded-full p-1 animate-pulse cyber-glow">
                <TrendingUp className="h-3 w-3" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg truncate text-white">
                {employee.firstName} {employee.lastName}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBookmark}
                className={cn(
                  "h-8 w-8 p-0 transition-all duration-200",
                  bookmarked
                    ? "text-lime-400 hover:text-lime-300 hover:bg-gray-800"
                    : "text-gray-400 hover:text-lime-400 hover:bg-gray-800",
                )}
              >
                {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
              </Button>
            </div>

            <p className="text-sm text-gray-400 truncate">{employee.email}</p>
            <p className="text-sm text-gray-400">Age: {employee.age}</p>

            <div className="flex items-center justify-between mt-2">
              <Badge className={getDepartmentColor(employee.company.department)}>{employee.company.department}</Badge>

              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4 transition-colors duration-200",
                      i < employee.rating ? `fill-current ${getRatingColor(employee.rating)}` : "text-gray-600",
                    )}
                  />
                ))}
                <span className="text-sm font-medium ml-1 text-gray-300">{employee.rating}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-6 py-4 bg-gray-800/50 flex justify-between">
        <Link href={`/employee/${employee.id}`}>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-lime-400 hover:text-lime-400"
          >
            <Eye className="h-4 w-4" />
            <span>View</span>
          </Button>
        </Link>

        <Button
          size="sm"
          onClick={handlePromote}
          disabled={isPromoted}
          className={cn(
            "flex items-center space-x-1 transition-all duration-200",
            isPromoted
              ? "bg-green-500 hover:bg-green-600 text-white"
              : "bg-lime-400 hover:bg-lime-300 text-black font-medium cyber-glow",
          )}
        >
          <TrendingUp className="h-4 w-4" />
          <span>{isPromoted ? "Promoted!" : "Promote"}</span>
        </Button>
      </CardFooter>
    </Card>
  )
}
