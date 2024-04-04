import { Group, Paper, Text } from "@mantine/core";
import {
  IconCashBanknote,
  IconCashBanknoteOff,
  IconCoin,
  IconCoins,
  IconStackBack,
} from "@tabler/icons-react";
import { Expense, SaleItem, StockItem } from "./interfaces";

export function ExpenseTotalCard(expenses: Expense[]) {
  function calculateTotal() {
    var total = 0;
    for (let i = 0; i < expenses.length; i++) {
      total += expenses[i].amount * expenses[i].rate;
    }
    return total;
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total Expense
        </Text>
        <IconCashBanknoteOff />
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text c="red" fw="bold">
          {calculateTotal().toLocaleString()} MMK
        </Text>
      </Group>
      <Text fz="xs" c="dimmed" mt={7}>
        used for production of stocks
      </Text>
    </Paper>
  );
}

export function TotalStockCard(stocks: StockItem[]) {
  function calculateTotal() {
    var total = 0;
    for (let i = 0; i < stocks.length; i++) {
      total += stocks[i].amount;
    }
    return total;
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Total Stocks
        </Text>
        <IconStackBack />
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text c="blue" fw="bold">
          {calculateTotal().toLocaleString()} Packets
        </Text>
      </Group>
      <Text fz="xs" c="dimmed" mt={7}>
        Needs to be sold
      </Text>
    </Paper>
  );
}

export function PotentialRevenueCard(stocks: StockItem[]) {
  function calculateTotal() {
    var totalMMK = 0;
    var totalSGD = 0;
    for (let i = 0; i < stocks.length; i++) {
      totalSGD += stocks[i].amount * stocks[i].price;
      totalMMK += stocks[i].amount * stocks[i].price * stocks[i].rate;
    }
    return { totalMMK, totalSGD };
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Estimated Revenue
        </Text>
        <IconCoin />
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text c="blue" fw="bold">
          {calculateTotal().totalSGD.toLocaleString()} SGD
        </Text>
      </Group>
      <Text fz="xs" c="dimmed" mt={7}>
        {calculateTotal().totalMMK.toLocaleString()} MMK
      </Text>
    </Paper>
  );
}

export function TotalRevenueCard(sales: SaleItem[]) {
  function calculateTotal() {
    var totalMMK = 0;
    var totalSGD = 0;
    for (let i = 0; i < sales.length; i++) {
      totalSGD += sales[i].amount * sales[i].price;
      totalMMK += totalSGD * sales[i].rate;
    }
    return { totalMMK, totalSGD };
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Actual Revenue
        </Text>
        <IconCashBanknote />
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text c="green" fw="bold">
          {calculateTotal().totalSGD.toLocaleString()} SGD
        </Text>
      </Group>
      <Text fz="xs" c="dimmed" mt={7}>
        {calculateTotal().totalMMK.toLocaleString()} MMK
      </Text>
    </Paper>
  );
}

export function PotentialProfit(stocks: StockItem[], expenses: Expense[]) {
  function calculateTotalProfit() {
    var potentialRevenue = 0;
    var totalExpense = 0;

    for (let i = 0; i < stocks.length; i++) {
      potentialRevenue += stocks[i].amount * stocks[i].price * stocks[i].rate;
    }

    for (let i = 0; i < expenses.length; i++) {
      totalExpense += expenses[i].amount * expenses[i].rate;
    }

    var totalProfit = potentialRevenue - totalExpense;

    return totalProfit;
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Potential Revenue
        </Text>
        <IconCoins />
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text c="green" fw="bold">
          {calculateTotalProfit().toLocaleString()} MMK
        </Text>
      </Group>
      <Text fz="xs" c="dimmed" mt={7}>
        of profit if all items sold
      </Text>
    </Paper>
  );
}

export function ActualProfit(sales: SaleItem[], expenses: Expense[]) {
  function calculateTotalProfit() {
    var totalRevenue = 0;
    var totalExpense = 0;

    for (let i = 0; i < sales.length; i++) {
      totalRevenue += sales[i].amount * sales[i].price * sales[i].rate;
    }

    for (let i = 0; i < expenses.length; i++) {
      totalExpense += expenses[i].amount * expenses[i].rate;
    }

    var totalProfit = totalRevenue - totalExpense;

    return (
      <Text c={totalProfit > 0 ? "green" : "red"} fw="bold">
        {totalProfit.toLocaleString()} MMK
      </Text>
    );
  }

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between">
        <Text size="sm" c="dimmed">
          Actual Profit
        </Text>
        <IconCoins />
      </Group>
      <Group align="flex-end" gap="xs" mt={25}>
        {calculateTotalProfit()}
      </Group>
      <Text fz="xs" c="dimmed" mt={7}>
        of profit received
      </Text>
    </Paper>
  );
}
