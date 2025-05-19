"use client";
import { useEffect, useState } from "react";
import WeaponTable from '@/components/weapons/WeaponTable'
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { WeaponForm } from "@/components/weapons/WeaponForm";
import { CheckoutForm } from "@/components/weapons/Checkout";



const page = () => {
    const [weapons, setWeapons] = useState([]);
    const [openForm, setOpenForm] = useState(false);
    const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);
    const [openCheckout, setOpenCheckout] = useState(false);
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

      const handleCheckout = async (values: any) => {
        const res = await fetch("/api/weapons/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        
        if (res.ok) {
          setOpenCheckout(false);
          fetchWeapons();
        } else {
          const error = await res.json();
          alert(error.error || "Failed to checkout weapon");
        }
      };
    
      const handleAssignClick = (weaponId: string) => {
        setSelectedWeapon(weaponId);
        setOpenCheckout(true);
      };
    

    
  return (
    <div className="p-4">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Weapon Inventory</h1>
        <Button onClick={() => setOpenForm(true)}>Add New Weapon</Button>
      </div>

    <WeaponTable weapons={weapons}
    onAssignClick={handleAssignClick} />
    <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Weapon</DialogTitle>
          </DialogHeader>
          <WeaponForm onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>

      <Dialog open={openCheckout} onOpenChange={setOpenCheckout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Checkout Weapon</DialogTitle>
          </DialogHeader>
          {selectedWeapon && (
            <CheckoutForm
              weaponId={selectedWeapon}
              onCheckout={handleCheckout}
              onCancel={() => setOpenCheckout(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default page