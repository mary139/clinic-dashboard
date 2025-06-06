import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { Staff } from "@/types/staff";

export const runtime = "nodejs";

const filePath = path.join(process.cwd(), "data/staff.json");

// GET: Fetch a single staff member by ID
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = (await context.params).id;

  const fileData = await fs.readFile(filePath, "utf-8");
  const staffList: Staff[] = JSON.parse(fileData);

  const staff = staffList.find((s) => s.id.toString() === id);

  if (!staff) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(staff);
}

// PUT: Update a staff member by ID
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const id = (await context.params).id;
  const updatedStaff = await req.json();

  const fileData = await fs.readFile(filePath, "utf-8");
  const staffList: Staff[] = JSON.parse(fileData);

  const index = staffList.findIndex((s) => s.id.toString() === id);

  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  staffList[index] = { ...staffList[index], ...updatedStaff };

  await fs.writeFile(filePath, JSON.stringify(staffList, null, 2), "utf-8");

  return NextResponse.json({ success: true, staff: staffList[index] });
}
