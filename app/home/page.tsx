'use server'

import LoginButton from '../components/loginButton';

export default async function Home() {
    return (
        <>
            <h1>Home</h1>
            <LoginButton />
        </>
    )
}