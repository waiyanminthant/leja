"use client";

// Import necessary components and utilities from Mantine and other libraries
import {
  TableTr,
  TableTd,
  NumberFormatter,
  ActionIcon,
  Table,
  TableThead,
  TableTh,
  Text,
  TableTbody,
  Badge,
  Flex,
  Tooltip,
  Button,
  Container,
  LoadingOverlay,
  TableTfoot,
  Grid,
  Paper,
} from "@mantine/core";
import {
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
  IconReload,
  IconTrash,
} from "@tabler/icons-react";
import { StockItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { useEffect, useState } from "react";
import { appURL } from "../config";
import { DatePickerInput } from "@mantine/dates";

const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

// Define the itemTable component as an async function
export function StockTable() {
  // Fetch items data from the API
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("week").subtract(4, "day")
  );
  const [toDate, setToDate] = useState(dayjs().startOf("week").add(2, "day"));
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  useEffect(() => {
    async function getProduceItems() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const stockData: StockItem[] = await getData(
          `${appURL}/api/stocks?from=${fromDate}&to=${toDate}`,
          "stock items"
        );

        const filterDate = stockData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, "day", "[]")
        );

        setStocks(filterDate);
      } catch (error) {
        setError(
          "Error fetching expenses. Please refresh the page to try again."
        ); // Set error message
      }

      setIsLoading(false);
    }

    getProduceItems();
  }, [fromDate, toDate]);

  // Function to handle deletion of an item
  const deletehandler = (id: string, detail: string) => {
    // Confirm deletion with user
    if (
      window.confirm(
        `Are you sure you want to delete this item called ${detail}?`
      )
    ) {
      // If confirmed, call the deleteData function to delete the item
      deleteData(`/api/stocks/${id}/delete`);
    }
  };

  function calculateTotal(amount, price, currency, rate) {
    return (
      <Flex gap={8} align="center">
        <NumberFormatter
          prefix={currency + " "}
          value={amount * price}
          thousandSeparator
        />
        {currency != "MMK" ? (
          <Tooltip label={"Pirce per Stock: MMK " + price * rate}>
            <Badge size="sm" color="blue">
              <NumberFormatter
                prefix="MMK "
                value={amount * price * rate}
                thousandSeparator
              />
            </Badge>
          </Tooltip>
        ) : null}
      </Flex>
    );
  }

  function calcGrandTotal(data: StockItem[]) {
    const totalSGD = stocks.reduce(
      (totalSGD, stock) => totalSGD + stock.amount * stock.price,
      0
    );
    const totalMMK = stocks.reduce(
      (totalMMK, stock) => totalMMK + stock.amount * stock.price * stock.rate,
      0
    );

    return (
      <Text fz="xs" fw="bold">
        {totalSGD.toLocaleString()} SGD (or) <br /> {totalMMK.toLocaleString()}{" "}
        MMK
      </Text>
    );
  }

  function calcTotalStock(data: StockItem[]) {
    var totalStock = 0;
    for (let i = 0; i < data.length; i++) {
      totalStock += data[i].amount;
    }

    return (
      <Text fz="xs" fw="bold">
        {totalStock} Packets
      </Text>
    );
  }

  // Map items data to table rows
  const rows = stocks.map((item) => (
    <TableTr key={item.id}>
      <TableTd>{dayjs(item.date).format("ddd, DD MMM YYYY")}</TableTd>
      <TableTd>{item.name}</TableTd>
      <TableTd>
        <Flex gap={4} align="center">
          {item.amount}
          <Badge size="xs" color="grape">
            {Math.round((item.amount / item.prodAmt) * 100) / 100} /{" "}
            {item.prodUnit}
          </Badge>
        </Flex>
      </TableTd>
      <TableTd>
        <NumberFormatter
          prefix={item.currency + " "}
          value={item.price}
          thousandSeparator
        />
      </TableTd>
      <TableTd>
        {item.sold ? (
          <Badge color="green">Yes</Badge>
        ) : (
          <Badge color="red">No</Badge>
        )}
      </TableTd>
      <TableTd>
        {calculateTotal(item.amount, item.price, item.currency, item.rate)}
      </TableTd>
      <TableTd>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => deletehandler(item.id, item.name)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  const changeWeek = (direction: string) => {
    setFromDate((prevFromDate) =>
      dayjs(prevFromDate).add(direction === "Next" ? 7 : -7, "day")
    );
    setToDate((prevToDate) =>
      dayjs(prevToDate).add(direction === "Next" ? 7 : -7, "day")
    );
  };

  // Return the table component with the rendered rows
  return (
    <Container fluid>
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ color: "gray", type: "bars" }}
      />
      <Paper shadow="lg" p={12} withBorder mb={12}>
        <Grid>
          <Grid.Col span={1}>
            <ActionIcon
              size="lg"
              variant="subtle"
              color="gray"
              onClick={() => changeWeek("Prev")}
            >
              <IconChevronLeft />
            </ActionIcon>
          </Grid.Col>
          <Grid.Col span={10}>
            <Flex gap={12} justify="space-around" align="center">
              <DatePickerInput
                variant="filled"
                readOnly
                leftSection={<IconCalendarCheck stroke={1.5} />}
                value={[fromDate, toDate]}
                type="range"
                w={{ lg: 300 }}
                valueFormat="DD MMM YYYY"
              />
            </Flex>
          </Grid.Col>
          <Grid.Col span={1}>
            <ActionIcon
              size="lg"
              variant="subtle"
              color="gray"
              onClick={() => changeWeek("Next")}
            >
              <IconChevronRight />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      </Paper>
      <Table highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>Created Date</TableTh>
            <TableTh>Item Name</TableTh>
            <TableTh>Stock Count</TableTh>
            <TableTh>Price</TableTh>
            <TableTh>Sold?</TableTh>
            <TableTh>Total</TableTh>
            <TableTh></TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {error ? ( // Display error message if error occurred
            <TableTd colSpan={6}>
              <Text c="red">{error}</Text>
              <Button
                leftSection={<IconReload stroke={1.5} />}
                my={8}
                onClick={() => location.reload()}
              >
                Refresh
              </Button>
            </TableTd>
          ) : (
            rows
          )}
        </TableTbody>
        <TableTfoot>
          <TableTr>
            <TableTh></TableTh>
            <TableTh>Total:</TableTh>
            <TableTh>{calcTotalStock(stocks)}</TableTh>
            <TableTh></TableTh>
            <TableTh>Total:</TableTh>
            <TableTh>{calcGrandTotal(stocks)}</TableTh>
            <TableTh></TableTh>
          </TableTr>
        </TableTfoot>
      </Table>
    </Container>
  );
}
