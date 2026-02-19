import { Form, Input, DatePicker, Select, Drawer, Button, Row, Col, Divider, message } from 'antd';
import { useCreatePatient, useUpdatePatient } from '@/hooks/queries/usePatients';
import type { Patient } from '@/types/patient';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  onClose: () => void;
  patient?: Patient | null;
}

export default function PatientForm({ open, onClose, patient }: Props) {
  const [form] = Form.useForm();
  const createMutation = useCreatePatient();
  const updateMutation = useUpdatePatient();
  const isEdit = !!patient;

  const onFinish = async (values: any) => {
    const data = { ...values, dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD') };
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({ id: patient!.id, data });
        message.success('Patient updated');
      } else {
        await createMutation.mutateAsync(data);
        message.success('Patient created');
      }
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to save patient');
    }
  };

  return (
    <Drawer
      title={isEdit ? 'Edit Patient' : 'New Patient'}
      open={open}
      onClose={onClose}
      width={640}
      extra={
        <Button type="primary" onClick={() => form.submit()}
          loading={createMutation.isPending || updateMutation.isPending}>
          {isEdit ? 'Update' : 'Create'}
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={patient ? {
          ...patient,
          dateOfBirth: dayjs(patient.dateOfBirth),
        } : undefined}
      >
        <Divider orientation="left">Personal Information</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="MALE">Male</Select.Option>
                <Select.Option value="FEMALE">Female</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="bloodType" label="Blood Type">
              <Select allowClear>
                {['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE'].map(bt => (
                  <Select.Option key={bt} value={bt}>{bt.replace('_', ' ')}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Contact Information</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="phone" label="Phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="Email">
              <Input />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="state" label="State">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="zipCode" label="Zip Code">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Insurance</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="insuranceProvider" label="Insurance Provider">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="insurancePolicyNumber" label="Policy Number">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Emergency Contact</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="emergencyContactName" label="Name">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="emergencyContactPhone" label="Phone">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="emergencyContactRelationship" label="Relationship">
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
}
