"use client";

import { SessionProvider } from "next-auth/react";
import { LoadingStateProvider, useLoadingState } from "@/components/LoadingContext";
import Spinner from "@/components/Spinner";
import { Toaster } from "@/components/ui/toaster";

const LoadingIndicator = () => {
  const { isLoading } = useLoadingState();
  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ) : null;
};

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <LoadingStateProvider>
        <LoadingIndicator />
        {children}
      </LoadingStateProvider>
      <Toaster/>
    </SessionProvider>
  );
}
