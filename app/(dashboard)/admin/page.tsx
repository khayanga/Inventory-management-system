"use client";

import { useLoadingState } from "@/components/LoadingContext";
import { ModeToggle } from "@/components/ModeToggle";
import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect } from "react";

const Page = () => {
  const { data: session, status } = useSession();
  const { isLoading, setIsLoading } = useLoadingState();

  useEffect(() => {
    // Synchronize loading state with session status
    setIsLoading(status === "loading");
  }, [status, setIsLoading]);

  if (isLoading || status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }
  

  if (!session) {
    return <p>You are not logged in. Please sign in to access the dashboard.</p>;
  }

  return (
    <div>
      <h1 className="text-lg text-center font-bold">Welcome to my admin page</h1>
      <p className="text-center">
        Logged in as: <strong>{session.user?.username || session.user?.email}</strong>
      </p>
      <Link href="/signout">
        <button className="text-center bg-violet-300 text-white">Sign out</button>
      </Link>
      <ModeToggle />
    </div>
  );
};

export default Page;
