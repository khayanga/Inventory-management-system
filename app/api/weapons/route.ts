import { db } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const weapons = await db.weapon.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                checkouts:{
                    where:{status:'ACTIVE'},
                    include:{officer:true},
                }
            }
        });
        return NextResponse.json(
            { success: true, weapons },
            { status: 200 }
        );
        
    } catch (error) {
        return NextResponse.json(
            {error:"Failed to fetch weapons"},
            { status: 500 }
        );
        
    }
}

export async function POST(req: Request) {
    const user = await getCurrentUser(req);
    if(!user || user.role !=='DUTY_OFFICER' ){
        return NextResponse.json(
            {error:"Unauthorized"},
            { status: 401 }
        )
    }
    try {
        const data = await req.json();
        const weapon = await db.weapon.create({
            data:{
                serialNumber:data.serialNumber,
                type:data.type,
                model:data.model,
                condition:data.condition ||'EXCELLENT',
                dateAcquired:data.dateAcquired ? new Date(data.dateAcquired) : new Date(),
                
            },
            
        })
        return NextResponse.json(
            { success: true, weapon },
            { status: 201 }
        );
        
    } catch (error) {
        return NextResponse.json(
            {error:"Failed to create weapon"},
            { status: 500 }
        );
        
    }
}