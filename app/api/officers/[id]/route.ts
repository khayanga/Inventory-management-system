import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = params;
    const officer = await db.officer.findUnique({
      where: { id },
      select: {
        id: true,
        militaryId: true,
        name: true,
        rank: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!officer) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }
    return NextResponse.json({ officer }, { status: 200 });
  } catch (error) {
    console.error("Error fetching officer:", error);
    return NextResponse.json(
      { error: "Failed to fetch officer" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  const user = await getCurrentUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await req.json();
    const { militaryId, name, rank, unit, status } = body;
    if (!militaryId || !name || !rank || !unit || !status) {
      return NextResponse.json({ error: "Missing Fields" }, { status: 400 });
    }

    const existingOfficer = await db.officer.update({
      where: { id },
      data: {
        militaryId,
        name,
        rank,
        unit,
        status,
      },
      select: {
        id: true,
        militaryId: true,
        name: true,
        rank: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json({ officer: existingOfficer }, { status: 200 });
  } catch (error) {
    console.error("Error updating officer:", error);
    return NextResponse.json(
      { error: "Failed to update officer" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    const activeCheckouts = await db.checkout.count({
      where: {
        officerId: id,
        status: "ACTIVE",
      },
    });

    if (activeCheckouts > 0) {
      return NextResponse.json(
        { error: "Cannot delete officer with active checkouts" },
        { status: 400 }
      );
    }

    const officer = await db.officer.update({
      where: { id },
      data: {
        status: "INACTIVE",
      },
      select: {
        id: true,
        militaryId: true,
        name: true,
        rank: true,
        unit: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await db.auditLog.create({
      data: {
        action: "OFFICER_DELETED",
        userId: user.id,
        metadata: {
          officerId: id,
          officerName: officer.name,
          militaryId: officer.militaryId,
        },
      },
    });

    return NextResponse.json(
      { message: "Officer deleted successfully", officer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting officer:", error);

    // Handle specific Prisma errors
    if (error instanceof Error && error.message.includes("RecordNotFound")) {
      return NextResponse.json({ error: "Officer not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to delete officer" },
      { status: 500 }
    );
  }
}
