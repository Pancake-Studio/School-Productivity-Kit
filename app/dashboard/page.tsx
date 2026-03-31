'use client'

import { useSession } from "next-auth/react"

export default function Dashboard() {
    const { data: session } = useSession()
    console.log(session)
    return (
        <>
            <h1>Dashboard</h1>
            <p>{session?.user?.email}</p>
        </>
    )
}