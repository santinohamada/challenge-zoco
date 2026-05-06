"use client";

import { useParams, useRouter } from "next/navigation";
import { useEvento, useUpdateEvento } from "@/hooks/useEventos";
import EventForm from "@/components/eventos/EventForm";
import type { EventoInsert } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

export default function EditEventoPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();

  const { data: evento, isLoading, isError } = useEvento(params.id);
  const updateEvento = useUpdateEvento();

  const handleSubmit = async (data: EventoInsert) => {
    updateEvento.mutate(
      { ...data, id: params.id },
      {
        onSuccess: () => {
          showToast("Evento actualizado correctamente!", "success");
          setTimeout(() => {
            router.push("/eventos");
          }, 1000);
        },
        onError: () => {
          showToast("Error al actualizar el evento.", "error");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-2xl animate-fade-in">
        <div>
          <div className="h-9 w-56 rounded-lg animate-shimmer"></div>
          <div className="h-5 w-80 rounded-lg animate-shimmer mt-3"></div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded animate-shimmer"></div>
              <div className="h-12 w-full rounded-xl animate-shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !evento) {
    return (
      <div className="flex items-center justify-center min-h-[400px] animate-scale-in">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center max-w-lg">
          <p className="text-lg font-semibold text-red-700">Evento no encontrado</p>
          <p className="text-sm text-red-500 mt-2">No se pudo cargar el evento solicitado.</p>
          <button
            onClick={() => router.push("/eventos")}
            className="mt-4 inline-flex items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 transition-colors"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in-up">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Editar Evento</h1>
        <p className="mt-2 text-zinc-500">
          Modificá los datos del evento seleccionado.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <EventForm
          initialData={evento}
          onSubmit={handleSubmit}
          isLoading={updateEvento.isPending}
        />
      </div>
    </div>
  );
}
