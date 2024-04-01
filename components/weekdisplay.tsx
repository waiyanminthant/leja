var dayjs = require("dayjs");
var weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

export function formatWeekNumber(weekNumber: number, year: number): string {
  const startOfWeek = dayjs()
    .year(year)
    .week(weekNumber)
    .startOf("week")
    .format("DD");
  const endOfWeek = dayjs()
    .year(year)
    .week(weekNumber)
    .endOf("week")
    .format("DD");
  const monthName = dayjs().year(year).week(weekNumber).format("MMM");

  return `${startOfWeek} - ${endOfWeek} ${monthName}`;
}
