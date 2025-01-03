import { useCallback, useMemo, useState } from 'react';

import { canuseDom } from '@/lib/can-use-dom';

export default function useLocalStorage<T>(key: string, defaultValue?: T) {
  const [value, _setValue] = useState(() => {
    if (canuseDom) return localStorage.getItem(key) || defaultValue;
    return defaultValue;
  });

  const setValue = useCallback((value: T) => {
    localStorage.setItem(key, value as any);
    _setValue(value);
  }, []);

  return useMemo(
    () => ({
      setValue,
      value,
    }),
    [value, setValue],
  );
}
