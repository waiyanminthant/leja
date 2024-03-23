import { AppShell, NavLink } from "@mantine/core";
import {
  IconCashBanknote,
  IconCoin,
  IconDashboard,
  IconStack2,
  IconTransform,
} from "@tabler/icons-react";

export default function NavLinks() {
  return (
    <AppShell.Navbar>
      <NavLink
        href="/dashboard"
        label="Dashboard"
        leftSection={
          <IconDashboard size={20} style={{ marginTop: 4 }} stroke={1.5} />
        }
      />
      <NavLink
        href="/expenses"
        label="Expenses"
        leftSection={
          <IconCoin size={20} style={{ marginTop: 4 }} stroke={1.5} />
        }
      />
      <NavLink
        href="/production"
        label="Production"
        leftSection={
          <IconTransform size={20} style={{ marginTop: 4 }} stroke={1.5} />
        }
      />
      <NavLink
        href="/stocks"
        label="Stocks"
        leftSection={
          <IconStack2 size={20} style={{ marginTop: 4 }} stroke={1.5} />
        }
      />
      <NavLink
        href="/sale"
        label="Sale"
        leftSection={
          <IconCashBanknote size={20} style={{ marginTop: 4 }} stroke={1.5} />
        }
      />
    </AppShell.Navbar>
  );
}
