import { AuthButton } from "@/app/components/AuthButton";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/db", { cache: "no-store" });
  const data = await res.json();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-8 text-white">
      <h1 className="mb-8 text-4xl font-bold">Tests desde Prisma</h1>

      <div className="mb-8">
        <AuthButton />
      </div>

      {data.connected ? (
        <ul className="max-w-md space-y-2">
          {data.tests?.length ? (
            data.tests.map((test: { id: string; name: string; createdAt: string }) => (
              <li key={test.id} className="rounded bg-gray-800 p-4">
                {test.name} — {new Date(test.createdAt).toLocaleString()}
              </li>
            ))
          ) : (
            <li className="text-gray-400">No hay registros aún.</li>
          )}
        </ul>
      ) : (
        <p className="text-red-400">Error: {data.error}</p>
      )}
    </main>
  );
}
