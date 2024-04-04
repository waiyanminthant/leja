import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {

  try {

    // Retrieve all expenses from the database
    const expenses = await db.expenses.findMany({
      orderBy: {
        date: 'desc'
      },
    });

    // Return a 200 OK response with the expenses data
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error retrieving expenses:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
