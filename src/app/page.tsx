import { getSupabaseServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Evento } from "@/types/database";

export const revalidate = 60; // Revalidar cada 60 segundos (ISR)

export default async function HomePage() {
  const supabase = getSupabaseServerClient();

  const { data: eventos, error } = await supabase
    .from("eventos")
    .select("*")
    // .gte("fecha_evento", new Date().toISOString()) // <-- COMENTADO PARA PROBAR
    .order("fecha_evento", { ascending: true })
    .limit(6); // Mostrar solo los próximos 6

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-1.5 text-sm text-white">
            <span>📍</span>
            <span>Tucumán, Argentina</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 sm:text-7xl">
            Zoco Tucumán
          </h1>
          <p className="mt-6 text-xl text-zinc-600 max-w-2xl mx-auto">
            Descubrí los mejores eventos y bares de la provincia.
            Tu guía definitiva para no perderte nada.
          </p>
        </div>

        {/* Lista de Eventos */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Próximos Eventos
            </h2>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-600">
              {eventos?.length || 0} eventos
            </span>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
              <p className="text-red-600 font-medium text-lg">Error al cargar eventos</p>
              <p className="text-sm text-red-500 mt-2">{error.message}</p>
            </div>
          ) : (!eventos || eventos.length === 0) ? (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center">
              <p className="text-zinc-500 text-lg">No hay eventos próximos por el momento.</p>
              <p className="text-sm text-zinc-400 mt-2">¡Volvé pronto para descubrir nuevos eventos!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {eventos.map((evento: Evento, index) => (
                <div
                  key={evento.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div>
                    <span className="inline-block rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
                      {evento.categoria || "General"}
                    </span>
                    <h3 className="mt-4 text-xl font-bold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {evento.nombre}
                    </h3>
                    <div className="mt-4 space-y-2">
                      <p className="flex items-center gap-2 text-sm text-zinc-600">
                        <span className="text-base">📍</span>
                        {evento.lugar}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-zinc-600">
                        <span className="text-base">📅</span>
                        {new Date(evento.fecha_evento).toLocaleDateString("es-AR", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <div className="mt-16 flex flex-col items-center gap-4">
          <Link
            href="/eventos"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-zinc-800 hover:shadow-xl active:scale-[0.98]"
          >
            Administrar Eventos
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
          <p className="text-sm text-zinc-500">
            Gestioná tus eventos desde el dashboard
          </p>
        </div>
      </main>
    </div>
  );
}
