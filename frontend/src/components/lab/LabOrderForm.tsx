import { Drawer, Form, Select, Radio, Input, Button, message } from 'antd';
import { useCreateLabOrder } from '@/hooks/queries/useLabOrders';
import { useLabTests } from '@/hooks/queries/useLabOrders';
import { usePatients } from '@/hooks/queries/usePatients';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function LabOrderForm({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const createMutation = useCreateLabOrder();
  const { data: tests } = useLabTests();
  const { data: patients } = usePatients({ size: 100 });

  const onFinish = async (values: any) => {
    try {
      await createMutation.mutateAsync(values);
      message.success('Lab order created');
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to create lab order');
    }
  };

  return (
    <Drawer
      title="New Lab Order"
      open={open}
      onClose={onClose}
      width={520}
      extra={
        <Button type="primary" onClick={() => form.submit()} loading={createMutation.isPending}>
          Create Order
        </Button>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ priority: 'ROUTINE' }}>
        <Form.Item name="patientId" label="Patient" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select patient" optionFilterProp="label"
            options={patients?.content.map((p) => ({
              value: p.id,
              label: `${p.firstName} ${p.lastName} (${p.medicalRecordNumber})`,
            }))}
          />
        </Form.Item>

        <Form.Item name="testIds" label="Lab Tests" rules={[{ required: true, message: 'Select at least one test' }]}>
          <Select mode="multiple" placeholder="Select tests" optionFilterProp="label"
            options={tests?.map((t) => ({
              value: t.id,
              label: `${t.testCode} - ${t.testName}`,
            }))}
          />
        </Form.Item>

        <Form.Item name="priority" label="Priority">
          <Radio.Group>
            <Radio value="ROUTINE">Routine</Radio>
            <Radio value="URGENT">Urgent</Radio>
            <Radio value="STAT">STAT</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name="clinicalNotes" label="Clinical Notes">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
