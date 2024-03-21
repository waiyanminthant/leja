import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the expense data
    const { expense } = await req.json();

    // Check if the expense data is missing
    if (!expense) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("Expense data is missing", { status: 400 });
    }

    // Create the expense in the database
    await db.expenses.create({
      data: {
        ...expense, // Spread the expense object for cleaner code
      },
    });

    // Return a 201 Created response with a success message
    return new NextResponse("Expense successfully added", { status: 201 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error creating expense:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
