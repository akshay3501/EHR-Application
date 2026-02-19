import { Row, Col, Spin } from 'antd';
import { TeamOutlined, CalendarOutlined, ExperimentOutlined, UserOutlined } from '@ant-design/icons';
import { useDashboardStats } from '@/hooks/queries/useDashboard';
import StatCard from './StatCard';

export default function AdminDashboard() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading) return <Spin size="large" />;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Patients" value={data?.totalPatients ?? 0} icon={<TeamOutlined />} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Today's Appointments" value={data?.todayAppointments ?? 0} icon={<CalendarOutlined />} color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Pending Lab Orders" value={data?.pendingLabOrders ?? 0} icon={<ExperimentOutlined />} color="#faad14" />
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatCard title="Total Users" value={data?.totalUsers ?? 0} icon={<UserOutlined />} color="#722ed1" />
        </Col>
      </Row>
    </div>
  );
}
