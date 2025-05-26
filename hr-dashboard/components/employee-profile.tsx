"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, MapPin, Phone, Mail, Building, Calendar, Send } from "lucide-react"
import type { Employee } from "@/lib/types"
import { cn } from "@/lib/utils"

interface EmployeeProfileProps {
  employee: Employee
}

export function EmployeeProfile({ employee }: EmployeeProfileProps) {
  const [newFeedback, setNewFeedback] = useState("")

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-500"
    if (rating >= 3) return "text-yellow-500"
    return "text-red-500"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in-progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const handleSubmitFeedback = () => {
    if (newFeedback.trim()) {
      // In a real app, this would submit to an API
      console.log("Submitting feedback:", newFeedback)
      setNewFeedback("")
      // Show success message
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Image
                  src={employee.image || "/placeholder.svg"}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto object-cover"
                />

                <div>
                  <h1 className="text-2xl font-bold">
                    {employee.firstName} {employee.lastName}
                  </h1>
                  <p className="text-muted-foreground">{employee.company.title}</p>
                  <Badge className="mt-2">{employee.company.department}</Badge>
                </div>

                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-5 w-5",
                        i < employee.rating ? `fill-current ${getRatingColor(employee.rating)}` : "text-gray-300",
                      )}
                    />
                  ))}
                  <span className="text-lg font-medium ml-2">{employee.rating}/5</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.phone}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span>{employee.company.name}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Age: {employee.age}</span>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{employee.address.address}</div>
                    <div>
                      {employee.address.city}, {employee.address.state}
                    </div>
                    <div>
                      {employee.address.postalCode}, {employee.address.country}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{employee.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { period: "Q4 2023", rating: employee.rating, improvement: "+0.5" },
                      { period: "Q3 2023", rating: Math.max(1, employee.rating - 0.5), improvement: "+0.2" },
                      { period: "Q2 2023", rating: Math.max(1, employee.rating - 0.7), improvement: "+0.3" },
                      { period: "Q1 2023", rating: Math.max(1, employee.rating - 1), improvement: "0" },
                    ].map((period, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{period.period}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < period.rating ? `fill-current ${getRatingColor(period.rating)}` : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <Badge variant={period.improvement.startsWith("+") ? "default" : "secondary"}>
                          {period.improvement}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Current Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.projects?.map((project) => (
                      <div key={project.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{project.name}</h4>
                          <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{project.completion}%</span>
                          </div>
                          <Progress value={project.completion} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {employee.feedback?.map((feedback) => (
                      <div key={feedback.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{feedback.reviewer}</p>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-4 w-4",
                                  i < feedback.rating
                                    ? `fill-current ${getRatingColor(feedback.rating)}`
                                    : "text-gray-300",
                                )}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-muted-foreground">{feedback.comment}</p>
                        <p className="text-xs text-muted-foreground">{feedback.date}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Add Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write your feedback here..."
                      value={newFeedback}
                      onChange={(e) => setNewFeedback(e.target.value)}
                      rows={4}
                    />
                    <Button onClick={handleSubmitFeedback} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
