import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Retrieve all unsold stock from the database
    const production = await db.stock.findMany({
      where: {
        sold: false
      }
    });

    // Return a 200 OK response with the unsold stock item data
    return NextResponse.json(production, { status: 200 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error retrieving unsold stock items:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
