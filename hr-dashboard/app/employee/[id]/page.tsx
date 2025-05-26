import { notFound } from "next/navigation"
import { fetchEmployee } from "@/lib/api"
import { EmployeeProfile } from "@/components/employee-profile"

interface EmployeePageProps {
  params: {
    id: string
  }
}

export default async function EmployeePage({ params }: EmployeePageProps) {
  const employee = await fetchEmployee(Number.parseInt(params.id))

  if (!employee) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-black w-full">
      <div className="p-4">
        <EmployeeProfile employee={employee} />
      </div>
    </div>
  )
}
