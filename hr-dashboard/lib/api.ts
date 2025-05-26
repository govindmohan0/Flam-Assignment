import type { Employee, Project, Feedback } from "./types"

// Seeded random function to ensure consistent ratings across page reloads
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function getSeededRating(employeeId: number): number {
  // Use employee ID as seed to get consistent rating
  const random = seededRandom(employeeId * 12345) // Multiply by large number for better distribution
  return Math.floor(random * 5) + 1
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

const projects: Project[] = [
  { id: 1, name: "Website Redesign", status: "completed", completion: 100 },
  { id: 2, name: "Mobile App Development", status: "in-progress", completion: 75 },
  { id: 3, name: "Database Migration", status: "pending", completion: 0 },
  { id: 4, name: "API Integration", status: "in-progress", completion: 60 },
  { id: 5, name: "Security Audit", status: "completed", completion: 100 },
]

const feedbackTemplates: Omit<Feedback, "id">[] = [
  { reviewer: "John Manager", rating: 5, comment: "Excellent performance and leadership skills", date: "2024-01-15" },
  {
    reviewer: "Sarah Director",
    rating: 4,
    comment: "Great team player with strong technical skills",
    date: "2024-01-10",
  },
  { reviewer: "Mike Lead", rating: 4, comment: "Consistently delivers high-quality work", date: "2024-01-05" },
  { reviewer: "Lisa VP", rating: 5, comment: "Outstanding problem-solving abilities", date: "2023-12-20" },
]

export async function fetchEmployees(): Promise<Employee[]> {
  try {
    const response = await fetch("https://dummyjson.com/users?limit=20")
    const data = await response.json()

    return data.users.map((user: any, index: number) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      phone: user.phone,
      address: user.address,
      company: {
        department: departments[Math.floor(Math.random() * departments.length)],
        name: user.company?.name || "TechCorp Inc.",
        title: user.company?.title || "Software Engineer",
      },
      image: user.image,
      rating: getSeededRating(user.id),
      bio: `Experienced professional with ${Math.floor(seededRandom(user.id * 54321) * 10) + 1} years in ${departments[Math.floor(seededRandom(user.id * 98765) * departments.length)]}. Passionate about innovation and team collaboration.`,
      projects: projects.slice(0, Math.floor(seededRandom(user.id * 11111) * 3) + 1),
      feedback: feedbackTemplates
        .slice(0, Math.floor(seededRandom(user.id * 22222) * 3) + 1)
        .map((f, i) => ({ ...f, id: i + 1 })),
    }))
  } catch (error) {
    console.error("Failed to fetch employees:", error)
    return []
  }
}

export async function fetchEmployee(id: number): Promise<Employee | null> {
  const employees = await fetchEmployees()
  return employees.find((emp) => emp.id === id) || null
}
