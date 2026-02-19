import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, App as AntApp } from 'antd';
import { store } from '@/store';
import { initializeAuthThunk } from '@/store/authSlice';
import { router } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
  },
});

function AuthInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    store.dispatch(initializeAuthThunk());
  }, []);
  return <>{children}</>;
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#1677ff',
              borderRadius: 6,
            },
          }}
        >
          <AntApp>
            <AuthInitializer>
              <RouterProvider router={router} />
            </AuthInitializer>
          </AntApp>
        </ConfigProvider>
      </QueryClientProvider>
    </Provider>
  );
}
