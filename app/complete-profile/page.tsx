"use client"

import { useSession } from "next-auth/react"
import { useState } from "react"
import Image from "next/image"

export default function CompleteProfilePage() {
    const { data: session } = useSession()

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        const res = await fetch("/api/user/complete-profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ firstName, lastName }),
        })

        if (!res.ok) {
            setError("Something went wrong. Please try again.")
            setLoading(false)
            return
        }

        window.location.href = "/dashboard"
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6">
            <h1 className="text-2xl font-bold mb-6">Complete your profile</h1>

            {session?.user.image && (
                <Image
                    src={session.user.image}
                    alt="Profile"
                    width={80}
                    height={80}
                    className="rounded-full mb-4"
                />
            )}

            {error && (
                <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Profile"}
                </button>
            </form>
        </div>
    )
}