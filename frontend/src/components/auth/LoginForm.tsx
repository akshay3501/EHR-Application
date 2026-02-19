import { Form, Input, Button, Alert } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { loginThunk, clearError } from '@/store/authSlice';
import type { AppDispatch, RootState } from '@/store';
import type { LoginRequest } from '@/types/auth';

const BRAND_COLOR = '#3DBE9A';

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const onFinish = (values: LoginRequest) => {
    dispatch(loginThunk(values));
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          background: BRAND_COLOR,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}>
          <TeamOutlined style={{ color: '#fff', fontSize: 20 }} />
        </div>
        <span style={{ fontSize: 22, fontWeight: 700, color: BRAND_COLOR, letterSpacing: 0.5 }}>
          Healthcare
        </span>
      </div>

      <h2 style={{ fontSize: 26, fontWeight: 800, color: '#1a1a1a', margin: '0 0 24px 0' }}>
        Login
      </h2>

      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          closable
          onClose={() => dispatch(clearError())}
          style={{ marginBottom: 20 }}
        />
      )}

      <Form name="login" onFinish={onFinish} size="large" layout="vertical">
        <Form.Item
          label={<span style={{ fontWeight: 500, color: '#444' }}>Email id</span>}
          name="username"
          rules={[{ required: true, message: 'Please enter your username' }]}
          style={{ marginBottom: 18 }}
        >
          <Input
            placeholder=""
            style={{ borderRadius: 4, borderColor: '#ccc' }}
          />
        </Form.Item>

        <Form.Item
          label={<span style={{ fontWeight: 500, color: '#444' }}>Password</span>}
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
          style={{ marginBottom: 28 }}
        >
          <Input.Password
            placeholder=""
            style={{ borderRadius: 4, borderColor: '#ccc' }}
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            htmlType="submit"
            loading={isLoading}
            block
            style={{
              background: BRAND_COLOR,
              borderColor: BRAND_COLOR,
              color: '#fff',
              fontWeight: 600,
              fontSize: 15,
              height: 44,
              borderRadius: 4,
            }}
          >
            Login
          </Button>
        </Form.Item>
      </Form>

      <div style={{ textAlign: 'center', color: '#bbb', fontSize: 11, marginTop: 4 }}>
        Default: admin / Admin@123
      </div>
    </div>
  );
}
