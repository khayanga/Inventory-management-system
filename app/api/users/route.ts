
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const user = await getCurrentUser(req)

     if(!user){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )
     }

     try {
        const users = await db.user.findMany({
            select:{
                id:true,
                username:true,
                email:true,
                militaryId:true,
                rank:true,
                role:true,
                createdAt:true,
                updatedAt:true,
                verified:true,

            }
        })
        return NextResponse.json(
            {users},
            {status:200}
        )
        
     } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            {error:"Failed to fetch users"},
            {status:500}
        )
        
     }
}