import { useState } from 'react';
import PatientList from '@/components/patients/PatientList';
import PatientForm from '@/components/patients/PatientForm';

export default function PatientsPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <h2>Patients</h2>
      <PatientList onAdd={() => setFormOpen(true)} />
      <PatientForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
