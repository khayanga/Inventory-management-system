'use client'
import { ModeToggle } from '@/components/ModeToggle'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'

const page = () => {
 
  return (
    <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-lg font-bold">Welcome to my client dashboardpage</h1>
          
          
          <button 
            onClick={() => signOut()} 
            className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-md"
          >
            Sign Out
          </button>
    
          <ModeToggle />

          <Link href="/weapons" className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-md">
            Go to Weapons 
          </Link>

          <Link href="/officers" className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-md">
            Manage Officers 
          </Link>
        </div>
  )
}

export default page