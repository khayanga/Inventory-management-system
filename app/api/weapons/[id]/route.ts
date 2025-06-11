//Fetch each weapon by their id

import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { error } from "console"
import { NextResponse } from "next/server"

export async function GET(
    req:Request,
    props:{params:Promise<{id:string}>}
){
    const params = await props.params

 const user = await getCurrentUser(req)
    if(!user){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )
    }

    try {
        const {id} = params
        const weapon = await db.weapon.findUnique({
            where:{id},
            include:{
                checkouts:{
                    where:{status:'ACTIVE'},
                    include:{
                        officer:true,
                    }
                }
            }
            

           
        })

        if(!weapon){
            return NextResponse.json(
                {error:"Weapon Not found"},
                {status:404}
            )
        }
        return NextResponse.json(
            {success:true , weapon},
            {status:200}
        )


        
    } catch (error) {
        console.error ("Error fetching weapon" , error)
        return NextResponse.json(
            {error:"Failed to fetch weapon"},
            {status:500}
        )
        
    }
}

export async function PATCH(
    req:Request,
    props:{params:Promise<{id:string}>}
){
    const params = await props.params
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
        const {serialNumber, type, model, condition}= body
        if(!serialNumber || !type || !model || !condition){
            return NextResponse.json(
                {error:"Missing Fields"},
                {status:400}
            )
        } 
        const existingWeapon = await db.weapon.update(
            {
                where:{id},
                data:{
                    serialNumber,
                    type,
                    model,
                    condition
                },
                select:{
                    id:true,
                    serialNumber:true,
                    type:true,
                    model:true,
                    condition:true,
                    createdAt:true,
                    updatedAt:true
                }
            }
        )
        return NextResponse.json(
            {success:true, weapon:existingWeapon},
            {status:200}
        )
        
    } catch (error) {
        console.error("Error updating weapon", error)
        return NextResponse.json(
            {error:"Failed to update weapon"},
            {status:500}
        )
        
    }
}

export async function DELETE(
    req:Request,
    props:{params:Promise<{id:string}>}
){
    const params = await props.params
    const user = await getCurrentUser(req)
    if(!user){
        return NextResponse.json(
            {error:"Unauthorized"},
            {status:401}
        )
    }

    try {
        const {id} = params
        const activeCheckouts = await db.checkout.count(
            {
                where:{
                    weaponId:id,
                    status:'ACTIVE'
                }
            }
        )

         if(activeCheckouts>0){
            return NextResponse.json(
                {error:"Cannot delete weapon with active checkouts"},
                {status:400}
            )
         }

         const weapon = await db .weapon.update(
            {
                where:{id},
                data:{
                    status:'DECOMMISSIONED'
                },
                select:{
                    id:true,
                    serialNumber:true,
                    type:true,
                    model:true,
                    condition:true,
                    status:true,
                    createdAt:true,
                    updatedAt:true
                }
            }
         )
            return NextResponse.json(
                {success:true, weapon},
                {status:200}
            )

       
        
    } catch (error) {
        console.error("Error deleting weapon", error)
        return NextResponse.json(
            {error:"Failed to delete weapon"},
            {status:500}
        )
        
    }
}