import { useCallback } from "react";
import { initIndexedDb } from "./initIndexedDb";

export const useIndexedDBInit = () => {
  const init = useCallback(async () => {
    const _isDbReady = sessionStorage.getItem("isDbReady");
    const isExpired = sessionStorage.getItem("isExpired");

    if (!_isDbReady || !isExpired) {
      sessionStorage.setItem("isDbReady", JSON.stringify(true));
      sessionStorage.setItem("isExpired", JSON.stringify(true));
      const success = await initIndexedDb();

      if (!success) console.error("InitDb - Something went wrong");
    }
  }, [])

  return { init };
}

