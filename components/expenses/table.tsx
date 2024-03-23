"use client";

import deleteData from "@/lib/deleteData";
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
import { Suspense } from "react";

export async function ExpenseTable() {
  const expenses: Expense[] = await getData(
    `http://localhost:3000/api/expenses`,
    "expenses"
  );

  function currencyCheck(amount: number, currency: string, rate: number) {
    var Amount = (
      <NumberFormatter
        prefix={currency + " "}
        value={amount}
        thousandSeparator
      />
    );

    if (currency != "MMK") {
      Amount = (
        <Flex gap={12} align="center">
          <NumberFormatter
            prefix={currency + " "}
            value={amount}
            thousandSeparator
          />
          <Badge size="xs">
            <NumberFormatter
              prefix={"MMK "}
              value={amount * rate}
              thousandSeparator
            />
          </Badge>
        </Flex>
      );
    }

    return Amount;
  }

  const deletehandler = (id: string, detail: string) => {
    deleteData(`/api/expenses/${id}/delete`, detail);
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
        <ActionIcon variant="subtle" color="blue">
          <IconEdit size={16} />
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
      <Suspense fallback={<Skeleton height={420} radius={12} />}>
        <TableTbody>{rows}</TableTbody>
      </Suspense>
    </Table>
  );
}
