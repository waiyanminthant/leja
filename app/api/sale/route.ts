import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Retrieve all sold items from the database
    const stocks = await db.sale.findMany({
      orderBy: {
        date: "desc",
      },
    });

    // Return a 200 OK response with the sold item data
    return NextResponse.json(stocks, { status: 200 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error retrieving sold items:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
