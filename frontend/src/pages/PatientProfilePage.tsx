import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PatientProfile from '@/components/patients/PatientProfile';

export default function PatientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div>
      <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/patients')} style={{ marginBottom: 16, padding: 0 }}>
        Back to Patients
      </Button>
      <PatientProfile patientId={Number(id)} />
    </div>
  );
}
