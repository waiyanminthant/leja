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
  Skeleton,
  Flex,
  Tooltip,
  Title,
  Button,
  Container,
  LoadingOverlay,
  TableTfoot,
  Grid,
} from "@mantine/core";
import { IconReload, IconTrash } from "@tabler/icons-react";
import { ProductionItem, StockItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { Suspense, useEffect, useState } from "react";
import { appURL } from "../config";
import { DatePickerInput } from "@mantine/dates";

const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

// Define the itemTable component as an async function
export function StockTable() {
  // Fetch items data from the API
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState(dayjs().subtract(7, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  useEffect(() => {
    async function getProduceItems() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const stockData: StockItem[] = await getData(
          `${appURL}/api/stocks`,
          "stock items"
        );

        const filterDate = stockData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, 'day', '[]')
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
    var totalSGD = 0;
    var totalMMK = 0;
    for (let i = 0; i < data.length; i++) {
      totalSGD += data[i].amount * data[i].price;
      totalMMK += data[i].amount * data[i].price * data[i].rate;
    }

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
      <TableTd>{dayjs(item.date).format("DD-MMM-YY")}</TableTd>
      <TableTd>{item.name}</TableTd>
      <TableTd>{item.amount}</TableTd>
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

  // Return the table component with the rendered rows
  return (
    <Container fluid>
      <LoadingOverlay
        visible={isLoading}
        loaderProps={{ color: "gray", type: "bars" }}
      />
      <Grid mb={20}>
        <Grid.Col span={3}>
          <DatePickerInput
            label="Start From: "
            value={fromDate}
            onChange={(value) => setFromDate(value)}
          />
        </Grid.Col>
        <Grid.Col span={3}>
          <DatePickerInput
            label="Up Until: "
            value={toDate}
            onChange={(value) => setToDate(value)}
          />
        </Grid.Col>
      </Grid>
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
