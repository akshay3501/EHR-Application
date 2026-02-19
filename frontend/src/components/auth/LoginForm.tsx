import { Form, Input, Button, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '@/store/authSlice';
import type { AppDispatch, RootState } from '@/store';
import type { LoginRequest } from '@/types/auth';

const { Title } = Typography;

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const onFinish = (values: LoginRequest) => {
    dispatch(loginThunk(values));
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={2}>EHR Clinic</Title>
        <Title level={4} type="secondary" style={{ marginTop: 0 }}>Sign in to your account</Title>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 24 }}
        />
      )}

      <Form name="login" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item name="username" rules={[{ required: true, message: 'Please enter your username' }]}>
          <Input prefix={<UserOutlined />} placeholder="Username" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: 'Please enter your password' }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
        Default admin: admin / Admin@123
      </div>
    </div>
  );
}
