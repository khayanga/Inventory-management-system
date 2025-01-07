
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function Home({ pageProps }: any) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin"); // Redirect to the sign-in page if not logged in
    }
  }, [status, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null; // Prevent rendering while redirecting
  }

  return (
    <SessionProvider session={pageProps?.session}>
      <div>
        <h1 className="text-center text-xl font-bold">Welcome to the Inventory App</h1>
        <p className="text-center">Hello, {session.user?.username}!</p>
      </div>
    </SessionProvider>
  );
}

