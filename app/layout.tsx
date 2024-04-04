"use client";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import {
  AppShell,
  Burger,
  ColorSchemeScript,
  Flex,
  MantineProvider,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import NavLinks from "@/components/navlinks";
import {
  IconChartBubbleFilled,
} from "@tabler/icons-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <html lang="en">
      <head>
        <title>Leja</title>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <AppShell
            header={{ height: 60 }}
            navbar={{
              width: 300,
              breakpoint: "sm",
              collapsed: { mobile: !opened },
            }}
            padding="md"
          >
            <AppShell.Header>
              <Flex justify="flex-start" gap={8} mt={12} mx={12}>
                <Burger
                  mt={4}
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Text size="xl" fw="bolder">
                  <IconChartBubbleFilled
                    size={20}
                    style={{ marginRight: 4 }}
                    stroke={1.5}
                  />
                  LEJA
                </Text>
              </Flex>
            </AppShell.Header>
            <NavLinks />
            <AppShell.Main>{children}</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
