import { db } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const user = await getCurrentUser(req)

    if(!user){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )
    }
    try {
        const {id} = params
       const user = await db.user.findUnique({
        where:{id},
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
         if(!user){
          return NextResponse.json(
                {error:"User not found"},
                {status:404}
          )
         }
        return NextResponse.json(
            {user},
            {status:200}
        ) 
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json(
            {error:"Failed to fetch user"},
            {status:500}
        )
        
    }
}

// update user
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const user = await getCurrentUser(req)

    if(!user){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )

    }
    try {
        const {id} = params
        const body = await req.json()
        const {username, email, militaryId, rank}= body
        if(!username || !email || !militaryId || !rank){
            return NextResponse.json(
                {error:"Missing required fields"},
                {status:400}
            )
        }
        const user = await db.user.update({
            where:{id},
            data:{
                username,
                email,
                militaryId,
                rank
            },

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
        return NextResponse.json({
            user,
            message:"User updated successfully"
        },{status:200})
        
        
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
            {error:"Failed to update user"},
            {status:500}
        )
        
    }
}

// Delete user
export async function DELETE(req:Request, {params}:{params:{id:string}}){
    const user = await getCurrentUser(req)

    if(!user || user.role !== "admin"){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )

    }

    try {
        const {id} = params
        const user = await db.user.delete({
            where:{id},
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
            {user, message:"User deleted successfully"},
            {status:200}
        )
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json(
            {error:"Failed to delete user"},
            {status:500}
        )
        
    }
    
}
  