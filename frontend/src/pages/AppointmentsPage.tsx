import { useState } from 'react';
import AppointmentList from '@/components/appointments/AppointmentList';
import AppointmentForm from '@/components/appointments/AppointmentForm';

export default function AppointmentsPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <h2>Appointments</h2>
      <AppointmentList onAdd={() => setFormOpen(true)} />
      <AppointmentForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
