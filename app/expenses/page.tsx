import { Expense } from "@/components/interfaces";
import getData from "@/lib/getData";
import {
  Button,
  Container,
  Divider,
  Flex,
  NumberFormatter,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Title,
} from "@mantine/core";
import { IconCashBanknoteFilled, IconPlus } from "@tabler/icons-react";
import { Suspense } from "react";
import { appURL } from "@/components/config";
import dayjs from "dayjs";

export default async function ExpensesPage() {
  const expenses: Expense[] = await getData(
    `${appURL}/api/expenses`,
    "expenses"
  );

  return (
    <Container fluid>
      <Flex justify="space-between">
        <Flex gap={12}>
          <IconCashBanknoteFilled size={32} />
          <Title order={3}>Expenses List</Title>
        </Flex>
        <Button variant="filled" leftSection={<IconPlus />}>
          Add
        </Button>
      </Flex>
      <Divider size="md" h={12} my={12} />
      <Container fluid>
        <Suspense fallback={<Title order={3}>Loading...</Title>}>
          {renderTable(expenses)}
        </Suspense>
      </Container>
    </Container>
  );
}

async function renderTable(ExpenseData: Expense[]) {
  const rows = ExpenseData.map((expense, index) => {
    return (
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
      </TableTr>
    );
  });

  return (
    <Table withColumnBorders highlightOnHover>
      <TableThead>
        <TableTr>
          <TableTh>No.</TableTh>
          <TableTh>Transaction Date</TableTh>
          <TableTh>Detail</TableTh>
          <TableTh>Type</TableTh>
          <TableTh>Amount</TableTh>
        </TableTr>
      </TableThead>
      <TableTbody>{rows}</TableTbody>
    </Table>
  );
}
