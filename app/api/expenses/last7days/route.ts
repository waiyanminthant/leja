import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function GET() {

  const lastdays = dayjs(new Date()).subtract(7, 'days').format()

  try {
    // Retrieve all expenses from the database
    const expenses = await db.expenses.findMany({
      where: {
        AND: {
          date: {
            gte: lastdays
          }
        }
      }
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
