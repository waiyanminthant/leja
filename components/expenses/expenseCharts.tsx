import { Container, Divider, Grid, GridCol, Title } from "@mantine/core";
import { BarChart } from "@mantine/charts";
import getData from "@/lib/getData";
import { appURL } from "../config";
import { Expense } from "../interfaces";
import { formatWeekNumber } from "../weekdisplay";

var dayjs = require("dayjs");
var weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

export async function ExpenseStackedChart() {
  const expenses: Expense[] = await getData(
    `${appURL}/api/expenses?days=7`,
    "expenses"
  );

  function generateData(expense: Expense[]) {
    const currentWeek = dayjs(new Date()).week();
    const currentYear = dayjs(new Date()).format("YYYY");
    const chartData = [
      {
        week: formatWeekNumber(currentWeek, currentYear),
        SUM: 0,
        MUM: 0,
        EQP: 0,
        SUP: 0,
        MSC: 0,
        Total: 0,
      },
      {
        week: formatWeekNumber(currentWeek - 1, currentYear),
        SUM: 0,
        MUM: 0,
        EQP: 0,
        SUP: 0,
        MSC: 0,
        Total: 0,
      },
      {
        week: formatWeekNumber(currentWeek - 2, currentYear),
        SUM: 0,
        MUM: 0,
        EQP: 0,
        SUP: 0,
        MSC: 0,
        Total: 0,
      },
      {
        week: formatWeekNumber(currentWeek - 3, currentYear),
        SUM: 0,
        MUM: 0,
        EQP: 0,
        SUP: 0,
        MSC: 0,
        Total: 0,
      },
    ];

    for (const expenseItem of expense) {
      const weekIndex = currentWeek - dayjs(expenseItem.date).week();
      const expenseAmount = expenseItem.amount * (expenseItem.rate || 1);

      switch (expenseItem.type) {
        case "SUM":
          chartData[weekIndex].SUM += expenseAmount;
          break;

        case "MUM":
          chartData[weekIndex].MUM += expenseAmount;
          break;

        case "EQP":
          chartData[weekIndex].EQP += expenseAmount;
          break;

        case "SUP":
          chartData[weekIndex].SUP += expenseAmount;
          break;

        case "MSC":
          chartData[weekIndex].MSC += expenseAmount;
          break;

        default:
          break;
      }

      chartData[weekIndex].Total += expenseAmount;
    }

    return chartData;
  }

  return (
    <Container>
      <Grid>
        <GridCol span={6}>
          <Title order={5} mb={24}>
            Expense Breakdown (By Category)
          </Title>
          <BarChart
            h={300}
            data={generateData(expenses)}
            dataKey="week"
            unit=" MMK"
            type="default"
            series={[
              { name: "SUM", color: "red.6" },
              { name: "MUM", color: "blue.6" },
              { name: "EQP", color: "green.6" },
              { name: "SUP", color: "yellow.6" },
              { name: "MSC", color: "yellow.6" },
            ]}
            barChartProps={{ syncId: "expense" }}
          />
        </GridCol>
        <GridCol span={6}>
          <Title order={5} mb={24}>
            Total Expense in the last 4 weeks
          </Title>
          <BarChart
            h={300}
            data={generateData(expenses)}
            unit=" MMK"
            dataKey="week"
            series={[{ name: "Total", color: "violet.6" }]}
            barChartProps={{ syncId: "expense" }}
          />
        </GridCol>
      </Grid>
    </Container>
  );
}
