'use client'
import { SessionProvider as SP } from 'next-auth/react'

function SessionProvider({ children, session }) {
  return (
    <SP session={session}>
      {children}
    </SP>
  )
}

export default SessionProvider