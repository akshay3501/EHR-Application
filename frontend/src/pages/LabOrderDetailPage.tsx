import { useParams, useNavigate } from 'react-router-dom';
import { Button, Divider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import LabReportView from '@/components/lab/LabReportView';
import LabResultEntryForm from '@/components/lab/LabResultEntryForm';
import { useLabOrder } from '@/hooks/queries/useLabOrders';

export default function LabOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const orderId = Number(id);
  const { data: order } = useLabOrder(orderId);

  return (
    <div>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/lab-orders')} style={{ marginBottom: 16, padding: 0 }}>
        Back to Lab Orders
      </Button>
      <LabReportView orderId={orderId} />

      {order && order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
        <>
          <Divider />
          <h3>Process Items</h3>
          {order.items.map((item) => (
            <LabResultEntryForm key={item.id} orderId={orderId} item={item} />
          ))}
        </>
      )}
    </div>
  );
}
