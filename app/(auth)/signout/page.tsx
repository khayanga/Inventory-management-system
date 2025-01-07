"use client"
import React from 'react'
import { signOut } from "next-auth/react";

const page = () => {
    const handleSignOut = () => {
        signOut({ callbackUrl: "/signin" }); // Redirect to the sign-in page after signing out
      };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Are you sure you want to sign out?</h1>
      <div className="mt-4 flex space-x-4">
        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Yes, Sign Out
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-gray-300 text-black rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default page