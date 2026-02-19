import { Tag } from 'antd';
import { STATUS_COLORS } from '@/config/constants';

interface Props {
  status: string;
}

export default function StatusTag({ status }: Props) {
  const color = STATUS_COLORS[status] || 'default';
  return <Tag color={color}>{status.replace(/_/g, ' ')}</Tag>;
}
