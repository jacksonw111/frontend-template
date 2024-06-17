import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

interface State {
  access_token: string | undefined;
  refresh_token: string | undefined;
}

interface Action {
  setToken: (lang: State["access_token"]) => void;
  setRefreshToken: (lang: State["refresh_token"]) => void;
  clean: () => void;
}

export const useGlobalStore = create<State & Action>()(
  devtools(
    persist(
      (set) => {
        return {
          access_token: undefined,
          refresh_token: undefined,
          clean: () =>
            set({ access_token: undefined, refresh_token: undefined }),
          setToken: (access_token: State["access_token"]) =>
            set({
              access_token,
            }),
          setRefreshToken: (refresh_token: State["refresh_token"]) =>
            set({
              refresh_token,
            }),
        };
      },
      {
        name: "globalStore",
        storage: createJSONStorage(() => localStorage),
      }
    ),
    { name: "globalStore" }
  )
);
