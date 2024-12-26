import { useRef } from 'react';

export default function useDebounce(ms: number) {
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return function debounce(fn: () => void) {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = setTimeout(fn, ms);
  };
}
