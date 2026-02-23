import { useEffect, useState } from "react";

export function useLocalStorageNumber(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = Number.parseInt(window.localStorage.getItem(key) ?? "", 10);
    return Number.isNaN(stored) ? initialValue : stored;
  });

  useEffect(() => {
    window.localStorage.setItem(key, String(value));
  }, [key, value]);

  return [value, setValue];
}
