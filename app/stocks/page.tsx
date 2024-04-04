import StockCards from "@/components/stock/cards";
import { StockCreateForm } from "@/components/stock/createForm";
import { StockTable } from "@/components/stock/table";
import { Container, Divider, Flex, Title } from "@mantine/core";
import { IconStack2 } from "@tabler/icons-react";

// Define the itemsPage component as an async function
export default async function StockPage() {
    // Fetch items data asynchronously

    return (
        // Main container for the page
        <Container fluid>
            {/* Header section with title and item form */}
            <Flex justify="space-between">
                <Flex gap={12} mb={20}>
                    <IconStack2 size={32} />
                    <Title order={3}>Stock List</Title>
                </Flex>
                <StockCreateForm />
            </Flex>
            {/* Divider */}
            <Divider size="md" h={12} my={12} />
            {/* Container for the table */}
            <Container fluid> 
                <StockTable />
            </Container>
        </Container>
    );
}
