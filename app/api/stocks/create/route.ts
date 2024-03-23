import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the stock data
    const { data } = await req.json();

    // Check if the stock data is missing
    if (!data) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("stock data is missing", { status: 400 });
    }
    
    // Create the stock in the database
    await db.$transaction([
      db.stock.create({
        data: {
          name: data.name,
          amount: data.amount,
          date: data.date,
          price: data.price,
          currency: data.currency,
          rate: data.rate
        },
      }),
      db.production.update({
        where: {
          id: data.productionId
        }, 
        data: {
          toStock: true
        }
      })
    ])

    // Return a 201 Created response with a success message
    return new NextResponse("Stock successfully added", { status: 201 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error creating stock:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
