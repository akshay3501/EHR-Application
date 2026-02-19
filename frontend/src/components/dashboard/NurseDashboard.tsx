import { Row, Col, Card, Button, Space } from 'antd';
import { HeartOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/queries/useDashboard';
import StatCard from './StatCard';

export default function NurseDashboard() {
  const navigate = useNavigate();
  const { data } = useDashboardStats();

  return (
    <div>
      <h2>Nurse Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard title="Today's Appointments" value={data?.todayAppointments ?? 0} icon={<CalendarOutlined />} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard title="Total Patients" value={data?.totalPatients ?? 0} icon={<TeamOutlined />} color="#52c41a" />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard title="Pending Lab Samples" value={data?.pendingLabOrders ?? 0} icon={<HeartOutlined />} color="#faad14" />
        </Col>
      </Row>
      <Card title="Quick Actions" style={{ marginTop: 16 }}>
        <Space>
          <Button type="primary" icon={<HeartOutlined />} onClick={() => navigate('/patients')}>
            Record Vitals
          </Button>
          <Button icon={<CalendarOutlined />} onClick={() => navigate('/appointments')}>
            Check-In Patients
          </Button>
        </Space>
      </Card>
    </div>
  );
}
