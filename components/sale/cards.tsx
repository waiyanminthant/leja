import getData from "@/lib/getData";
import { Container, Grid, GridCol, Group, Paper, Text } from "@mantine/core";
import { IconBox, IconStack2 } from "@tabler/icons-react";
import { appURL } from "../config";
import { SaleItem } from "../interfaces";

export default async function SaleCards() {
  const sale: SaleItem[] = await getData(`${appURL}/api/sale`, "sale items");

  function calculateTotalIncome(sale: SaleItem[]) {
    var total = 0;
    const array = sale;
    for (let i = 0; i < array.length; i++) {
      total += array[i].amount * array[i].rate * array[i].price;
    }
    return total;
  }

  function calculateTotalWaste(sale: SaleItem[]) {
    var total = 0;
    const array = sale;

    for (let i = 0; i < array.length; i++) {
      total += (array[i].stock - array[i].amount) * array[i].rate * array[i].price;
    }
    return total;
  }

  return (
    <Container fluid mb={20}>
      <Grid>
        <GridCol span={6}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Revenue
              </Text>
              <IconStack2 />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text c="blue" fw="bold">
                {calculateTotalIncome(sale).toLocaleString()} MMK
              </Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              in the last 7 days
            </Text>
          </Paper>
        </GridCol>
        <GridCol span={6}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Wastage
              </Text>
              <IconBox />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text c="red" fw="bold">
                {calculateTotalWaste(sale).toLocaleString()} MMK
              </Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              of potential revenue lost
            </Text>
          </Paper>
        </GridCol>
      </Grid>
    </Container>
  );
}
