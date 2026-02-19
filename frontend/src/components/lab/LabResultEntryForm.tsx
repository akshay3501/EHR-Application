import { Form, Input, Button, message, Card, Tag, Space } from 'antd';
import { useEnterResult, useCollectSample, useVerifyResult } from '@/hooks/queries/useLabOrders';
import type { LabOrderItem } from '@/types/lab';

interface Props {
  orderId: number;
  item: LabOrderItem;
}

export default function LabResultEntryForm({ orderId, item }: Props) {
  const [form] = Form.useForm();
  const collectMutation = useCollectSample();
  const enterMutation = useEnterResult();
  const verifyMutation = useVerifyResult();

  const handleCollect = async () => {
    try {
      await collectMutation.mutateAsync({ orderId, itemId: item.id });
      message.success('Sample collected');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleEnterResult = async (values: { resultValue: string; notes?: string }) => {
    try {
      await enterMutation.mutateAsync({ orderId, itemId: item.id, data: values });
      message.success('Result entered');
      form.resetFields();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed');
    }
  };

  const handleVerify = async () => {
    try {
      await verifyMutation.mutateAsync({ orderId, itemId: item.id });
      message.success('Result verified');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <Card
      size="small"
      title={
        <Space>
          <span>{item.testCode} - {item.testName}</span>
          <Tag>{item.status}</Tag>
        </Space>
      }
      style={{ marginBottom: 8 }}
    >
      {item.status === 'PENDING' && (
        <Button onClick={handleCollect} loading={collectMutation.isPending}>
          Collect Sample
        </Button>
      )}

      {(item.status === 'SAMPLE_COLLECTED' || item.status === 'PROCESSING') && !item.result && (
        <Form form={form} layout="inline" onFinish={handleEnterResult}>
          <Form.Item name="resultValue" rules={[{ required: true }]}>
            <Input placeholder={`Result ${item.unit ? `(${item.unit})` : ''}`} />
          </Form.Item>
          <Form.Item name="notes">
            <Input placeholder="Notes" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={enterMutation.isPending}>
              Enter Result
            </Button>
          </Form.Item>
          {item.normalRange && <span style={{ color: '#999', marginLeft: 8 }}>Range: {item.normalRange}</span>}
        </Form>
      )}

      {item.result && (
        <Space direction="vertical">
          <span>
            Result: <strong>{item.result.resultValue}</strong>
            {item.unit && ` ${item.unit}`}
            {item.result.isAbnormal && <Tag color="red" style={{ marginLeft: 8 }}>Abnormal</Tag>}
          </span>
          {item.result.verifiedByName ? (
            <Tag color="green">Verified by {item.result.verifiedByName}</Tag>
          ) : (
            <Button size="small" onClick={handleVerify} loading={verifyMutation.isPending}>
              Verify Result
            </Button>
          )}
        </Space>
      )}
    </Card>
  );
}
