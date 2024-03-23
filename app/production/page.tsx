import { ExpenseCreateForm } from "@/components/production/createForm";
import { ProductionTable } from "@/components/production/table";
import { Container, Divider, Flex, Title } from "@mantine/core";
import { IconTransform } from "@tabler/icons-react";

// Define the itemsPage component as an async function
export default async function ProductionPage() {
    // Fetch items data asynchronously

    return (
        // Main container for the page
        <Container fluid>
            {/* Header section with title and item form */}
            <Flex justify="space-between">
                <Flex gap={12}>
                    <IconTransform size={32} />
                    <Title order={3}>Production List</Title>
                </Flex>
                <ExpenseCreateForm />
            </Flex>
            {/* Divider */}
            <Divider size="md" h={12} my={12} />
            {/* Container for the table */}
            <Container fluid>
                <ProductionTable />
            </Container>
        </Container>
    );
}
