'use client'

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
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { StockItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { Suspense } from "react";
import { appURL } from "../config";

// Define the itemTable component as an async function
export async function StockTable() {

  // Fetch items data from the API
  const items: StockItem[] = await getData(
    `${appURL}/api/stocks`,
    "Stock Items"
  );

  // Function to handle deletion of an item
  const deletehandler = (id: string, detail: string) => {
    // Confirm deletion with user
    if (window.confirm(`Are you sure you want to delete this item called ${detail}?`)) {
      // If confirmed, call the deleteData function to delete the item
      deleteData(`/api/stocks/${id}/delete`)
    }
  };

  function calculateTotal(amount, price, currency, rate) {
    return (
      <Flex gap={8} align='center'>
        <NumberFormatter prefix={currency + " "} value={amount * price} thousandSeparator />
        {currency != "MMK" ?
          <Badge size="sm" color="blue">
            <NumberFormatter prefix="MMK " value={amount * price * rate} thousandSeparator />
          </Badge>
          : null}
      </Flex>
    )
  }

  // Map items data to table rows
  const rows = items.map((item, index) => (
    <TableTr key={item.id}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>{dayjs(item.date).format("DD-MMM-YY")}</TableTd>
      <TableTd>{item.name}</TableTd>
      <TableTd>{item.amount}</TableTd>
      <TableTd>{item.price}</TableTd>
      <TableTd>{item.sold ? <Badge color="green">Yes</Badge> : <Badge color="red">No</Badge>}</TableTd>
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
          <TableTh>Created Date</TableTh>
          <TableTh>Item Name</TableTh>
          <TableTh>Stock Count</TableTh>
          <TableTh>Price</TableTh>
          <TableTh>Sold?</TableTh>
          <TableTh>Total</TableTh>
          <TableTh></TableTh>
        </TableTr>
      </TableThead>
      {/* Use Suspense to show a loading skeleton while data is being fetched */}
      <Suspense fallback={<Skeleton height={420} radius={12} />}>
        <TableTbody>{rows}</TableTbody>
      </Suspense>
    </Table>
  );
}
