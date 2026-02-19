import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { ROLES } from '@/config/constants';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import DoctorDashboard from '@/components/dashboard/DoctorDashboard';
import NurseDashboard from '@/components/dashboard/NurseDashboard';
import LabTechDashboard from '@/components/dashboard/LabTechDashboard';

export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth);
  const roles = user?.roles || [];

  if (roles.includes(ROLES.ADMIN)) return <AdminDashboard />;
  if (roles.includes(ROLES.DOCTOR)) return <DoctorDashboard />;
  if (roles.includes(ROLES.NURSE)) return <NurseDashboard />;
  if (roles.includes(ROLES.LAB_TECHNICIAN)) return <LabTechDashboard />;

  return <AdminDashboard />;
}
