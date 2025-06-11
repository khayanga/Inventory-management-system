import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getCurrentUser(req);

  if (!user || user.role !== "DUTY_OFFICER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { weaponId, militaryId, purpose } = await req.json();

    if (!weaponId || !militaryId || !purpose) {
      return NextResponse.json(
        { error: "Missing required fields: weaponId, militaryId, or purpose" },
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

      // Find officer by militaryId
      const officer = await tx.officer.findUnique({
        where: { militaryId, status: "ACTIVE" }
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
          officerId: officer.id, 
          purpose,
          dutyOfficerId: user.id,
          status: "ACTIVE",
          checkoutTime: new Date(),
          conditionAtCheckout: weapon.condition,
         
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
          userId: user.id,
          metadata: {
            weaponId,
            serialNumber: weapon.serialNumber,
            officerId: officer.id,
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