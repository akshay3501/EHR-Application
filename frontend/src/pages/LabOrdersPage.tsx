import { useState } from 'react';
import LabOrderList from '@/components/lab/LabOrderList';
import LabOrderForm from '@/components/lab/LabOrderForm';

export default function LabOrdersPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div>
      <h2>Lab Orders</h2>
      <LabOrderList onAdd={() => setFormOpen(true)} />
      <LabOrderForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
