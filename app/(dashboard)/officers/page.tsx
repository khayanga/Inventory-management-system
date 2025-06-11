
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OfficerTable from "@/components/officers/OfficerTable";
import { useOfficers } from "@/hooks/useOfficers";

const page = () => {
  const {getAllOfficers} = useOfficers()
   const [officers, setOfficers] = useState<any[]>([]);

   const fetchOfficers = async () =>{
    const data = await getAllOfficers();
    setOfficers(data);

   }

   useEffect(() => {
    fetchOfficers();
   }, []);

   

  
  return (
    <div className="p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Officer Mangement</h1>
            {/* <Button onClick={() => setOpenForm(true)}>Add Officer</Button> */}
          </div>
    
        <OfficerTable officers={officers} />
       
        </div>
  )
}

export default page