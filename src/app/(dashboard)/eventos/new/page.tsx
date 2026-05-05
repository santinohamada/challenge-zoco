"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EventForm from "@/components/eventos/EventForm";
import type { EventoInsert } from "@/types/database";

export default function NewEventoPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: EventoInsert) => {
    setIsLoading(true);
    setError(null);

    const { error } = await supabase
      .from("eventos")
      .insert([data])
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      console.error("Error creating evento:", error);
      setError("Error al crear el evento. Verificá los datos.");
      return;
    }

    // Redirigir a la lista de eventos
    router.push("/dashboard/eventos");
    router.refresh(); // Refrescar datos del servidor
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Evento</h1>
        <p className="text-muted-foreground">
          Completá los datos del evento para agregarlo a la lista.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
