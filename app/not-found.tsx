import { Title, Text, Space } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

export default function HomePage() {
  return (
    <div>
      <Title order={1} c="red">
        <IconAlertCircle size='1.5rem' color="red" stroke={1.5} /> ERROR 404
      </Title>
      <Space h={20} />
      <Text size="lg" ff="mono">
        Oh no! The page you are trying to read cannot be found...
      </Text>
      <Space h={20} />
      <Text size="xs" ff="mono">
        Only god knows where it went...
      </Text>
    </div>
  );
}
