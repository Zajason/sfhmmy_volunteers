export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome to My Web App!
      </h1>
      <p className="mt-4 text-gray-700">
        This is a test to verify Tailwind CSS is working properly.
      </p>
      <button className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
        Sample Button
      </button>
    </main>
  );
}