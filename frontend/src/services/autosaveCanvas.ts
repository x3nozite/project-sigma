import { useEffect, useRef } from "react";

export function useAutosaveCanvas<T>(
  value: T,
  delay: number,
  saveFn: () => void
) {
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Clear previous timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      console.log("saved");
    }

    // Start new timer
    timeoutRef.current = window.setTimeout(() => {
      saveFn();
    }, delay);

    // Cleanup if component unmounts
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value, delay, saveFn]);
}
