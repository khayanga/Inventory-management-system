"use client";
import { useEffect, useState } from "react";
import WeaponTable from '@/components/weapons/WeaponTable'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { WeaponForm } from "@/components/weapons/WeaponForm";



const page = () => {
    const [weapons, setWeapons] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    useEffect(() => {
        fetchWeapons();
      }, [])

      const fetchWeapons = async () => {
        const res = await fetch("/api/weapons");
        const data= await res.json();
        setWeapons(data.weapons);
      }

      const handleSubmit = async (values: any) => {
        await fetch("/api/weapons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        setOpenForm(false);
        fetchWeapons();
      };
    
  return (
    <div className="p-4">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weapon Inventory</h1>
        <Button onClick={() => setOpenForm(true)}>Add New Weapon</Button>
      </div>

    <WeaponTable weapons={weapons} />
    <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Weapon</DialogTitle>
          </DialogHeader>
          <WeaponForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default page