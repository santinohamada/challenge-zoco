"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EventForm from "@/components/eventos/EventForm";
import type { EventoInsert } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

// Evitar pre-renderizado estático ya que requiere variables de entorno
export const dynamic = 'force-dynamic';

export default function NewEventoPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: EventoInsert) => {
    setIsLoading(true);

    const { error } = await supabase
      .from("eventos")
      .insert([data])
      .select()
      .single();

    setIsLoading(false);

    if (error) {
      console.error("Error creating evento:", error);
      showToast("Error al crear el evento. Verificá los datos.", "error");
      return;
    }

    showToast("Evento creado exitosamente! 🎉", "success");
    setTimeout(() => {
      router.push("/eventos");
    }, 1000); // Pequeño delay para que vean el toast
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Crear Nuevo Evento</h1>
        <p className="mt-2 text-zinc-500">
          Completá los datos del evento para agregarlo a la lista.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
