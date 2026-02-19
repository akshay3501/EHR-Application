import { Descriptions, Table, Tag, Button, Card, Space, Divider } from 'antd';
import { PrinterOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useLabOrder } from '@/hooks/queries/useLabOrders';
import StatusTag from '@/components/common/StatusTag';
import type { LabOrderItem } from '@/types/lab';
import dayjs from 'dayjs';

interface Props {
  orderId: number;
}

export default function LabReportView({ orderId }: Props) {
  const { data: order, isLoading } = useLabOrder(orderId);

  if (isLoading || !order) return null;

  const handlePrint = () => window.print();

  const columns = [
    { title: 'Test Code', dataIndex: 'testCode', width: 100 },
    { title: 'Test Name', dataIndex: 'testName' },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (s: string) => <StatusTag status={s} />,
    },
    {
      title: 'Result',
      key: 'result',
      render: (_: unknown, item: LabOrderItem) =>
        item.result ? (
          <Space>
            <span>{item.result.resultValue}</span>
            {item.unit && <span style={{ color: '#999' }}>{item.unit}</span>}
            {item.result.isAbnormal ? (
              <Tag color="red" icon={<ExclamationCircleOutlined />}>Abnormal</Tag>
            ) : (
              <Tag color="green" icon={<CheckCircleOutlined />}>Normal</Tag>
            )}
          </Space>
        ) : (
          <Tag>Pending</Tag>
        ),
    },
    {
      title: 'Normal Range',
      dataIndex: 'normalRange',
      render: (r: string) => r || 'N/A',
    },
    {
      title: 'Verified By',
      key: 'verified',
      render: (_: unknown, item: LabOrderItem) =>
        item.result?.verifiedByName || '-',
    },
  ];

  return (
    <div className="lab-report">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }} className="no-print">
        <h2>Lab Report</h2>
        <Button icon={<PrinterOutlined />} onClick={handlePrint}>Print Report</Button>
      </div>

      <Card size="small">
        <Descriptions bordered size="small" column={2}>
          <Descriptions.Item label="Order #">{order.orderNumber}</Descriptions.Item>
          <Descriptions.Item label="Status"><StatusTag status={order.status} /></Descriptions.Item>
          <Descriptions.Item label="Patient">{order.patientName}</Descriptions.Item>
          <Descriptions.Item label="MRN">{order.patientMrn}</Descriptions.Item>
          <Descriptions.Item label="Ordering Doctor">{order.doctorName}</Descriptions.Item>
          <Descriptions.Item label="Priority"><StatusTag status={order.priority} /></Descriptions.Item>
          <Descriptions.Item label="Order Date">{dayjs(order.createdAt).format('MM/DD/YYYY HH:mm')}</Descriptions.Item>
          {order.clinicalNotes && (
            <Descriptions.Item label="Notes" span={2}>{order.clinicalNotes}</Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Divider />

      <Table
        columns={columns}
        dataSource={order.items}
        rowKey="id"
        pagination={false}
        size="small"
      />

      <style>{`
        @media print {
          .no-print { display: none !important; }
          .ant-layout-sider, .ant-layout-header { display: none !important; }
          .ant-layout-content { margin: 0 !important; padding: 0 !important; }
        }
      `}</style>
    </div>
  );
}
