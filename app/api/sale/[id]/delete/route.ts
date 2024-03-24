import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Check if the stock id is missing
    if (!params.id) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("ID is missing", { status: 400 });
    }

    console.log(params.id)

    // Create the stock in the database
    await db.sale.delete({
      where: {
        id: params.id,
      },
    });

    // Return a 200 delete response with a success message
    return new NextResponse("stock deleted successfully", { status: 200 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error deleting stock:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
