import { Row, Col, Card, Button, Space } from 'antd';
import { CalendarOutlined, ExperimentOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/queries/useDashboard';
import StatCard from './StatCard';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { data } = useDashboardStats();

  return (
    <div>
      <h2>Doctor Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatCard title="Today's Appointments" value={data?.todayAppointments ?? 0} icon={<CalendarOutlined />} color="#1677ff" />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard title="Pending Lab Results" value={data?.pendingLabOrders ?? 0} icon={<ExperimentOutlined />} color="#faad14" />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatCard title="Total Patients" value={data?.totalPatients ?? 0} icon={<TeamOutlined />} color="#52c41a" />
        </Col>
      </Row>
      <Card title="Quick Actions" style={{ marginTop: 16 }}>
        <Space>
          <Button type="primary" icon={<CalendarOutlined />} onClick={() => navigate('/appointments')}>
            View Appointments
          </Button>
          <Button icon={<ExperimentOutlined />} onClick={() => navigate('/lab-orders')}>
            Lab Orders
          </Button>
          <Button icon={<TeamOutlined />} onClick={() => navigate('/patients')}>
            Patient Records
          </Button>
        </Space>
      </Card>
    </div>
  );
}
