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
  TableTbody,
  Badge,
  Flex,
  RingProgress,
  Text,
  Button,
  Container,
  LoadingOverlay,
} from "@mantine/core";
import { IconReload, IconTrash } from "@tabler/icons-react";
import { SaleItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { useEffect, useState } from "react";
import { appURL } from "../config";

const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

// Define the itemTable component as an async function
export function SaleTable() {
  // Fetch items data from the API
  // Fetch items data from the API
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState(dayjs().subtract(7, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  useEffect(() => {
    async function getProduceItems() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const salesData: SaleItem[] = await getData(
          `${appURL}/api/sale`,
          "sales items"
        );

        const filterDate = salesData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, "day", "[]")
        );

        setSales(filterDate);
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
      deleteData(`/api/sale/${id}/delete`);
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
          <Badge size="sm" color="blue">
            <NumberFormatter
              prefix="MMK "
              value={amount * price * rate}
              thousandSeparator
            />
          </Badge>
        ) : null}
      </Flex>
    );
  }

  // Map items data to table rows
  const rows = sales.map((item, index) => (
    <TableTr key={item.id}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>{dayjs(item.date).format("DD-MMM-YY")}</TableTd>
      <TableTd>{item.name}</TableTd>
      <TableTd>
        <Flex align="center" gap={8}>
          {item.amount} / {item.stock}
          <RingProgress
            size={40}
            thickness={8}
            sections={[
              { value: (item.amount / item.stock) * 100, color: "blue" },
            ]}
          />
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
      <Table highlightOnHover>
        <TableThead>
          <TableTr>
            <TableTh>No.</TableTh>
            <TableTh>Sale Date</TableTh>
            <TableTh>Item Name</TableTh>
            <TableTh>Sale Amount</TableTh>
            <TableTh>Price</TableTh>
            <TableTh>Total</TableTh>
            <TableTh></TableTh>
          </TableTr>
        </TableThead>
        {/* Use Suspense to show a loading skeleton while data is being fetched */}
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
      </Table>
    </Container>
  );
}
