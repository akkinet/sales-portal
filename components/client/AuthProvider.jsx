'use client'
import { createContext, useEffect, useState } from "react"

export const AuthCtx = createContext(null);

function AuthProvider({ children, session }) {
    const [authSession, setAuthSession] = useState(null)
    useEffect(() => {
        setAuthSession(session)
    }, [session, authSession])
    return (
        <AuthCtx.Provider value={[authSession, setAuthSession]}>
            {children}
        </AuthCtx.Provider>
    )
}

export default AuthProvider