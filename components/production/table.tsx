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
  Button,
  Container,
  LoadingOverlay,
  Grid,
  Flex,
  Paper,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
  IconReload,
  IconTrash,
} from "@tabler/icons-react";
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
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("week").subtract(4, "day")
  );
  const [toDate, setToDate] = useState(dayjs().startOf("week").add(2, "day"));
  const [salesFrom, setSalesFrom] = useState(
    dayjs().endOf("week").subtract(1, "day")
  );
  const [salesTo, setSalesTo] = useState(dayjs().endOf("week").add(1, "day"));
  const [produce, setProduce] = useState<ProductionItem[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  useEffect(() => {
    async function getProduceItems() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const produceData: ProductionItem[] = await getData(
          `${appURL}/api/production?from=${fromDate}&to=${toDate}`,
          "produced item"
        );

        setProduce(produceData);
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
      <TableTd>{dayjs(item.date).format("ddd, DD MMM YYYY")}</TableTd>
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
              <Tooltip label={`For the sale of ${dayjs(salesFrom).format('DD MMM')} to ${dayjs(salesTo).format('DD MMM')}`}>
              <DatePickerInput
                variant="filled"
                readOnly
                leftSection={<IconCalendarCheck stroke={1.5} />}
                value={[fromDate, toDate]}
                type="range"
                w={{ lg: 300 }}
                valueFormat="DD MMM YYYY"
              />
              </Tooltip>
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
