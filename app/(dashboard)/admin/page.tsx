"use client";
import { ModeToggle } from "@/components/ModeToggle";
import {  signOut } from "next-auth/react";
import React, { useEffect } from "react";

const Page = () => {
 

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-lg font-bold">Welcome to my admin page</h1>
      
      
      <button 
        onClick={() => signOut()} 
        className="mt-4 bg-violet-500 text-white px-4 py-2 rounded-md"
      >
        Sign Out
      </button>

      <ModeToggle />
    </div>
  );
};

export default Page;




