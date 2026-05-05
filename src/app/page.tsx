import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Evento } from "@/types/database";

export const revalidate = 60; // Revalidar cada 60 segundos (ISR)

export default async function HomePage() {
  const supabase = getSupabaseServerClient();

  const { data: eventos } = await supabase
    .from("eventos")
    .select("*")
    .gte("fecha_evento", new Date().toISOString()) // Solo eventos futuros
    .order("fecha_evento", { ascending: true })
    .limit(6); // Mostrar solo los próximos 6

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 font-sans">
      <main className="flex flex-col items-center w-full max-w-5xl px-4 py-16 sm:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
            Zoco Tucumán
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Descubrí los mejores eventos y bares de Tucumán.
          </p>
        </div>

        {/* Lista de Eventos */}
        <section className="w-full">
          <h2 className="text-2xl font-semibold mb-6 text-zinc-800">
            Próximos Eventos
          </h2>

          {(!eventos || eventos.length === 0) ? (
            <div className="text-center py-10 text-zinc-500 border border-dashed rounded-lg">
              No hay eventos próximos por el momento. ¡Volvé pronto!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {eventos.map((evento: Evento) => (
                <div
                  key={evento.id}
                  className="group relative flex flex-col justify-between p-6 bg-white rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div>
                    <span className="inline-block px-2 py-1 mb-3 text-xs font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
                      {evento.categoria || "General"}
                    </span>
                    <h3 className="text-lg font-semibold text-zinc-900 mb-2">
                      {evento.nombre}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-1">
                      📍 {evento.lugar}
                    </p>
                    <p className="text-sm text-zinc-500">
                      📅 {new Date(evento.fecha_evento).toLocaleDateString("es-AR", {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  {/* Opcional: Link a detalle si lo implementamos después */}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Link
            href="/dashboard/eventos"
            className="inline-flex items-center justify-center rounded-md bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow transition-colors hover:bg-zinc-700"
          >
            Administrar Eventos
          </Link>
        </div>
      </main>
    </div>
  );
}
