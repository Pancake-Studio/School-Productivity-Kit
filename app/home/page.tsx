'use server'

import DashboardButton from '../components/dashboardButton';

export default async function Home() {
    return (
        <>
            <h1>Home</h1>
            <DashboardButton />
        </>
    )
}