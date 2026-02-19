import { useState } from 'react';
import { Table, Button, Tabs, Tag, Space } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useLabOrders } from '@/hooks/queries/useLabOrders';
import StatusTag from '@/components/common/StatusTag';
import type { LabOrder } from '@/types/lab';
import dayjs from 'dayjs';

interface Props {
  onAdd: () => void;
}

export default function LabOrderList({ onAdd }: Props) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useLabOrders({ status: statusFilter, page, size: 20 });

  const columns = [
    { title: 'Order #', dataIndex: 'orderNumber', width: 180 },
    { title: 'Patient', dataIndex: 'patientName' },
    { title: 'Doctor', dataIndex: 'doctorName' },
    {
      title: 'Priority',
      dataIndex: 'priority',
      render: (p: string) => <StatusTag status={p} />,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => <StatusTag status={s} />,
    },
    {
      title: 'Tests',
      dataIndex: 'items',
      render: (items: any[]) => <Tag>{items?.length || 0} tests</Tag>,
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      render: (d: string) => dayjs(d).format('MM/DD/YYYY HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: LabOrder) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/lab-orders/${record.id}`)}>
          View
        </Button>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'ORDERED', label: 'Ordered' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'COMPLETED', label: 'Completed' },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Tabs
          activeKey={statusFilter || 'all'}
          items={tabItems}
          onChange={(key) => { setStatusFilter(key === 'all' ? undefined : key); setPage(0); }}
          style={{ marginBottom: 0 }}
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          New Lab Order
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data?.content}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page + 1,
          total: data?.totalElements,
          pageSize: 20,
          onChange: (p) => setPage(p - 1),
        }}
      />
    </>
  );
}
