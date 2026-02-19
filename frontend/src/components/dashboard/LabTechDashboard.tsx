import { Row, Col, Card, Button, Space } from 'antd';
import { ExperimentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDashboardStats } from '@/hooks/queries/useDashboard';
import StatCard from './StatCard';

export default function LabTechDashboard() {
  const navigate = useNavigate();
  const { data } = useDashboardStats();

  return (
    <div>
      <h2>Lab Technician Dashboard</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <StatCard title="Pending Lab Orders" value={data?.pendingLabOrders ?? 0} icon={<ExperimentOutlined />} color="#faad14" />
        </Col>
        <Col xs={24} sm={12}>
          <StatCard title="Today's Appointments" value={data?.todayAppointments ?? 0} icon={<CheckCircleOutlined />} color="#52c41a" />
        </Col>
      </Row>
      <Card title="Quick Actions" style={{ marginTop: 16 }}>
        <Space>
          <Button type="primary" icon={<ExperimentOutlined />} onClick={() => navigate('/lab-orders')}>
            Process Lab Orders
          </Button>
        </Space>
      </Card>
    </div>
  );
}
