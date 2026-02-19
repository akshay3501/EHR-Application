import { Tabs, Descriptions, Tag, Timeline, Table, Card, Empty, Statistic, Row, Col } from 'antd';
import { HeartOutlined, AlertOutlined } from '@ant-design/icons';
import { usePatient } from '@/hooks/queries/usePatients';
import StatusTag from '@/components/common/StatusTag';
import dayjs from 'dayjs';

interface Props {
  patientId: number;
}

export default function PatientProfile({ patientId }: Props) {
  const { data: patient, isLoading } = usePatient(patientId);

  if (isLoading || !patient) return null;

  const overviewTab = (
    <div>
      <Descriptions bordered column={2} size="small">
        <Descriptions.Item label="MRN">{patient.medicalRecordNumber}</Descriptions.Item>
        <Descriptions.Item label="Name">{patient.firstName} {patient.lastName}</Descriptions.Item>
        <Descriptions.Item label="DOB">{dayjs(patient.dateOfBirth).format('MM/DD/YYYY')}</Descriptions.Item>
        <Descriptions.Item label="Gender"><Tag>{patient.gender}</Tag></Descriptions.Item>
        <Descriptions.Item label="Blood Type">{patient.bloodType || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Phone">{patient.phone || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Email">{patient.email || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Address">
          {[patient.address, patient.city, patient.state, patient.zipCode].filter(Boolean).join(', ') || 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Insurance">{patient.insuranceProvider || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Policy #">{patient.insurancePolicyNumber || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Emergency Contact">
          {patient.emergencyContactName ? `${patient.emergencyContactName} (${patient.emergencyContactRelationship}) - ${patient.emergencyContactPhone}` : 'N/A'}
        </Descriptions.Item>
      </Descriptions>

      {patient.latestVitals && (
        <Card title="Latest Vitals" size="small" style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={4}><Statistic title="BP" value={`${patient.latestVitals.systolicBp || '-'}/${patient.latestVitals.diastolicBp || '-'}`} suffix="mmHg" /></Col>
            <Col span={4}><Statistic title="Heart Rate" value={patient.latestVitals.heartRate || '-'} suffix="bpm" prefix={<HeartOutlined />} /></Col>
            <Col span={4}><Statistic title="Temp" value={patient.latestVitals.temperature || '-'} suffix="°F" /></Col>
            <Col span={4}><Statistic title="SpO2" value={patient.latestVitals.oxygenSaturation || '-'} suffix="%" /></Col>
            <Col span={4}><Statistic title="BMI" value={patient.latestVitals.bmi || '-'} /></Col>
            <Col span={4}><Statistic title="Weight" value={patient.latestVitals.weight || '-'} suffix="kg" /></Col>
          </Row>
        </Card>
      )}
    </div>
  );

  const allergiesTab = (
    <div>
      {patient.allergies && patient.allergies.length > 0 ? (
        <Table
          dataSource={patient.allergies}
          rowKey="id"
          pagination={false}
          columns={[
            { title: 'Type', dataIndex: 'allergyType', render: (t: string) => <Tag>{t}</Tag> },
            { title: 'Allergen', dataIndex: 'allergen' },
            { title: 'Severity', dataIndex: 'severity', render: (s: string) => <StatusTag status={s} /> },
            { title: 'Reaction', dataIndex: 'reaction' },
          ]}
        />
      ) : (
        <Empty description="No allergies recorded" image={<AlertOutlined style={{ fontSize: 48, color: '#52c41a' }} />} />
      )}
    </div>
  );

  const medicalHistoryTab = (
    <div>
      {patient.medicalHistories && patient.medicalHistories.length > 0 ? (
        <Timeline
          items={patient.medicalHistories.map((h) => ({
            color: h.status === 'ACTIVE' ? 'red' : h.status === 'RESOLVED' ? 'green' : 'blue',
            children: (
              <div>
                <strong>{h.conditionName}</strong> <StatusTag status={h.status || 'ACTIVE'} />
                <br />
                <small>{h.diagnosisDate ? dayjs(h.diagnosisDate).format('MM/DD/YYYY') : 'Date unknown'}</small>
                {h.notes && <p style={{ margin: '4px 0 0', color: '#666' }}>{h.notes}</p>}
              </div>
            ),
          }))}
        />
      ) : (
        <Empty description="No medical history recorded" />
      )}
    </div>
  );

  return (
    <Tabs
      defaultActiveKey="overview"
      items={[
        { key: 'overview', label: 'Overview', children: overviewTab },
        { key: 'allergies', label: `Allergies (${patient.allergies?.length || 0})`, children: allergiesTab },
        { key: 'history', label: 'Medical History', children: medicalHistoryTab },
      ]}
    />
  );
}
