import { useState } from 'react';
import { Drawer, Form, Select, DatePicker, Input, Button, Tag, message, Empty } from 'antd';
import { useCreateAppointment, useAvailableSlots } from '@/hooks/queries/useAppointments';
import { usePatients } from '@/hooks/queries/usePatients';
import dayjs from 'dayjs';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AppointmentForm({ open, onClose }: Props) {
  const [form] = Form.useForm();
  const [doctorId, setDoctorId] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const createMutation = useCreateAppointment();
  const { data: patients } = usePatients({ size: 100 });

  const { data: slots } = useAvailableSlots(
    doctorId,
    selectedDate,
    selectedDate
  );

  const availableSlots = slots?.filter((s) => s.available) || [];

  const onFinish = async (values: any) => {
    try {
      await createMutation.mutateAsync({
        patientId: values.patientId,
        doctorId: values.doctorId,
        appointmentDate: values.appointmentDate.format('YYYY-MM-DD'),
        startTime: values.startTime,
        reason: values.reason,
      });
      message.success('Appointment booked');
      form.resetFields();
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <Drawer
      title="Book Appointment"
      open={open}
      onClose={onClose}
      width={480}
      extra={
        <Button type="primary" onClick={() => form.submit()} loading={createMutation.isPending}>
          Book
        </Button>
      }
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="patientId" label="Patient" rules={[{ required: true }]}>
          <Select showSearch placeholder="Select patient" optionFilterProp="label"
            options={patients?.content.map((p) => ({
              value: p.id,
              label: `${p.firstName} ${p.lastName} (${p.medicalRecordNumber})`,
            }))}
          />
        </Form.Item>

        <Form.Item name="doctorId" label="Doctor ID" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter doctor ID"
            onChange={(e) => setDoctorId(Number(e.target.value))} />
        </Form.Item>

        <Form.Item name="appointmentDate" label="Date" rules={[{ required: true }]}>
          <DatePicker
            style={{ width: '100%' }}
            disabledDate={(d) => d.isBefore(dayjs(), 'day')}
            onChange={(d) => setSelectedDate(d ? d.format('YYYY-MM-DD') : '')}
          />
        </Form.Item>

        <Form.Item name="startTime" label="Time Slot" rules={[{ required: true }]}>
          {availableSlots.length > 0 ? (
            <Select placeholder="Select time slot">
              {availableSlots.map((slot) => (
                <Select.Option key={slot.startTime} value={slot.startTime}>
                  {slot.startTime} - {slot.endTime}
                </Select.Option>
              ))}
            </Select>
          ) : (
            <div>
              <Empty description="Select a doctor and date to see available slots" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              <Input placeholder="Or enter time manually (HH:mm)" />
            </div>
          )}
        </Form.Item>

        <Form.Item name="reason" label="Reason">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Drawer>
  );
}
