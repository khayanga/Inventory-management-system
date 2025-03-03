"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useLoadingState } from "@/components/LoadingContext";


const PageLoader = () => {
  const { setIsLoading } = useLoadingState();
  const pathname = usePathname();
  const [isFirstRender, setIsFirstRender] = useState(true);

  useEffect(() => {
    if (isFirstRender) {
      setIsFirstRender(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname, setIsLoading]);

  return null;
};

export default PageLoader;
