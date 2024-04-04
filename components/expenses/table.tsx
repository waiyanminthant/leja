"use client";

// Import necessary components and utilities from Mantine and other libraries
import React, { useState, useEffect } from "react";
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
  Container,
  Grid,
  Text,
  LoadingOverlay,
  Button,
  TableTfoot,
  MultiSelect,
  Paper,
  Title,
  Checkbox,
} from "@mantine/core";
import {
  IconArrowBigRightFilled,
  IconCactusFilled,
  IconCalendar,
  IconCalendarCheck,
  IconCalendarStats,
  IconChevronLeft,
  IconChevronRight,
  IconFilter,
  IconReload,
  IconTrash,
} from "@tabler/icons-react";
import { Expense } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { appURL } from "../config";
import { DatePickerInput } from "@mantine/dates";

const dayjs = require("dayjs");
var isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

// Define the ExpenseTable component as an async function
export function ExpenseTable() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fromDate, setFromDate] = useState(
    dayjs().startOf("week").subtract(4, "day")
  );
  const [toDate, setToDate] = useState(dayjs().startOf("week").add(2, "day"));
  const [types, setTypes] = useState(["SUM", "MUM", "SUP", "EQP", "MSC"]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors

  const typeOptions = ["SUM", "MUM", "SUP", "EQP", "MSC"];

  useEffect(() => {
    async function getExpenses() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const expenseData: Expense[] = await getData(
          `${appURL}/api/expenses`,
          "expenses"
        );

        const filterDate = expenseData.filter((item) =>
          dayjs(item.date).isBetween(fromDate, toDate, "day", "[]")
        );

        const filterType = filterDate.filter((item) =>
          Object.keys(item).some((type) => types.includes(item.type))
        );

        setExpenses(filterType);
      } catch (error) {
        setError(
          "Error fetching expenses. Please refresh the page to try again."
        ); // Set error message
      }

      setIsLoading(false);
    }

    getExpenses();
  }, [fromDate, toDate, types]);

  // Function to format currency based on the currency type and rate
  function currencyCheck(amount: number, currency: string, rate: number) {
    // Default currency format
    return (
      <Flex gap={12} align="center">
        {/* Display the original amount with the currency prefix */}
        <NumberFormatter
          prefix={currency + " "}
          value={amount}
          thousandSeparator
        />
        {/* Display the MMK equivalent amount with the "MMK" prefix if the currency is not MMK */}
        {currency !== "MMK" ? (
          <Badge size="sm">
            <NumberFormatter
              prefix={"MMK "}
              value={amount * rate}
              thousandSeparator
            />
          </Badge>
        ) : null}
      </Flex>
    );
  }

  // Function to handle deletion of an expense
  const deletehandler = (id: string, detail: string) => {
    // Confirm deletion with user
    if (
      window.confirm(
        `Are you sure you want to delete this expense called ${detail}?`
      )
    ) {
      // If confirmed, call the deleteData function to delete the expense
      deleteData(`/api/expenses/${id}/delete`);
    }
  };

  // Map expenses data to table rows
  const rows = expenses.map((expense, index) => (
    <TableTr key={expense.id}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>{dayjs(expense.date).format('DD MMM YYYY')}</TableTd>
      <TableTd>{expense.detail}</TableTd>
      <TableTd>{expense.type}</TableTd>
      <TableTd>
        {currencyCheck(expense.amount, expense.currency, expense.rate)}
      </TableTd>
      <TableTd>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => deletehandler(expense.id, expense.detail)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  function calcTotal(data: Expense[]) {
    var total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].amount * data[i].rate;
    }
    return total;
  }

  function changeWeek(direction: string) {
    switch (direction) {
      case "Next":
        setFromDate(dayjs(fromDate).add(7, "day"));
        setToDate(dayjs(toDate).add(7, "day"));
        break;

      case "Prev":
        setFromDate(dayjs(fromDate).subtract(7, "day"));
        setToDate(dayjs(toDate).subtract(7, "day"));
        break;
    }
  }

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
              <MultiSelect
                variant="filled"
                leftSection={<IconFilter stroke={1.5} />}
                data={typeOptions}
                value={types}
                onChange={setTypes}
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
      <Table highlightOnHover withTableBorder>
        <TableThead>
          <TableTr>
            <TableTh>No.</TableTh>
            <TableTh>Transaction Date</TableTh>
            <TableTh>Detail</TableTh>
            <TableTh>Type</TableTh>
            <TableTh>Amount</TableTh>
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
            <TableTh></TableTh>
            <TableTh></TableTh>
            <TableTh>Total:</TableTh>
            <TableTh>{calcTotal(expenses).toLocaleString()} MMK</TableTh>
            <TableTh></TableTh>
          </TableTr>
        </TableTfoot>
      </Table>
    </Container>
  );
}
