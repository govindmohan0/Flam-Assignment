"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, Pie, PieChart, Cell } from "recharts"
import type { Employee } from "@/lib/types"
import { fetchEmployees } from "@/lib/api"
import { useBookmarks } from "@/lib/bookmark-context"
import { BarChart3, Users, Star, Bookmark, TrendingUp, PieChartIcon, Trophy, Crown } from "lucide-react"

export default function AnalyticsPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [animationProgress, setAnimationProgress] = useState(0)
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

  // Animation effect for the leaderboard
  useEffect(() => {
    if (!loading && employees.length > 0) {
      const timer = setTimeout(() => {
        setAnimationProgress(100)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [loading, employees])

  // Calculate analytics
  const departmentStats = employees.reduce(
    (acc, emp) => {
      const dept = emp.company.department
      if (!acc[dept]) {
        acc[dept] = { count: 0, totalRating: 0, employees: [] }
      }
      acc[dept].count++
      acc[dept].totalRating += emp.rating
      acc[dept].employees.push(emp)
      return acc
    },
    {} as Record<string, { count: number; totalRating: number; employees: Employee[] }>,
  )

  // Prepare data for bar chart
  const departmentChartData = Object.entries(departmentStats)
    .map(([dept, stats]) => ({
      department: dept.length > 8 ? dept.substring(0, 8) + "..." : dept,
      fullDepartment: dept,
      count: stats.count,
      averageRating: Number((stats.totalRating / stats.count).toFixed(1)),
      employees: stats.employees,
    }))
    .sort((a, b) => b.averageRating - a.averageRating)

  // Prepare top performers data
  const topPerformers = employees
    .sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return b.firstName.localeCompare(a.firstName)
    })
    .slice(0, 10)
    .map((emp, index) => ({
      ...emp,
      rank: index + 1,
      score: emp.rating * 20, // Convert to percentage for bar width
      animatedScore: (emp.rating * 20 * animationProgress) / 100,
    }))

  // Prepare data for pie chart
  const ratingDistribution = employees.reduce(
    (acc, emp) => {
      acc[emp.rating] = (acc[emp.rating] || 0) + 1
      return acc
    },
    {} as Record<number, number>,
  )

  const ratingChartData = [
    {
      rating: "5 Stars",
      value: ratingDistribution[5] || 0,
      fill: "#84cc16", // Lime green for 5 stars
      percentage: (((ratingDistribution[5] || 0) / employees.length) * 100).toFixed(1),
    },
    {
      rating: "4 Stars",
      value: ratingDistribution[4] || 0,
      fill: "#a3e635", // Light lime for 4 stars
      percentage: (((ratingDistribution[4] || 0) / employees.length) * 100).toFixed(1),
    },
    {
      rating: "3 Stars",
      value: ratingDistribution[3] || 0,
      fill: "#facc15", // Yellow for 3 stars
      percentage: (((ratingDistribution[3] || 0) / employees.length) * 100).toFixed(1),
    },
    {
      rating: "2 Stars",
      value: ratingDistribution[2] || 0,
      fill: "#f97316", // Orange for 2 stars
      percentage: (((ratingDistribution[2] || 0) / employees.length) * 100).toFixed(1),
    },
    {
      rating: "1 Star",
      value: ratingDistribution[1] || 0,
      fill: "#ef4444", // Red for 1 star
      percentage: (((ratingDistribution[1] || 0) / employees.length) * 100).toFixed(1),
    },
  ].filter((item) => item.value > 0)

  const totalEmployees = employees.length
  const averageRating =
    employees.length > 0 ? (employees.reduce((sum, emp) => sum + emp.rating, 0) / employees.length).toFixed(1) : "0"
  const highPerformers = employees.filter((emp) => emp.rating >= 4).length
  const bookmarkTrends = bookmarks.length

  const departmentChartConfig = {
    averageRating: {
      label: "Average Rating",
      color: "hsl(var(--chart-1))",
    },
  } satisfies import("@/components/ui/chart").ChartConfig

  const ratingChartConfig = {
    value: {
      label: "Employees",
    },
    "5 Stars": {
      label: "5 Stars",
      color: "#84cc16",
    },
    "4 Stars": {
      label: "4 Stars",
      color: "#a3e635",
    },
    "3 Stars": {
      label: "3 Stars",
      color: "#facc15",
    },
    "2 Stars": {
      label: "2 Stars",
      color: "#f97316",
    },
    "1 Star": {
      label: "1 Star",
      color: "#ef4444",
    },
  } satisfies import("@/components/ui/chart").ChartConfig

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400" // Gold
    if (rank === 2) return "text-gray-300" // Silver
    if (rank === 3) return "text-orange-400" // Bronze
    return "text-lime-400" // Default lime
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-3 w-3 text-yellow-400" />
    if (rank <= 3) return <Trophy className="h-3 w-3 text-orange-400" />
    return <Star className="h-3 w-3 text-lime-400" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black w-full">
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-gray-900/50 border-gray-700">
                <CardContent className="p-4 lg:p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-700 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-lime-400/10 to-lime-400/5 rounded-2xl blur-3xl"></div>
          <div className="relative bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-lime-400/20 cyber-glow">
            <h1 className="text-2xl lg:text-4xl font-bold tracking-tight flex items-center space-x-3">
              <div className="relative">
                <BarChart3 className="h-8 w-8 lg:h-10 lg:w-10 text-lime-400" />
                <div className="absolute inset-0 h-8 w-8 lg:h-10 lg:w-10 bg-lime-400 rounded-full blur-lg opacity-30"></div>
              </div>
              <span className="cyber-text-gradient">Analytics Dashboard</span>
            </h1>
            <p className="text-gray-400 mt-2 text-base lg:text-lg">
              Insights and metrics about your organization's performance
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300 hover:cyber-glow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-400/30">
                  <Users className="h-4 w-4 lg:h-5 lg:w-5 text-blue-400" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-400">Total Employees</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold mt-2 text-blue-400">{totalEmployees}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300 hover:cyber-glow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-lime-400/20 rounded-lg border border-lime-400/30">
                  <Star className="h-4 w-4 lg:h-5 lg:w-5 text-lime-400" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-400">Average Rating</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold mt-2 text-lime-400">{averageRating}/5</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300 hover:cyber-glow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-green-500/20 rounded-lg border border-green-400/30">
                  <TrendingUp className="h-4 w-4 lg:h-5 lg:w-5 text-green-400" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-400">High Performers</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold mt-2 text-green-400">{highPerformers}</div>
              <p className="text-xs text-gray-500 mt-1">4+ star rating</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300 hover:cyber-glow">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg border border-purple-400/30">
                  <Bookmark className="h-4 w-4 lg:h-5 lg:w-5 text-purple-400" />
                </div>
                <span className="text-xs lg:text-sm font-medium text-gray-400">Bookmarked</span>
              </div>
              <div className="text-2xl lg:text-3xl font-bold mt-2 text-purple-400">{bookmarkTrends}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Department Performance Bar Chart */}
          <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300">
            <CardHeader className="bg-gray-800/50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-white text-lg lg:text-xl">
                <BarChart3 className="h-5 w-5 lg:h-6 lg:w-6 text-lime-400" />
                <span>Department Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 lg:p-6">
              <ChartContainer config={departmentChartConfig} className="min-h-[300px] lg:min-h-[400px] w-full">
                <BarChart
                  accessibilityLayer
                  data={departmentChartData}
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 20,
                  }}
                >
                  <XAxis
                    dataKey="department"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fill: "hsl(var(--muted-foreground))",
                      fontSize: 12,
                    }}
                    domain={[0, 5]}
                  />
                  <ChartTooltip
                    cursor={{ fill: "rgba(185, 250, 0, 0.1)" }}
                    content={
                      <ChartTooltipContent
                        formatter={(value, name, props) => [`${value}/5`, `${props.payload?.fullDepartment || name}`]}
                        labelFormatter={(label, payload) => payload?.[0]?.payload?.fullDepartment || label}
                      />
                    }
                  />
                  <Bar
                    dataKey="averageRating"
                    fill="var(--color-averageRating)"
                    radius={[6, 6, 0, 0]}
                    className="hover:opacity-80 transition-opacity"
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Rating Distribution Pie Chart */}
          <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300">
            <CardHeader className="bg-gray-800/50 rounded-t-lg">
              <CardTitle className="flex items-center space-x-2 text-white text-lg lg:text-xl">
                <PieChartIcon className="h-5 w-5 lg:h-6 lg:w-6 text-lime-400" />
                <span>Rating Distribution</span>
              </CardTitle>
            </CardHeader>
            <ChartContainer config={ratingChartConfig} className="min-h-[300px] lg:min-h-[400px] w-full">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => [
                        `${value} employees (${(((value as number) / totalEmployees) * 100).toFixed(1)}%)`,
                        name,
                      ]}
                    />
                  }
                />
                <Pie
                  data={ratingChartData}
                  dataKey="value"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius="75%"
                  innerRadius="35%"
                  strokeWidth={3}
                  stroke="#000000"
                  paddingAngle={3}
                  label={({ rating, value, percentage }) => {
                    if (value === 0) return null
                    return `${rating}: ${value} (${percentage}%)`
                  }}
                  labelLine={false}
                >
                  {ratingChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.fill}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      stroke="#000000"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <ChartLegend content={<ChartLegendContent />} className="flex flex-wrap justify-center gap-2 mt-4" />
              </PieChart>
            </ChartContainer>
          </Card>
        </div>

        {/* Top Performers Leaderboard */}
        <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300">
          <CardHeader className="bg-gray-800/50 rounded-t-lg pb-3">
            <CardTitle className="flex items-center space-x-2 text-white text-lg lg:text-xl">
              <Trophy className="h-5 w-5 lg:h-6 lg:w-6 text-lime-400" />
              <span>Leaderboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="space-y-3">
              {topPerformers.map((performer, index) => {
                const barColors = [
                  "bg-gradient-to-r from-yellow-400 to-yellow-500", // Gold for #1
                  "bg-gradient-to-r from-gray-300 to-gray-400", // Silver for #2
                  "bg-gradient-to-r from-orange-400 to-orange-500", // Bronze for #3
                  "bg-gradient-to-r from-lime-400 to-lime-500", // Lime for others
                  "bg-gradient-to-r from-emerald-400 to-emerald-500",
                  "bg-gradient-to-r from-blue-400 to-blue-500",
                  "bg-gradient-to-r from-purple-400 to-purple-500",
                  "bg-gradient-to-r from-pink-400 to-pink-500",
                  "bg-gradient-to-r from-red-400 to-red-500",
                  "bg-gradient-to-r from-indigo-400 to-indigo-500",
                ]

                return (
                  <div
                    key={performer.id}
                    className="flex items-center space-x-4 group hover:bg-gray-800/30 rounded-lg p-2 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Name and Info */}
                    <div className="w-32 flex-shrink-0">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 border border-gray-600 flex-shrink-0">
                          <span className={`text-xs font-bold ${getRankColor(performer.rank)}`}>
                            {performer.rank <= 3 ? (
                              <div className="flex items-center justify-center">{getRankIcon(performer.rank)}</div>
                            ) : (
                              performer.rank
                            )}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-white truncate">{performer.firstName.toUpperCase()}</p>
                          <p className="text-xs text-gray-400 truncate">{performer.company.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex-1 relative">
                      <div className="w-full bg-gray-800 rounded-full h-6 overflow-hidden border border-gray-700">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${barColors[index % barColors.length]}`}
                          style={{
                            width: `${performer.animatedScore}%`,
                            boxShadow: "0 0 8px rgba(185, 250, 0, 0.2)",
                          }}
                        />
                      </div>

                      {/* Score overlay */}
                      <div className="absolute right-2 top-0 h-6 flex items-center">
                        <span className="text-xs font-bold text-white drop-shadow-lg">{performer.rating}/5</span>
                      </div>
                    </div>

                    {/* Profile Picture */}
                    <div className="relative flex-shrink-0">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-lime-400/50 group-hover:border-lime-400 transition-all duration-300">
                        <Image
                          src={performer.image || "/placeholder.svg"}
                          alt={`${performer.firstName} ${performer.lastName}`}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {performer.rank === 1 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Crown className="h-1.5 w-1.5 text-black" />
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers by Department */}
        <Card className="bg-gray-900/50 border-gray-700 hover:border-lime-400/50 transition-all duration-300">
          <CardHeader className="bg-gray-800/50 rounded-t-lg">
            <CardTitle className="flex items-center space-x-2 text-white text-lg lg:text-xl">
              <TrendingUp className="h-5 w-5 lg:h-6 lg:w-6 text-lime-400" />
              <span>Top Performers by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departmentChartData.slice(0, 6).map((dept, index) => {
                const topEmployee = dept.employees.sort((a, b) => b.rating - a.rating)[0]
                const getDepartmentColor = (department: string, index: number) => {
                  const colors = [
                    "bg-gray-900 text-lime-400 border border-lime-400/30",
                    "bg-gray-900 text-emerald-400 border border-emerald-400/30",
                    "bg-gray-900 text-purple-400 border border-purple-400/30",
                    "bg-gray-900 text-yellow-400 border border-yellow-400/30",
                    "bg-gray-900 text-pink-400 border border-pink-400/30",
                    "bg-gray-900 text-blue-400 border border-blue-400/30",
                    "bg-gray-900 text-red-400 border border-red-400/30",
                    "bg-gray-900 text-orange-400 border border-orange-400/30",
                    "bg-gray-900 text-teal-400 border border-teal-400/30",
                    "bg-gray-900 text-gray-400 border border-gray-400/30",
                  ]
                  return colors[index % colors.length]
                }

                return (
                  <div
                    key={dept.fullDepartment}
                    className="p-4 border border-gray-700 rounded-lg space-y-3 hover:border-lime-400/50 transition-all duration-200 bg-gray-800/30"
                  >
                    <div className="flex items-center justify-between">
                      <Badge className={getDepartmentColor(dept.fullDepartment, index)} title={dept.fullDepartment}>
                        {dept.department}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-lime-400 fill-current" />
                        <span className="text-sm font-medium text-lime-400">{dept.averageRating}</span>
                      </div>
                    </div>

                    {topEmployee && (
                      <div className="space-y-1">
                        <p className="font-medium text-sm text-white">
                          Top: {topEmployee.firstName} {topEmployee.lastName}
                        </p>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < topEmployee.rating ? "text-lime-400 fill-current" : "text-gray-600"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">{topEmployee.rating}/5</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
