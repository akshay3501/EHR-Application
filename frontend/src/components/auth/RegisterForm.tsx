import { Form, Input, Button, Select, message, Card } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import type { RegisterRequest } from '@/types/auth';
import { ROLES } from '@/config/constants';

export default function RegisterForm() {
  const [form] = Form.useForm();

  const mutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: () => {
      message.success('User registered successfully');
      form.resetFields();
    },
    onError: (err: any) => {
      message.error(err.response?.data?.message || 'Registration failed');
    },
  });

  const onFinish = (values: RegisterRequest) => {
    mutation.mutate(values);
  };

  return (
    <Card title="Register New User" style={{ maxWidth: 600, margin: '0 auto' }}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="username" label="Username" rules={[{ required: true }, { min: 3 }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }, { min: 8 }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="specialization" label="Specialization">
          <Input />
        </Form.Item>
        <Form.Item name="licenseNumber" label="License Number">
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="roles" label="Roles" rules={[{ required: true, message: 'Select at least one role' }]}>
          <Select mode="multiple" placeholder="Select roles">
            {Object.values(ROLES).map((role) => (
              <Select.Option key={role} value={role}>
                {role.replace(/_/g, ' ')}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending} block>
            Register User
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
