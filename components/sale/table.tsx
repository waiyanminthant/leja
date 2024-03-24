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
  Skeleton,
  Flex,
  RingProgress,
  Text,
  Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { SaleItem, StockItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { Suspense } from "react";
import { appURL } from "../config";

// Define the itemTable component as an async function
export async function SaleTable() {
  // Fetch items data from the API
  const items: SaleItem[] = await getData(`${appURL}/api/sale`, "Sales Record");

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
  const rows = items.map((item, index) => (
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
      {items.length > 0 ? (
        <Suspense fallback={<Skeleton height={420} radius={12} />}>
          <TableTbody>{rows}</TableTbody>
        </Suspense>
      ) : (
        <TableTbody>
          <TableTr>
            <TableTd colSpan={7}>
              <Title order={3}>No data found...</Title>
              <Text>Impossible! Perhaps the archives are imcomplete...</Text>
            </TableTd>
          </TableTr>
        </TableTbody>
      )}
    </Table>
  );
}
