"use client";

import { useLoadingState } from "@/components/LoadingContext";
import { ModeToggle } from "@/components/ModeToggle";
import Spinner from "@/components/Spinner";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const { isLoading, setIsLoading } = useLoadingState();

  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status, setIsLoading]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (status === "unauthenticated" || !session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg">You are not logged in. Please sign in to access the dashboard.</p>
        <Link href="/signin" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-lg font-bold">Welcome to my admin page</h1>
      <p className="text-center">
        Logged in as: <strong>{session.user?.name || session.user?.email}</strong>
      </p>
      
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

