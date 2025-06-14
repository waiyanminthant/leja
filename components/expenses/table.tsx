"use client";

// Import necessary components and utilities from Mantine and other libraries
import React, { useState, useEffect } from "react";
import {
  NumberFormatter,
  ActionIcon,
  Table,
  Badge,
  Flex,
  Container,
  Grid,
  Text,
  LoadingOverlay,
  Button,
  Paper,
  Checkbox,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendarCheck,
  IconChevronLeft,
  IconChevronRight,
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
  const [salesFrom, setSalesFrom] = useState(
    dayjs().endOf("week").subtract(1, "day")
  );
  const [salesTo, setSalesTo] = useState(dayjs().endOf("week").add(1, "day"));
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState<string | null>(null); // New state for handling errors
  const [types, setTypes] = useState([
    { label: "SUM", show: true },
    { label: "MUM", show: true },
    { label: "SUP", show: true },
    { label: "EQP", show: true },
    { label: "MSC", show: true },
  ]);

  useEffect(() => {
    async function getExpenses() {
      setIsLoading(true);
      setError(null); // Reset error state

      try {
        const expenseData: Expense[] = await getData(
          `${appURL}/api/expenses?from=${fromDate}&to=${toDate}`,
          "expenses"
        );

        setExpenses(expenseData);
      } catch (error) {
        setError(
          "Error fetching expenses. Please refresh the page to try again."
        );
      }

      setIsLoading(false);
    }

    getExpenses();
  }, [fromDate, toDate]);

  function currencyCheck(amount: number, currency: string, rate: number) {
    return (
      <Flex gap={12} align="center">
        <NumberFormatter
          prefix={currency + " "}
          value={amount}
          thousandSeparator
        />
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
    if (
      window.confirm(
        `Are you sure you want to delete this expense called ${detail}?`
      )
    ) {
      deleteData(`/api/expenses/${id}/delete`);
    }
  };

  const filteredExpenses = expenses.filter((expense) =>
    types.every((type) => type.show || expense.type !== type.label)
  );

  const rows = filteredExpenses.map((expense, index) => (
    <Table.Tr key={expense.id}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{dayjs(expense.date).format("ddd, DD MMM YYYY")}</Table.Td>
      <Table.Td>{expense.detail}</Table.Td>
      <Table.Td>{expense.type}</Table.Td>
      <Table.Td>
        {currencyCheck(expense.amount, expense.currency, expense.rate)}
      </Table.Td>
      <Table.Td>
        <ActionIcon
          variant="subtle"
          color="red"
          onClick={() => deletehandler(expense.id, expense.detail)}
        >
          <IconTrash size={16} />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  const calcTotal = (data: Expense[]) =>
    data.reduce((total, expense) => total + expense.amount * expense.rate, 0);

  const changeWeek = (direction: string) => {
    setFromDate((prevFromDate) =>
      dayjs(prevFromDate).add(direction === "Next" ? 7 : -7, "day")
    );
    setToDate((prevToDate) =>
      dayjs(prevToDate).add(direction === "Next" ? 7 : -7, "day")
    );
  };

  const handleCheckboxChange = (index) => {
    setTypes((prevTypes) =>
      prevTypes.map((type, i) =>
        i === index ? { ...type, show: !type.show } : type
      )
    );
  };

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
                  valueFormat="DD MMM YYYY"
                />
              </Tooltip>
              {types.map((type, index) => {
                return (
                  <Checkbox
                    key={index}
                    label={type.label}
                    checked={type.show}
                    onChange={() => handleCheckboxChange(index)}
                  />
                );
              })}
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
        <Table.Thead>
          <Table.Tr>
            <Table.Th>No.</Table.Th>
            <Table.Th>Transaction Date</Table.Th>
            <Table.Th>Detail</Table.Th>
            <Table.Th>Type</Table.Th>
            <Table.Th>Amount</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {error ? (
            <Table.Td colSpan={6}>
              <Text c="red">{error}</Text>
              <Button
                leftSection={<IconReload stroke={1.5} />}
                my={8}
                onClick={() => location.reload()}
              >
                Refresh
              </Button>
            </Table.Td>
          ) : (
            rows
          )}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th></Table.Th>
            <Table.Th>Total:</Table.Th>
            <Table.Th>
              {calcTotal(filteredExpenses).toLocaleString()} MMK
            </Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </Container>
  );
}
