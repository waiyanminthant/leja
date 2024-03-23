import { Container, Divider, Flex, Title } from "@mantine/core";
import { IconCashBanknoteFilled } from "@tabler/icons-react";
import { RenderExpenseForm } from "@/components/expenses/form";
import { ExpenseTable } from "@/components/expenses/table";

// Define the ExpensesPage component as an async function
export default async function ExpensesPage() {
  // Fetch expenses data asynchronously

  return (
    // Main container for the page
    <Container fluid>
      {/* Header section with title and expense form */}
      <Flex justify="space-between">
        <Flex gap={12}>
          <IconCashBanknoteFilled size={32} />
          <Title order={3}>Expenses List</Title>
        </Flex>
        <RenderExpenseForm />
      </Flex>
      {/* Divider */}
      <Divider size="md" h={12} my={12} />
      {/* Container for the table */}
      <Container fluid>
        <ExpenseTable />
      </Container>
    </Container>
  );
}
