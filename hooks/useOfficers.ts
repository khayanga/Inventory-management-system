"use client";
import { useState } from "react";
import React from "react";
import { useToast } from "./use-toast";
import { Officer } from "@/lib/types/officer";

export const useOfficers = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAllOfficers = async (): Promise<Officer[]> => {
    setLoading(true);
    try {
      const res = await fetch("/api/officers");
      if (!res.ok) throw new Error("Failed to fetch officers");
      const data = await res.json();
      return data.officers;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast({
        title: "Error",
        description: "Failed to fetch officers",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOfficerById = async (id:string): Promise<Officer | null> =>{
    setLoading(true);
    try {
        const res = await fetch(`/api/officers/${id}`);
        if(!res.ok){
            throw new Error("Failed to fetch officer");
        }
        const data = await res.json();
        return data.officer ;
        
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      toast({
        title: "Error",
        description: "Failed to fetch officer",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }

  }

  return {
    getAllOfficers,
    getOfficerById,
    loading,
    error,
  };
};
