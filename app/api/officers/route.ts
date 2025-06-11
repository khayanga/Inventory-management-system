import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unknown } from "zod";
import { error } from "console";

// Get all officers
export async function GET(req: Request) {
    const user = await getCurrentUser(req)
    if(!user || user.role !== "DUTY_OFFICER" ){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }
    try {
        const {searchParams} = new URL(req.url)
        const status = searchParams.get("status")
        const unit = searchParams.get("unit")
        const militaryId = searchParams.get("militaryId")
        const name = searchParams.get("name")
         const officers = await db.officer.findMany({
            where:{
                ...(status && {status}),
                ...(unit && {unit}),
                ...(militaryId && {militaryId}),
                ...(name && {name}),
            },
            orderBy:{
                createdAt:"desc"
            }
         })

            return NextResponse.json(
                {success:true, officers},
                {status:200}
            )
        
    } catch (error) {
        return NextResponse.json(
            {error:"Failed to fetch officers"},
            {status:500}
        )
        
    }

    
}


// Create a new officer
export async function POST(req:Request){
    const user = await getCurrentUser(req)

    if(!user || user.role !== "DUTY_OFFICER" ){
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    }
     try {
        const{militaryId, name,rank,unit} = await req.json()

        if(!militaryId || !name || !rank || !unit){
            return NextResponse.json({error:"Missing fields"}, { status: 400 })
        }

        const existingOfficer = await db.officer.findUnique({
            where:{
                militaryId
            }
        })
         if(existingOfficer){
            return NextResponse.json({error:"Officer already exists"}, { status: 409 })
         }

         const officer= await db.officer.create({
            data:{
                militaryId,
                name,
                rank,
                unit: unit || "UNKNOWN"

            }
         })

         await db.auditLog.create({
            data:{
                action: "OFFICER_CREATED",
                userId: user.id,
                metadata: {
                officerId: officer.id,
                militaryId: officer.militaryId,
                }
            }
         })
         return NextResponse.json(officer , { status: 201 })

     } catch (error) {
      return NextResponse.json(
        { error: "Failed to create officer" },
        { status: 500 }
      )
     }
}