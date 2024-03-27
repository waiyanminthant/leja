import getData from "@/lib/getData";
import { Container, Grid, GridCol, Group, Paper, Text } from "@mantine/core";
import { IconBox, IconStack2 } from "@tabler/icons-react";
import { appURL } from "../config";
import { StockItem } from "../interfaces";

export default async function StockCards() {
  const stocks: StockItem[] = await getData(`${appURL}/api/stocks`, "stock items");

  function calculateUnsoldAmount(stocks: StockItem[]) {
    var total = 0;
    const array = stocks.filter((item) => item.sold === false);
    for (let i = 0; i < array.length; i++) {
      total += array[i].amount * array[i].rate * array[i].price;
    }
    return total;
  }

  function calculateUsoldStocks(stocks: StockItem[]) {
    var total = 0;
    const array = stocks.filter((item) => item.sold === false);
    for (let i = 0; i < array.length; i++) {
      total += array[i].amount;
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
                Total
              </Text>
              <IconStack2 />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text c="blue" fw="bold">
                {calculateUnsoldAmount(stocks).toLocaleString()} MMK
              </Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              of unsold stocks left
            </Text>
          </Paper>
        </GridCol>
        <GridCol span={6}>
          <Paper withBorder p="md" radius="md">
            <Group justify="space-between">
              <Text size="sm" c="dimmed">
                Total
              </Text>
              <IconBox />
            </Group>
            <Group align="flex-end" gap="xs" mt={25}>
              <Text c="blue" fw="bold">
                {calculateUsoldStocks(stocks).toLocaleString()} Packets
              </Text>
            </Group>
            <Text fz="xs" c="dimmed" mt={7}>
              of unsold stocks left
            </Text>
          </Paper>
        </GridCol>
      </Grid>
    </Container>
  );
}
