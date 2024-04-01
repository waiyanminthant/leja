import { db } from "@/lib/db";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {

  try {
    const query = req.nextUrl.searchParams.get("days") || 30;
    const lastdays = dayjs(new Date())
      .subtract(query as number, "days")
      .format();

    // Retrieve all expenses from the database
    const expenses = await db.expenses.findMany({
      where: {
        date: {
          gte: lastdays,
        },
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
