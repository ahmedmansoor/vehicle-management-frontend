import Link from "next/link"
import { ModeToggle } from "@/components/ModeToggle"

export function MainNav() {
  return (
    <div className="flex items-center justify-between w-full mx-4">
      <div className="flex items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="inline-block font-semibold">Vehicle Management System</span>
        </Link>
      </div>
      
      <ModeToggle />
    </div>
  )
}