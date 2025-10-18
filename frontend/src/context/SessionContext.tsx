import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase-client";

const SessionContext = createContext<any | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<any | null>(null);

  useEffect(() => {
    console.log("SessionContext mounted");
    supabase.auth.getSession().then(({ data: { session } }) => {   
        console.log("initial session: ", session);
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
        console.log("Auth state changed:", session);
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
