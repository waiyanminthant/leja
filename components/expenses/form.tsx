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

export function RenderExpenseForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const formData = useForm({
    initialValues: {
      detail: "",
      type: "",
      date: new Date(),
      amount: 0,
      currency: "MMK",
      rate: 1,
    },
    validate: {
      detail: (value) =>
        value.length < 3 ? "Detail must be longer than 2 letters" : null,
      type: (value) => (value ? null : "Please Select one"),
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    formData.validate();
    if (formData.isValid()) {
      setIsLoading(true);
      await submitForm(`/api/expenses/create`, formData, close);
    }

    router.refresh();
    setIsLoading(false);
  };

  return (
    <Suspense fallback={<Skeleton height={24} radius={4} />}>
      <LoadingOverlay
        visible={isLoading}
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{ color: "pink", type: "bars" }}
      />
      <Button variant="filled" leftSection={<IconPlus />} onClick={open}>
        Add
      </Button>
      <Modal opened={opened} onClose={close} title="Add Expense">
        <Container size="sm">
          <form onSubmit={handleSubmit} onReset={formData.reset}>
            <Stack gap="lg">
              <TextInput
                label="Detail"
                name="detail"
                description="Detail of the expense"
                value={formData.values.detail}
                {...formData.getInputProps("detail")}
                required
              />
              <Select
                label="Expense Type"
                name="type"
                description="Please select one"
                value={formData.values.type}
                {...formData.getInputProps("type")}
                data={["SUM", "MUM", "EQP", "SUP", "MSC"]}
                placeholder="Select Expense Type"
                required
              />
              <DatePickerInput
                label="Date"
                name="date"
                description="Date the expense occurs"
                value={formData.values.date}
                {...formData.getInputProps("date")}
                required
              />
              <NumberInput
                label="Amount"
                name="amount"
                description="Expesne amount"
                value={formData.values.amount}
                {...formData.getInputProps("amount")}
                required
              />
              <Select
                label="Currency"
                name="currency"
                description="Currency the expense occurs"
                value={formData.values.type}
                {...formData.getInputProps("currency")}
                data={["MMK", "USD", "SGD"]}
                placeholder="Select Currency"
                required
              />
              <NumberInput
                label="Exchange Rate (Optional)"
                name="rate"
                description="Required if the expense is a foreign currency"
                value={formData.values.amount}
                {...formData.getInputProps("rate")}
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
