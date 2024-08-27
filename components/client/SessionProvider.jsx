"use client";
import { SessionProvider as SP } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";

function SessionProvider({ children, session }) {
  const router = useRouter();
  // useEffect(() => {
  //   if (!session || !session?.user) {
  //     router.push('/login');
  //   }
  // }, [session])
  const checkSession = useCallback(() => {
    if (!session || !session?.user) {
      router.push("/login");
      return;
    }
  }, [session]);
  checkSession();
  return <SP session={session}>{children}</SP>;
}

export default SessionProvider;
