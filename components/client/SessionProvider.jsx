'use client'
import { SessionProvider as SP } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function SessionProvider({ children, session }) {
  // const router = useRouter();
  // if(!session){
  //   return router.push("/login");
  // }
  return (
    <SP session={session}>
      {children}
    </SP>
  )
}

export default SessionProvider