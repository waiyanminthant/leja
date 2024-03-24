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
  Skeleton,
  Title,
} from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { ProductionItem } from "../interfaces";
import getData from "@/lib/getData";
import deleteData from "@/lib/deleteData";
import { Suspense } from "react";
import { appURL } from "../config";

// Define the itemTable component as an async function
export async function ProductionTable() {
  // Fetch items data from the API
  const items: ProductionItem[] = await getData(
    `${appURL}/api/production`,
    "Produced Item"
  );

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
  const rows = items.map((item, index) => (
    <TableTr key={item.id}>
      <TableTd>{index + 1}</TableTd>
      <TableTd>{dayjs(item.date).format("DD-MMM-YY")}</TableTd>
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

  // Return the table component with the rendered rows
  return (
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
