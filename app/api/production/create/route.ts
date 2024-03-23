import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the item data
    const { item } = await req.json();

    // Check if the item data is missing
    if (!item) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("Item data is missing", { status: 400 });
    }
    
    // Create the item in the database
    await db.production.create({
      data: {
        ...item, // Spread the item object for cleaner code
      },
    });

    // Return a 201 Created response with a success message
    return new NextResponse("Item successfully added", { status: 201 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error creating item:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
