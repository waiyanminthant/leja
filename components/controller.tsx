import { Paper, Grid, ActionIcon, Flex, Title, Badge } from "@mantine/core";
import { IconChevronLeft, IconCalendarStats, IconArrowBigRightFilled, IconChevronRight } from "@tabler/icons-react";
import dayjs from "dayjs";

export function renderDashboardController(changeWeek: (direction: string) => void, fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs, salesFrom?: dayjs.Dayjs, salesTo?: dayjs.Dayjs) {
    return (
        <Paper withBorder p={20} mb={12}>
            <Grid>
                <Grid.Col span={1}>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => changeWeek("Prev")}
                    >
                        <IconChevronLeft />
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={5}>
                    <Flex gap={12} justify="center" align="center">
                        <Title order={6}>Expense Date:</Title>
                        <Badge
                            leftSection={<IconCalendarStats size={16} />}
                            color="violet"
                        >
                            {dayjs(fromDate).format("DD-MMM-YYYY")}{" "}
                            <IconArrowBigRightFilled size={8} />{" "}
                            {dayjs(toDate).format("DD-MMM-YYYY")}
                        </Badge>
                    </Flex>
                </Grid.Col>
                <Grid.Col span={5}>
                    <Flex gap={12} justify="center" align="center">
                        <Title order={6}>Selling Date:</Title>
                        <Badge
                            leftSection={<IconCalendarStats size={16} />}
                            color="indigo"
                        >
                            {dayjs(salesFrom).format("DD-MMM-YYYY")}{" "}
                            <IconArrowBigRightFilled size={8} />{" "}
                            {dayjs(salesTo).format("DD-MMM-YYYY")}
                        </Badge>
                    </Flex>
                </Grid.Col>
                <Grid.Col span={1}>
                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={() => changeWeek("Next")}
                    >
                        <IconChevronRight />
                    </ActionIcon>
                </Grid.Col>
            </Grid>
        </Paper>
    )
}