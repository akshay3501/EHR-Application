import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';
import { ROLES } from '@/config/constants';

const AppLayout = lazy(() => import('@/components/common/AppLayout'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const PatientsPage = lazy(() => import('@/pages/PatientsPage'));
const PatientProfilePage = lazy(() => import('@/pages/PatientProfilePage'));
const AppointmentsPage = lazy(() => import('@/pages/AppointmentsPage'));
const LabOrdersPage = lazy(() => import('@/pages/LabOrdersPage'));
const LabOrderDetailPage = lazy(() => import('@/pages/LabOrderDetailPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const UnauthorizedPage = lazy(() => import('@/pages/UnauthorizedPage'));

const Loading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
  </div>
);

const wrap = (element: React.ReactNode) => <Suspense fallback={<Loading />}>{element}</Suspense>;

export const router = createBrowserRouter([
  {
    path: '/login',
    element: wrap(<LoginPage />),
  },
  {
    path: '/unauthorized',
    element: wrap(<UnauthorizedPage />),
  },
  {
    path: '/',
    element: wrap(
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: wrap(<DashboardPage />) },
      {
        path: 'patients',
        element: wrap(
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}>
            <PatientsPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'patients/:id',
        element: wrap(
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST]}>
            <PatientProfilePage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'appointments',
        element: wrap(<AppointmentsPage />),
      },
      {
        path: 'lab-orders',
        element: wrap(
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.LAB_TECHNICIAN]}>
            <LabOrdersPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'lab-orders/:id',
        element: wrap(
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.LAB_TECHNICIAN]}>
            <LabOrderDetailPage />
          </RoleBasedRoute>
        ),
      },
      {
        path: 'register',
        element: wrap(
          <RoleBasedRoute allowedRoles={[ROLES.ADMIN]}>
            <RegisterPage />
          </RoleBasedRoute>
        ),
      },
    ],
  },
]);
