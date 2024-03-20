"use client";

import "@mantine/core/styles.css";
import {
  AppShell,
  Burger,
  ColorSchemeScript,
  Flex,
  MantineProvider,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

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
        <MantineProvider defaultColorScheme="dark">
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
              <Flex dir="row" gap={8} mt={12} ml={12}>
                <Burger
                  mt={4}
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="sm"
                />
                <Text size="xl" fw="bolder">
                  LEJA
                </Text>
              </Flex>
            </AppShell.Header>

            <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

            <AppShell.Main>Main</AppShell.Main>
          </AppShell>
        </MantineProvider>
      </body>
    </html>
  );
}
