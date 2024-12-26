'use client';

import { createContext, use, useRef } from 'react';

import { createStore, useStore } from 'zustand';

interface UserProps {
  userId: string;
  defaultDashboardId: number;
}

interface UserState extends UserProps {}

const createUserStore = (initProps?: Partial<UserProps>) => {
  const DEFAULT_PROPS: UserProps = {
    defaultDashboardId: 0,
    userId: '',
  };
  return createStore<UserState>()(() => ({
    ...DEFAULT_PROPS,
    ...initProps,
  }));
};

type UserStore = ReturnType<typeof createUserStore>;

type UserProviderProps = React.PropsWithChildren<UserProps>;

const UserContext = createContext<UserStore | undefined>(undefined);

export default function UserProvider({
  children,
  ...props
}: UserProviderProps) {
  const storeRef = useRef<UserStore>(undefined);
  if (!storeRef.current) {
    storeRef.current = createUserStore(props);
  }
  return <UserContext value={storeRef.current}>{children}</UserContext>;
}

export function useUserContext<T>(selector: (state: UserState) => T): T {
  const store = use(UserContext);
  if (!store) throw new Error('Missing UserContext.Provider in the tree');
  return useStore(store, selector);
}
