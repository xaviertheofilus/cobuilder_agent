import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { useAuthStore } from './stores/useAuthStore';

export default function App() {
  const theme = useAuthStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <AppRouter />;
}

