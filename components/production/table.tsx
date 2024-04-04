"use client";

// Import necessary components and utilities from Mantine and other libraries
import {
  TableTr,
  TableTd,
  ActionIcon,
  Table,
  TableThead,
  TableTh,
  TableTbody,
  Badge,
  Text,
  Skeleton,
  Title,
  Button,
  Container,
  LoadingOverlay,
  Grid,
} from "@mantine/core";
import { IconReload, IconTrash } from "@tabler/icons-react";
import { ProductionItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { Suspense, useEffect, useState } from "react";
import { appURL } from "../config";
import { DatePickerInput } from "@mantine/dates";

const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

// Define the itemTable component as an async function
export function ProductionTable() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState(dayjs().subtract(7, "day"));
  const [toDate, setToDate] = useState(dayjs());
  const [produce, setProduce] = useState<ProductionItem[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  useEffect(() => {
    async function getProduceItems() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const produceData: ProductionItem[] = await getData(
          `${appURL}/api/production`,
          "produced item"
        );

        const filterDate = produceData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, 'day', '[]')
        );

        setProduce(filterDate);
        console.log(filterDate);
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
      deleteData(`/api/production/${id}/delete`);
    }
  };

  // Map items data to table rows
  const rows = produce.map((item, index) => (
    <TableTr key={item.id}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>{dayjs(item.date).format("DD-MMM-YY")}</TableTd>
      <TableTd>{item.name}</TableTd>
      <TableTd>
        {item.amount} {item.unit}
      </TableTd>
      <TableTd>
        {item.toStock ? (
          <Badge size="sm" color="blue">
            Yes
          </Badge>
        ) : (
          <Badge size="sm" color="red">
            No
          </Badge>
        )}
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
            <TableTh>No.</TableTh>
            <TableTh>Produced Date</TableTh>
            <TableTh>Item Name</TableTh>
            <TableTh>Amount</TableTh>
            <TableTh>Converted to Stock?</TableTh>
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
      </Table>
    </Container>
  );
}
