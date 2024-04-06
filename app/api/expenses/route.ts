import { db } from "@/lib/db";
import dayjs from "dayjs";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest) {
  const url = new URL(req.url);
  const fromDate = url.searchParams.get("from");
  const toDate = url.searchParams.get("to");

  try {
    if (!toDate || !fromDate) {
      return new NextResponse(
        "One or more of the date qeury strings are missing",
        { status: 500 }
      );
    }
    // Retrieve all expenses from the database
    const expenses = await db.expenses.findMany({
      orderBy: {
        date: "desc",
      },
      where: {
        AND: [
          {
            date: {
              gte: dayjs(fromDate).toISOString(),
            },
          },
          {
            date: {
              lte: dayjs(toDate).toISOString(),
            },
          },
        ],
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
