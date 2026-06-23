import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      theme: 'dark',
      login: async (email, password) => {
        const normalized = (email || '').trim().toLowerCase();
        const isAdmin = normalized === 'admin' && password === 'admin';
        const isBsiPassword = password === 'bsi123';

        if (isAdmin || isBsiPassword) {
          const userEmail = normalized.includes('@') ? normalized : `${normalized || 'admin'}@bsi.co.id`;
          set({
            token: 'dummy-token-bsi',
            user: { name: (normalized.split('@')[0] || 'admin').replace(/\b\w/g, (m) => m.toUpperCase()), email: userEmail },
          });
          return { ok: true };
        }

        return { ok: false, error: 'Invalid credentials' };
      },
      logout: () => set({ token: null, user: null }),
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'cb-auth',
      partialize: (state) => ({ token: state.token, user: state.user, theme: state.theme }),
    }
  )
);

