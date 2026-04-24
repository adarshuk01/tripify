import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      isDark: false,
      toggle: () => {
        const newVal = !get().isDark;
        set({ isDark: newVal });
        if (newVal) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      init: () => {
        if (get().isDark) {
          document.documentElement.classList.add('dark');
        }
      },
    }),
    { name: 'tripify-theme' }
  )
);

export default useThemeStore;
