export interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  age: number
  phone: string
  address: {
    address: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  company: {
    department: string
    name: string
    title: string
  }
  image: string
  rating: number
  bio?: string
  projects?: Project[]
  feedback?: Feedback[]
}

export interface Project {
  id: number
  name: string
  status: "completed" | "in-progress" | "pending"
  completion: number
}

export interface Feedback {
  id: number
  reviewer: string
  rating: number
  comment: string
  date: string
}
