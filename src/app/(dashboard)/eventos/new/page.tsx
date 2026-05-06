"use client";

import { useRouter } from "next/navigation";
import { useCreateEvento } from "@/hooks/useEventos";
import EventForm from "@/components/eventos/EventForm";
import type { EventoInsert } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

export default function NewEventoPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const createEvento = useCreateEvento();

  const handleSubmit = async (data: EventoInsert) => {
    createEvento.mutate(data, {
      onSuccess: () => {
        showToast("Evento creado exitosamente! 🎉", "success");
        setTimeout(() => {
          router.push("/eventos");
        }, 1000);
      },
      onError: () => {
        showToast("Error al crear el evento. Verificá los datos.", "error");
      },
    });
  };

  return (
    <div className="space-y-8 max-w-2xl animate-fade-in-up">
      <div className="animate-fade-in-down">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Crear Nuevo Evento</h1>
        <p className="mt-2 text-zinc-500">
          Completá los datos del evento para agregarlo a la lista.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm animate-fade-in-up" style={{ animationDelay: "100ms" }}>
        <EventForm onSubmit={handleSubmit} isLoading={createEvento.isPending} />
      </div>
    </div>
  );
}
