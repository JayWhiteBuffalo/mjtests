"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Session, User } from "@supabase/supabase-js";
import supabase from "@api/supabaseBrowser";
import {uniqueRecord} from '@util/SupabaseUtil'

export const EVENTS = {
  PASSWORD_RECOVERY: "PASSWORD_RECOVERY",
  SIGNED_OUT: "SIGNED_OUT",
  USER_UPDATED: "USER_UPDATED",
};

type AuthContextType = {
  initial: any;
  session: any;
  user: any;
  setView: any;
};

export const AuthContext = createContext<AuthContextType>({
  initial: null,
  session: null,
  user: null,
});

export const AuthProvider = ({children}) => {
  const [initial, setInitial] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState()

  const router = useRouter();

  useEffect(() => {
    async function getActiveSession() {
      const {
        data: { session: activeSession },
      } = await supabase.auth.getSession();
      setSession(activeSession);
      setUser(activeSession?.user ?? null);
      setInitial(false);
    }
    getActiveSession();

    const {
      data: { subscription: authListener },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      switch (event) {
        case EVENTS.PASSWORD_RECOVERY:
          router.push('/auth/update-password');
          break;
        case EVENTS.SIGNED_OUT:
        case EVENTS.USER_UPDATED:
          router.push('/auth');
          break;
        default:
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('users')
        .select()
        .eq('user_id', user.id)
        .then(uniqueRecord)
        // TODO timing collision
        .then(setProfile)
    } else {
      setProfile(undefined)
    }
  }, [user])

  const value = useMemo(() => {
    return {
      initial,
      session,
      user,
      profile,
    };
  }, [initial, session, user, profile]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
