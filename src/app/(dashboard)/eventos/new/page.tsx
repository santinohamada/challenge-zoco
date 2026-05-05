"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import EventForm from "@/components/eventos/EventForm";
import type { EventoInsert } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";

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
      router.push("/dashboard/eventos");
    }, 1000); // Pequeño delay para que vean el toast
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Crear Nuevo Evento</h1>
        <p className="text-muted-foreground">
          Completá los datos del evento para agregarlo a la lista.
        </p>
      </div>

      <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
