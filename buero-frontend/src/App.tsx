import { RouterProvider } from 'react-router-dom';
import { AppErrorBoundary } from './errors';
import { router } from './routes';
import { useEffect } from 'react';
import { useAppDispatch } from './redux/hooks';
import { refreshUserThunk } from './redux/slices/auth/authThunks';

export default function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(refreshUserThunk());
  })
  return (
    <AppErrorBoundary>
      <RouterProvider router={router} />
    </AppErrorBoundary>
  );
}
