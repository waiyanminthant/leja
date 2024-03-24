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
import { IconPlus } from "@tabler/icons-react";
import submitForm from "@/lib/submitForm";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { StockItem } from "../interfaces";
import dayjs from "dayjs";

export function SaleRecordFrom() {
  const [opened, { open, close }] = useDisclosure(false);
  const [unsoldOptions, setUnsoldOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUnsoldOptions = async () => {
      try {
        const response = await fetch("/api/stocks/unsold");
        if (response.ok) {
          const data: StockItem[] = await response.json();
          const options = Object.keys(data).map((key) => ({
            value: data[key].id,
            label: `${data[key].amount} containers of ${
              data[key].name
            } from ${dayjs(data[key].date).format("DD MMM, YYYY")}`,
            stock: data[key].amount,
          }));
          setUnsoldOptions(options);
        } else {
          console.error("Failed to fetch unsold stock: ", response.statusText);
        }
      } catch (error) {
        console.error("Failed to fetch unconverted production options:", error);
      }
    };

    getUnsoldOptions();
  }, []);

  const formData = useForm({
    initialValues: {
      stockData: {
        id: "",
      },
      saleData: {
        name: "",
        amount: 0,
        date: new Date(),
        price: 0,
        currency: "SGD",
        rate: 1,
        stock: 0,
      },
    },
    validate: {
      saleData: {
        name: (value) =>
          value.length < 3
            ? "Stock item name must be longer than 2 letters"
            : null,
        amount: (value) => (value < 1 ? "Item must be greater than 0" : null),
        stock: (value) => (value < 1 ? "Item must be greater than 0" : null),
      },
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    formData.validate();
    if (formData.isValid()) {
      setIsLoading(true);
      await submitForm(`/api/sale/create`, formData, close);
    }

    router.refresh();
    setIsLoading(false);
  };

  return (
    <Suspense fallback={<Skeleton height={24} radius={4} />}>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "blue", type: "bars" }}
      />
      <Button variant="filled" leftSection={<IconPlus />} onClick={open}>
        Record Sale
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
                value={formData.values.stockData.id}
                {...formData.getInputProps("stockData.id")}
                data={unsoldOptions}
                required
              />
              <TextInput
                label="Stock Item Name"
                name="name"
                description="Name of the converted stock"
                value={formData.values.saleData.name}
                {...formData.getInputProps("saleData.name")}
                required
              />
              <DatePickerInput
                label="Date"
                name="date"
                description="Date the stock is converted"
                value={formData.values.saleData.date}
                {...formData.getInputProps("saleData.date")}
                required
              />
              <NumberInput
                label="Amount"
                name="amount"
                description="The amount of item converted"
                value={formData.values.saleData.amount}
                {...formData.getInputProps("saleData.amount")}
                required
              />
              <NumberInput
                label="Price"
                name="price"
                description="Price of a single stock"
                value={formData.values.saleData.amount}
                {...formData.getInputProps("saleData.price")}
                required
              />
              <Select
                label="Currency"
                name="currency"
                description="Please select correct currency"
                value={formData.values.saleData.currency}
                {...formData.getInputProps("saleData.currency")}
                data={["SGD", "USD", "MMK"]}
                required
              />
              <NumberInput
                label="Exchange Rate"
                name="rate"
                description="Only needed if it is a foreign currency"
                value={formData.values.saleData.rate}
                {...formData.getInputProps("saleData.rate")}
                required
              />
              <NumberInput
                label="Stock Count"
                name="stock"
                description="Click the field to set stock count"
                value={formData.values.saleData.stock}
                readOnly
                onClick={() =>
                  formData.values.stockData.id != ""
                    ? formData.setFieldValue(
                        "saleData.stock",
                        unsoldOptions[
                          unsoldOptions.findIndex(
                            (item) => item.value === formData.values.stockData.id
                          )
                        ].stock
                      )
                    : null
                }
                {...formData.getInputProps("saleData.stock")}
                required
              />
              <Flex mt={12} justify="space-between">
                <Button type="reset" variant="outline" color="red">
                  Reset
                </Button>
                <Button
                  onClick={() =>
                    console.log(formData.values)
                  }
                >
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
