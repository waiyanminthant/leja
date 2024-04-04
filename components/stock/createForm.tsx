"use client";

import {
  Button,
  Modal,
  TextInput,
  Select,
  Container,
  Flex,
  NumberInput,
  Stack,
  Skeleton,
  LoadingOverlay,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconTransform } from "@tabler/icons-react";
import submitForm from "@/lib/submitForm";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ProductionItem } from "../interfaces";
import dayjs from "dayjs";

export function StockCreateForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const [unconvertedOptions, setUnconvertedOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUnconvertedOptions = async () => {
      try {
        const response = await fetch("/api/production/unconverted");
        if (response.ok) {
          const data: ProductionItem[] = await response.json();
          const options = Object.keys(data).map((key) => ({
            value: data[key].id,
            label: `${data[key].amount} ${data[key].unit} of ${
              data[key].name
            } from ${dayjs(data[key].date).format("DD MMM, YYYY")}`,
          }));
          setUnconvertedOptions(options);
        } else {
          console.error(
            "Failed to fetch unconverted production options:",
            response.statusText
          );
        }
      } catch (error) {
        console.error("Failed to fetch unconverted production options:", error);
      }
    };

    getUnconvertedOptions();
  }, []);

  const formData = useForm({
    initialValues: {
      productionData: {
        id: "",
      },
      stockData: {
        name: "",
        amount: 0,
        date: new Date(),
        price: 0,
        currency: "SGD",
        rate: 1,
        sold: false
      },
    },
    validate: {
      stockData: {
        name: (value) =>
          value.length < 3
            ? "Stock item name must be longer than 2 letters"
            : null,
        amount: (value) => (value < 1 ? "Converted item must at least 1" : null),
        rate: (value) =>
        formData.values.stockData.currency != "MMK" && value === 1
          ? "Please enter the exchange rate"
          : null,
      },
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.validate();
    if (formData.isValid()) {
      setIsLoading(true);
      await submitForm(`/api/stocks/create`, formData, close);
    }

    location.reload();
    setIsLoading(false);
  };

  return (
    <Suspense fallback={<Skeleton height={24} radius={4} />}>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <Button variant="filled" leftSection={<IconTransform />} onClick={open}>
        Convert to Stock
      </Button>
      <Modal
        opened={opened}
        onClose={close}
        title="Convert production to stock"
      >
        <Container size="sm">
          <form onSubmit={handleSubmit} onReset={formData.reset}>
            <Stack gap="lg">
              <Select
                label="Unconverted Production to convert"
                name="unconverted"
                description="Please select the stock you wish to convert"
                value={formData.values.productionData.id}
                {...formData.getInputProps("productionData.id")}
                data={unconvertedOptions}
                required
              />
              <TextInput
                label="Stock Item Name"
                name="name"
                description="Name of the converted stock"
                value={formData.values.stockData.name}
                {...formData.getInputProps("stockData.name")}
                required
              />
              <DatePickerInput
                label="Date"
                name="date"
                description="Date the stock is converted"
                value={formData.values.stockData.date}
                {...formData.getInputProps("stockData.date")}
                required
              />
              <NumberInput
                label="Amount"
                name="amount"
                description="The amount of item converted"
                value={formData.values.stockData.amount}
                {...formData.getInputProps("stockData.amount")}
                required
              />
              <NumberInput
                label="Price"
                name="price"
                description="Price of a single stock"
                value={formData.values.stockData.amount}
                {...formData.getInputProps("stockData.price")}
                required
              />
              <Select
                label="Currency"
                name="currency"
                description="Please select correct currency"
                value={formData.values.stockData.currency}
                {...formData.getInputProps("stockData.currency")}
                data={["SGD", "USD", "MMK"]}
                required
              />
              <NumberInput
                label="Exchange Rate"
                name="rate"
                description="Only needed if it is a foreign currency"
                value={formData.values.stockData.rate}
                {...formData.getInputProps("stockData.rate")}
                required
              />
              <Flex mt={12} justify="space-between">
                <Button type="reset" variant="outline" color="red">
                  Reset
                </Button>
                <Button onClick={() => console.log(formData.values)}>
                  Check
                </Button>
                <Button type="submit" variant="outline" color="blue">
                  Submit
                </Button>
              </Flex>
            </Stack>
          </form>
        </Container>
      </Modal>
    </Suspense>
  );
}
