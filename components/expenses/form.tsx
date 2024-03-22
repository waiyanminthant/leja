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
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { IconPlus } from "@tabler/icons-react";
import submitForm from "@/lib/submitForm";

export function RenderExpenseForm() {
  const [opened, { open, close }] = useDisclosure(false);
  const formData = useForm({
    initialValues: {
      detail: "",
      type: "",
      date: new Date(),
      amount: 0,
      currency: "MMK",
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
      await submitForm(`/api/expenses/create`, formData, close);
    }
  };

  return (
    <>
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
                value={formData.values.detail}
                {...formData.getInputProps("detail")}
                required
              />
              <Select
                label="Expense Type"
                name="type"
                value={formData.values.type}
                {...formData.getInputProps("type")}
                data={["SUM", "MUM", "EQP", "SUP", "MSC"]}
                placeholder="Select Expense Type"
                required
              />
              <DatePickerInput
                label="Date"
                name="date"
                value={formData.values.date}
                {...formData.getInputProps("date")}
                required
              />
              <NumberInput
                label="Amount"
                name="amount"
                value={formData.values.amount}
                {...formData.getInputProps("amount")}
                required
              />
              <Select
                label="Currency"
                name="currency"
                value={formData.values.type}
                {...formData.getInputProps("currency")}
                data={["MMK", "USD", "SGD"]}
                placeholder="Select Currency"
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
    </>
  );
}
