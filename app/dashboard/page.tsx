import { ExpenseStackedChart } from "@/components/expenses/expenseCharts";
import { currentUser } from "@clerk/nextjs";
import { Container, Divider, Flex, Title } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";

export default async function Dashboard() {
  return (
    // Main container for the page
    <Container fluid>
      {/* Header section with title and item form */}
      <Flex justify="space-between">
        <Flex gap={12}>
          <IconHome2 size={32} />
          <Title order={3}>Business Overview</Title>
        </Flex>
      </Flex>
      {/* Divider */}
      <Divider size="md" h={12} my={12} />
      <ExpenseStackedChart />
    </Container>
  );
}
