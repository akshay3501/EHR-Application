import { useState } from 'react';
import { Table, Input, Button, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { usePatients } from '@/hooks/queries/usePatients';
import type { PatientSummary } from '@/types/patient';
import dayjs from 'dayjs';

interface Props {
  onAdd: () => void;
}

export default function PatientList({ onAdd }: Props) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const { data, isLoading } = usePatients({ search, page, size: 20 });

  const columns = [
    { title: 'MRN', dataIndex: 'medicalRecordNumber', key: 'mrn', width: 180 },
    {
      title: 'Name',
      key: 'name',
      render: (_: unknown, record: PatientSummary) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: 'DOB',
      dataIndex: 'dateOfBirth',
      key: 'dob',
      render: (dob: string) => dayjs(dob).format('MM/DD/YYYY'),
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (g: string) => <Tag>{g}</Tag>,
    },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'status',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'red'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: PatientSummary) => (
        <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/patients/${record.id}`)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Input
          placeholder="Search patients..."
          prefix={<SearchOutlined />}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          style={{ width: 300 }}
          allowClear
        />
        <Button type="primary" icon={<PlusOutlined />} onClick={onAdd}>
          Add Patient
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
          showTotal: (total) => `Total ${total} patients`,
        }}
      />
    </>
  );
}
