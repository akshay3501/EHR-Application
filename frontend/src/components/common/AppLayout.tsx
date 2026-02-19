import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import type { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/authSlice';
import { ROLES } from '@/config/constants';

const { Header, Sider, Content } = Layout;

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  const roles = user?.roles || [];
  const hasRole = (role: string) => roles.includes(role);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    ...(hasRole(ROLES.ADMIN) || hasRole(ROLES.DOCTOR) || hasRole(ROLES.NURSE) || hasRole(ROLES.RECEPTIONIST)
      ? [{ key: '/patients', icon: <TeamOutlined />, label: 'Patients' }]
      : []),
    { key: '/appointments', icon: <CalendarOutlined />, label: 'Appointments' },
    ...(hasRole(ROLES.ADMIN) || hasRole(ROLES.DOCTOR) || hasRole(ROLES.NURSE) || hasRole(ROLES.LAB_TECHNICIAN)
      ? [{ key: '/lab-orders', icon: <ExperimentOutlined />, label: 'Lab Orders' }]
      : []),
    ...(hasRole(ROLES.ADMIN)
      ? [{ key: '/register', icon: <UserAddOutlined />, label: 'Register User' }]
      : []),
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: `${user?.firstName} ${user?.lastName}`, disabled: true },
    { key: 'role', label: roles.join(', '), disabled: true },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="dark">
        <div style={{ height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: collapsed ? 16 : 20, fontWeight: 'bold' }}>
          {collapsed ? 'EHR' : 'EHR Clinic'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: '0 24px', background: colorBgContainer, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: ({ key }) => { if (key === 'logout') handleLogout(); },
            }}
            placement="bottomRight"
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1677ff' }} />
              {!collapsed && <span>{user?.firstName}</span>}
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
