import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the stock data
    const { data } = await req.json();

    const stockData = data.stockData;
    const productionData = data.productionData;

    // Log the request body to inspect it
    console.log(stockData);

    // Check if the stock data is missing
    if (!productionData) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("Production Id is missing", { status: 400 });
    }

    if (!stockData) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("Stock data is missing", { status: 400 });
    }

    // Create the stock in the database
    await db.$transaction([
      db.stock.create({
        data: {
          ...stockData,
        },
      }),
      db.production.update({
        where: {
          id: productionData.id,
        },
        data: {
          toStock: true,
        },
      }),
    ]);

    // Return a 201 Created response with a success message
    return new NextResponse("Stock successfully added", { status: 201 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error creating stock:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
