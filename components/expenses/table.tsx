'use client'

// Import necessary components and utilities from Mantine and other libraries
import {
  TableTr,
  TableTd,
  NumberFormatter,
  ActionIcon,
  Table,
  TableThead,
  TableTh,
  TableTbody,
  Badge,
  Flex,
  Skeleton,
} from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Expense } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { Suspense } from "react";
import { appURL } from "../config";

// Define the ExpenseTable component as an async function
export async function ExpenseTable() {

  // Fetch expenses data from the API
  const expenses: Expense[] = await getData(
    `${appURL}/api/expenses`,
    "expenses"
  );

  // Function to format currency based on the currency type and rate
  function currencyCheck(amount: number, currency: string, rate: number) {
    // Default currency format
    return (
      <Flex gap={12} align="center">
        {/* Display the original amount with the currency prefix */}
        <NumberFormatter
          prefix={currency + " "}
          value={amount}
          thousandSeparator
        />
        {/* Display the MMK equivalent amount with the "MMK" prefix if the currency is not MMK */}
        {currency !== "MMK" ? (
          <Badge size="sm">
            <NumberFormatter
              prefix={"MMK "}
              value={amount * rate}
              thousandSeparator
            />
          </Badge>
        ) : null}
      </Flex>
    );
  }


  // Function to handle deletion of an expense
  const deletehandler = (id: string, detail: string) => {
    // Confirm deletion with user
    if (window.confirm(`Are you sure you want to delete this expense called ${detail}?`)) {
      // If confirmed, call the deleteData function to delete the expense
      deleteData(`/api/expenses/${id}/delete`)
    }
  };

  // Map expenses data to table rows
  const rows = expenses.map((expense, index) => (
    <TableTr key={expense.id}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>{dayjs(expense.date).format("DD-MMM-YY")}</TableTd>
      <TableTd>{expense.detail}</TableTd>
      <TableTd>{expense.type}</TableTd>
      <TableTd>
        {currencyCheck(expense.amount, expense.currency, expense.rate)}
      </TableTd>
      <TableTd>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => deletehandler(expense.id, expense.detail)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  // Return the table component with the rendered rows
  return (
    <Table highlightOnHover>
      <TableThead>
        <TableTr>
          <TableTh>No.</TableTh>
          <TableTh>Transaction Date</TableTh>
          <TableTh>Detail</TableTh>
          <TableTh>Type</TableTh>
          <TableTh>Amount</TableTh>
          <TableTh></TableTh>
        </TableTr>
      </TableThead>
      {/* Use Suspense to show a loading skeleton while data is being fetched */}
      <Suspense fallback={<Skeleton height={420} radius={12} />}>
        <TableTbody>{rows}</TableTbody>
      </Suspense>
    </Table>
  );
}
