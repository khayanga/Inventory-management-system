'use client'
import React from "react";
import OtpForm from "@/components/OtpForm";
import Signin from "@/components/Signin";

const Page = () => {
  const [showOtpModal, setShowOtpModal] = React.useState(false);
  const [email, setEmail] = React.useState("");

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-8">
      <Signin onOtpRequired={(email) => { setEmail(email); setShowOtpModal(true); }} />
      <OtpForm email={email} open={showOtpModal} onClose={() => setShowOtpModal(false)} onVerified={() => {}} />
    </div>
  );
};

export default Page;







