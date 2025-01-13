"use client";
import { LoadingStateProvider } from "@/components/LoadingContext";
import { AppProps } from "next/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home({ Component, pageProps }: AppProps) {
  
  return (
    <LoadingStateProvider>
      <Component {...pageProps} />
    </LoadingStateProvider>
    
  );
}


