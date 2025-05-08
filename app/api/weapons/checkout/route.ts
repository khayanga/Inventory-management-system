import { db } from "@/app/lib/db";
import { getCurrentUser } from "@/app/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const dutyOfficer = await getCurrentUser(req);
  
    if (!dutyOfficer || dutyOfficer.role !== "DUTY_OFFICER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
  
    try {
      const { weaponId, officerId, purpose, expectedReturnDate } = await req.json();
  
      if (!weaponId || !officerId || !purpose) {
        return NextResponse.json(
          { error: "Missing required fields: weaponId, officerId, or purpose" },
          { status: 400 }
        );
      }
  
      return await db.$transaction(async (tx) => {
        // Validate weapon
        const weapon = await tx.weapon.findUnique({
          where: { id: weaponId },
          select: { status: true, condition: true, serialNumber: true }
        });
  
        if (!weapon) {
          return NextResponse.json({ error: "Weapon not found" }, { status: 404 });
        }
  
        if (weapon.status !== "AVAILABLE") {
          return NextResponse.json(
            { error: `Weapon is currently ${weapon.status}` },
            { status: 400 }
          );
        }
  
        // Validate officer
        const officer = await tx.officer.findUnique({
          where: { id: officerId, status: "ACTIVE" }
        });
  
        if (!officer) {
          return NextResponse.json(
            { error: "Officer not found or inactive" },
            { status: 400 }
          );
        }
  
        // Create checkout
        const checkout = await tx.checkout.create({
          data: {
            weaponId,
            officerId,
            purpose,
            dutyOfficerId: dutyOfficer.id,
            status: "ACTIVE",
            checkoutTime: new Date(),
            conditionAtCheckout: weapon.condition,
            expectedReturnTime: expectedReturnDate ? new Date(expectedReturnDate) : null,
          },
          include: {
            weapon: { select: { serialNumber: true, model: true } },
            officer: { select: { militaryId: true, name: true, rank: true } }
          }
        });
  
        // Update weapon status
        await tx.weapon.update({
          where: { id: weaponId },
          data: { status: "CHECKED_OUT" }
        });
  
        // Add audit log
        await tx.auditLog.create({
          data: {
            action: "WEAPON_CHECKOUT",
            userId: dutyOfficer.id,
            metadata: {
              weaponId,
              serialNumber: weapon.serialNumber,
              officerId,
              officerMilitaryId: officer.militaryId
            }
          }
        });
  
        return NextResponse.json({ message: "Checkout created", checkout }, { status: 201 });
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create checkout" },
        { status: 500 }
      );
    }
  }