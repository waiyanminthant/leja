import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Parse the request body to extract the stock data
    const { data } = await req.json();

    const saleData = data.saleData;
    const stockData = data.stockData;

    // Check if the stock data is missing
    if (!saleData) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("Stock Id is missing", { status: 400 });
    }

    if (!stockData) {
      // Return a 400 Bad Request response with an error message
      return new NextResponse("Sale data is missing", { status: 400 });
    }

    // Create the stock in the database
    await db.$transaction([
      db.sale.create({
        data: {
          ...saleData,
        },
      }),
      db.stock.update({
        where: {
          id: stockData.id,
        },
        data: {
          sold: true,
        },
      }),
    ]);

    // Return a 201 Created response with a success message
    return new NextResponse("Sale record successfully added", { status: 201 });
  } catch (error) {
    // Log any errors that occur during the process
    console.error("Error creating sale record:", error);

    // Return a 500 Internal Server Error response with a generic error message
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
