
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import OfficerForm from "@/components/officers/OfficerForm";
import { useToast } from "@/hooks/use-toast";
import OfficerTable from "@/components/officers/OfficerTable";

const page = () => {
  const [openForm, setOpenForm] = useState(false);
  const {toast}= useToast()
  const [officers, setOfficers] = useState([]);
  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async()=>{
    const res = await fetch("/api/officers")
    const data = await res.json();
    setOfficers(data.officers)
  }

  const handleSubmit = async(values:any)=>{
    await fetch("/api/officers",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    })
    setOpenForm(false);
    toast({
      title: "Officer Added",
      description: "The officer has been added successfully.",
      variant: "default",
    });
    fetchOfficers();
  }
  return (
    <div className="p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Officer Mangement</h1>
            <Button onClick={() => setOpenForm(true)}>Add Officer</Button>
          </div>
    
        <OfficerTable officers={officers} />
        <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Officer</DialogTitle>
              </DialogHeader>
              <OfficerForm onSubmit={handleSubmit} />
            </DialogContent>
          </Dialog>
        </div>
  )
}

export default page