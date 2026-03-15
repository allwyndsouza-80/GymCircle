"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type GymSummary = {
  id: string;
  name: string;
  location: string;
};

type AppState = {
  userId: string | null;
  email: string | null;
  persona: "owner" | "member" | null;

  gymsOwned: GymSummary[];
  memberships: GymSummary[];

  lastSyncedAt: number | null;

  setUser: (p: {
    id: string;
    email: string | null;
    persona: "owner" | "member" | null;
  }) => void;
  setGymsOwned: (gyms: GymSummary[]) => void;
  setMemberships: (gyms: GymSummary[]) => void;
  markSyncedNow: () => void;
  reset: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      userId: null,
      email: null,
      persona: null,
      gymsOwned: [],
      memberships: [],
      lastSyncedAt: null,

      setUser: ({ id, email, persona }) => set({ userId: id, email, persona }),

      setGymsOwned: (gyms) => set({ gymsOwned: gyms }),
      setMemberships: (gyms) => set({ memberships: gyms }),

      markSyncedNow: () => set({ lastSyncedAt: Date.now() }),

      reset: () =>
        set({
          userId: null,
          email: null,
          persona: null,
          gymsOwned: [],
          memberships: [],
          lastSyncedAt: null,
        }),
    }),
    {
      name: "gymcircle-app-store", // stored in localStorage
    }
  )
);
