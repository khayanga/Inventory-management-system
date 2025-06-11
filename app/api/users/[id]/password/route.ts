import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function PATCH(req:Request, props:{params: Promise<{id:string}>}) {
    const params = await props.params;
    const user = await getCurrentUser(req)

    if(!user){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )
    }
     

    try{
      const {id} =   params
        const body = await req.json()
         const{oldPassword, newPassword} = body

        if(!oldPassword || !newPassword){
            return NextResponse.json(
                {error:"Please provide old and new password"},
                {status:400}
            )
        }

        const user = await db.user.findUnique({
            where:{id},
        })

        if(!user){
            return NextResponse.json(
                {error:"User not found"},
                {status:404}
            )
        }

        if(!user || !user.password) {
            return NextResponse.json(
                {error:"User not found"},
                {status:404}
            )
        }
        
        const isPasswordCorrect =  await bcrypt.compare(oldPassword, user.password)
        if(!isPasswordCorrect){
            return NextResponse.json(
                {error:"Old password is incorrect"},
                {status:400}
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        await db.user.update({
            where:{id},
            data:{
                password:hashedPassword
            }
        })
        return NextResponse.json(
            {message:"Password updated successfully"},
            {status:200}
        )

        
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            {error:"Failed to update password"},
            {status:500}
        )               
    }
}