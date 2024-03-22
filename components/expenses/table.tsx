'use client'

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
} from "@mantine/core";
import { IconTrash, IconEdit } from "@tabler/icons-react";
import dayjs from "dayjs";
import { Expense } from "../interfaces";
import getData from "@/lib/getData";

export async function ExpenseTable() {
  const expenses: Expense[] = await getData(
    `http://localhost:3000/api/expenses`,
    "expenses"
  );

  const deletehandler = (id: string, detail: string) => {
    try {
      deleteData(`/api/expenses/${id}/delete`, detail);
    } catch (error) {
      console.error();
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
        <NumberFormatter
          prefix={expense.currency + " "}
          value={expense.amount}
          thousandSeparator
        />
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
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
