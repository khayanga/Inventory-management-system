"use client";
import Signin from "@/components/auth/Signin";
import React from "react";

export default function Home() {
  
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [email, setEmail] = React.useState("");

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-8">
     <Signin onOtpRequired={(militaryId: string) => {
       console.log("OTP required for:", militaryId);
       setShowOtpModal(true);
     }} />
      
    </div>
  );
}


