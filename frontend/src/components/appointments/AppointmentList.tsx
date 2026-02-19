import { useState } from 'react';
import { Table, Button, Tabs, Space, Popconfirm, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useAppointments, useCancelAppointment, useUpdateAppointmentStatus } from '@/hooks/queries/useAppointments';
import StatusTag from '@/components/common/StatusTag';
import type { Appointment } from '@/types/appointment';
import dayjs from 'dayjs';

interface Props {
  onAdd: () => void;
}

export default function AppointmentList({ onAdd }: Props) {
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [page, setPage] = useState(0);
  const { data, isLoading } = useAppointments({ status: statusFilter, page, size: 20 });
  const cancelMutation = useCancelAppointment();
  const statusMutation = useUpdateAppointmentStatus();

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync(id);
      message.success('Appointment cancelled');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await statusMutation.mutateAsync({ id, status });
      message.success('Status updated');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'appointmentDate',
      render: (d: string) => dayjs(d).format('MM/DD/YYYY'),
    },
    {
      title: 'Time',
      key: 'time',
      render: (_: unknown, r: Appointment) => `${r.startTime} - ${r.endTime}`,
    },
    { title: 'Patient', dataIndex: 'patientName' },
    { title: 'Doctor', dataIndex: 'doctorName' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => <StatusTag status={s} />,
    },
    { title: 'Reason', dataIndex: 'reason', ellipsis: true },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Appointment) => (
        <Space size="small">
          {record.status === 'SCHEDULED' && (
            <>
              <Button size="small" onClick={() => handleStatusUpdate(record.id, 'CHECKED_IN')}>
                Check In
              </Button>
              <Popconfirm title="Cancel this appointment?" onConfirm={() => handleCancel(record.id)}>
                <Button size="small" danger>Cancel</Button>
              </Popconfirm>
            </>
          )}
          {record.status === 'CHECKED_IN' && (
            <Button size="small" type="primary" onClick={() => handleStatusUpdate(record.id, 'IN_PROGRESS')}>
              Start
            </Button>
          )}
          {record.status === 'IN_PROGRESS' && (
            <Button size="small" type="primary" onClick={() => handleStatusUpdate(record.id, 'COMPLETED')}>
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const tabItems = [
    { key: 'all', label: 'All' },
    { key: 'SCHEDULED', label: 'Scheduled' },
    { key: 'COMPLETED', label: 'Completed' },
    { key: 'CANCELLED', label: 'Cancelled' },
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
          Book Appointment
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
