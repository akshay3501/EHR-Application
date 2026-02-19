import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  value: number | string;
  icon: ReactNode;
  color: string;
}

export default function StatCard({ title, value, icon, color }: Props) {
  return (
    <Card hoverable>
      <Statistic
        title={title}
        value={value}
        prefix={<span style={{ color }}>{icon}</span>}
        valueStyle={{ color }}
      />
    </Card>
  );
}
