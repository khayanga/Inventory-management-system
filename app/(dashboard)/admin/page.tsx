"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Page = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
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
