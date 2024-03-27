import SaleCards from "@/components/sale/cards";
import { SaleRecordFrom } from "@/components/sale/createForm";
import { SaleTable } from "@/components/sale/table";
import { Container, Divider, Flex, Title } from "@mantine/core";
import { IconCashBanknote } from "@tabler/icons-react";

// Define the itemsPage component as an async function
export default async function StockPage() {
  // Fetch items data asynchronously

  return (
    // Main container for the page
    <Container fluid>
      {/* Header section with title and item form */}
      <Flex justify="space-between">
        <Flex gap={12} mb={20}>
          <IconCashBanknote size={32} />
          <Title order={3}>Sales Records</Title>
        </Flex>
        <SaleRecordFrom />
      </Flex>
      <SaleCards />
      {/* Divider */}
      <Divider size="md" h={12} my={12} />
      {/* Container for the table */}
      <Container fluid>
        <SaleTable />
      </Container>
    </Container>
  );
}
