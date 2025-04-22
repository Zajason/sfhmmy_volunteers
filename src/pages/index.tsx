// pages/index.tsx
import type { NextPage } from 'next'
import Head from 'next/head'


const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Volunteer Management System</title>
        <meta name="description" content="Volunteer Management System" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-[#212121]">
        <h1 className="text-4xl font-bold text-white">Welcome to the Volunteer Management System</h1>
        <p className="mt-4 text-lg text-gray-300">Your one-stop solution for managing volunteers.</p>
      </main>
    </>
  )
}

export default Home