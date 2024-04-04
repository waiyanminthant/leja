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
import { Suspense, useState } from "react";

export function ExpenseCreateForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formData = useForm({
    initialValues: {
      name: "",
      date: new Date(),
      amount: 0,
      unit: "Viss",
      toStock: false
    },
    validate: {
      name: (value) =>
        value.length < 3 ? "Item name must be longer than 2 letters" : null,
      amount: (value) => (value < 1 ? "Production must be at least 1" : null),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.validate();
    if (formData.isValid()) {
      setIsLoading(true);
      await submitForm(`/api/production/create`, formData, close);
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
      <Button variant="filled" leftSection={<IconPlus />} onClick={open}>
        Add
      </Button>
      <Modal opened={opened} onClose={close} title="Add Production">
        <Container size="sm">
          <form onSubmit={handleSubmit} onReset={formData.reset}>
            <Stack gap="lg">
              <TextInput
                label="Item Name"
                name="name"
                description="Name of the produced item"
                value={formData.values.name}
                {...formData.getInputProps("name")}
                required
              />
              <DatePickerInput
                label="Date"
                name="date"
                description="Date the item is produced"
                value={formData.values.date}
                {...formData.getInputProps("date")}
                required
              />
              <NumberInput
                label="Amount"
                name="amount"
                description="The amount of item produced"
                value={formData.values.amount}
                {...formData.getInputProps("amount")}
                required
              />
              <Select
                label="Unit"
                name="unit"
                description="Please select the amount unit"
                value={formData.values.unit}
                {...formData.getInputProps("unit")}
                data={["Viss", "Kg", "Grams"]}
                required
              />
              <Flex mt={12} justify="space-between">
                <Button type="reset" variant="outline" color="red">
                  Reset
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
