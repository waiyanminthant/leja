import getData from "@/lib/getData";
import { Container, Grid, GridCol, Group, Paper, Text } from "@mantine/core";
import { IconFileInvoice, IconRepeat, IconRepeatOnce } from "@tabler/icons-react";
import { appURL } from "../config";
import { Expense } from "../interfaces";

export default async function ExpenseCards() {
  const expenses: Expense[] = await getData(
    `${appURL}/api/expenses`,
    "expenses"
  );

  function calculateTotal(expenses: Expense[], filter? :string) {
    var total = 0;
    const array = filter ? expenses.filter((item) => item.type === filter) : expenses
    for (let i = 0; i < array.length; i++) {
      total += array[i].amount * array[i].rate
    }
    return total;
  }

  return (
    <Container fluid mb={20}>
      <Grid>
        <GridCol span={4}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Total Expense
              </Text>
              <IconFileInvoice />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text c='red' fw="bold">{calculateTotal(expenses).toLocaleString()} MMK</Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              In the last 7 days
            </Text>
          </Paper>
        </GridCol>
        <GridCol span={4}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Single Use Expenses
              </Text>
              <IconRepeatOnce />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text c='red' fw="bold">{calculateTotal(expenses, "SUM").toLocaleString()} MMK</Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              In the last 7 days
            </Text>
          </Paper>
        </GridCol>
        <GridCol span={4}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Multi-Use Expenses
              </Text>
              <IconRepeat />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
            <Text c='red' fw="bold">{calculateTotal(expenses, "MUM").toLocaleString()} MMK</Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              In the last 7 days
            </Text>
          </Paper>
        </GridCol>
      </Grid>
    </Container>
  );
}
