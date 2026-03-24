import { create } from 'zustand';

export const MAX_COUNTER_STORAGE_KEY = 'maxCounterValue';

type CounterStore = {
  count: number;
  maxCount: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (newCount: number) => void;
  updateMaxCount: (newCount: number) => void;
};

export const useCounterStore = create<CounterStore>((set, get) => ({
  count: 0,
  maxCount: 0,

  increment: () => {
    const newCount = get().count + 1;
    set({ count: newCount });
    if (newCount > get().maxCount) {
      set({ maxCount: newCount });
      localStorage.setItem(MAX_COUNTER_STORAGE_KEY, newCount.toString());
    }
  },

  decrement: () => {
    const newCount = Math.max(0, get().count - 1);
    set({ count: newCount });
  },

  reset: () => set({ count: 0 }),

  setCount: (newCount: number) => {
    if (newCount >= 0) {
      set({ count: newCount });
      if (newCount > get().maxCount) {
        set({ maxCount: newCount });
        localStorage.setItem(MAX_COUNTER_STORAGE_KEY, newCount.toString());
      }
    }
  },

  updateMaxCount: (newCount: number) => {
    if (newCount > get().maxCount) {
      set({ maxCount: newCount });
      localStorage.setItem(MAX_COUNTER_STORAGE_KEY, newCount.toString());
    }
  },
}));

/** Call on the client after mount so `maxCount` matches persisted localStorage (e.g. after refresh). */
export function hydrateMaxFromStorage() {
  if (typeof window === 'undefined') return;
  const raw = localStorage.getItem(MAX_COUNTER_STORAGE_KEY);
  if (raw == null) return;
  const n = Number.parseInt(raw, 10);
  if (Number.isNaN(n) || n < 0) return;
  useCounterStore.setState((s) => ({
    maxCount: Math.max(s.maxCount, n),
  }));
}