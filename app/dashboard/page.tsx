"use client";

import { appURL } from "@/components/config";
import { ActualProfit, ExpenseTotalCard, PotentialProfit, PotentialRevenueCard, TotalRevenueCard, TotalStockCard, } from "@/components/cards";
import { Expense, ProductionItem, SaleItem, StockItem, } from "@/components/interfaces";
import { Container, Divider, Flex, Grid, LoadingOverlay, Title, } from "@mantine/core";
import { IconHome2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { renderDashboardController } from "@/components/controller";
import getData from "@/lib/getData";

const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState(dayjs().startOf("week").subtract(4, "day"));
  const [toDate, setToDate] = useState(dayjs().startOf("week").add(2, "day"));
  const [salesFrom, setSalesFrom] = useState(dayjs().endOf("week").subtract(1, "day"));
  const [salesTo, setSalesTo] = useState(dayjs().endOf("week").add(1, "day"));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [production, setProduction] = useState<ProductionItem[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  useEffect(() => {
    async function getExpenses() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const expenseData: Expense[] = await getData(
          `${appURL}/api/expenses?from=${fromDate}&to=${toDate}`,
          "expenses"
        );

        const stockData: StockItem[] = await getData(
          `${appURL}/api/stocks?from=${fromDate}&to=${toDate}`,
          "stocks"
        );

        const salesData: SaleItem[] = await getData(
          `${appURL}/api/sale?from=${salesFrom}&to=${salesTo}`,
          "sales"
        );

        const productionData: ProductionItem[] = await getData(
          `${appURL}/api/production?from=${fromDate}&to=${toDate}`,
          "productions"
        );

        const filteredExpense = expenseData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, "day", "[]")
        );

        const filteredStocks = stockData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, "day", "[]")
        );

        const filteredSales = salesData.filter((item) =>
          dayjs(item.date).isBetween(salesFrom, salesTo, "day", "[]")
        );
        const filteredProduction = productionData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, "day", "[]")
        );

        setExpenses(filteredExpense);
        setStocks(filteredStocks);
        setSales(filteredSales);
        setProduction(filteredProduction);
      } catch (error) {
        setError(
          "Error fetching expenses. Please refresh the page to try again."
        ); // Set error message
      }

      setIsLoading(false);
    }

    getExpenses();
  }, [fromDate, toDate, salesFrom, salesTo]);

  function changeWeek(direction: string) {
    switch (direction) {
      case "Next":
        setFromDate(dayjs(fromDate).add(7, "day"));
        setToDate(dayjs(toDate).add(7, "day"));
        setSalesFrom(dayjs(salesFrom).add(7, "day"));
        setSalesTo(dayjs(salesTo).add(7, "day"));
        break;

      case "Prev":
        setFromDate(dayjs(fromDate).subtract(7, "day"));
        setToDate(dayjs(toDate).subtract(7, "day"));
        setSalesFrom(dayjs(salesFrom).subtract(7, "day"));
        setSalesTo(dayjs(salesTo).subtract(7, "day"));
        break;
    }
  }

  return (
    <Container fluid>
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ color: "gray", type: "bars" }}
      />
      <Flex gap={12}>
        <IconHome2 size={32} />
        <Title order={3}>Business Overview</Title>
      </Flex>
      <Divider size="md" h={12} mt={12} />
      {renderDashboardController(changeWeek, fromDate, toDate, salesFrom, salesTo)}
      {/* cards section */}
      <Grid>
        <Grid.Col span={4}>{ExpenseTotalCard(expenses)}</Grid.Col>
        <Grid.Col span={4}>{PotentialRevenueCard(stocks)}</Grid.Col>
        <Grid.Col span={4}>{TotalRevenueCard(sales)}</Grid.Col>
        <Grid.Col span={4}>{TotalStockCard(stocks)}</Grid.Col>
        <Grid.Col span={4}>{PotentialProfit(stocks, expenses)}</Grid.Col>
        <Grid.Col span={4}>{ActualProfit(sales, expenses)}</Grid.Col>
      </Grid>
    </Container>
  );
}
