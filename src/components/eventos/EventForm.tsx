"use client";

import { useState, useEffect } from "react";
import type { Evento, EventoInsert } from "@/types/database";

interface EventFormProps {
  initialData?: Evento;
  onSubmit: (data: EventoInsert) => void;
  isLoading?: boolean;
}

const CATEGORIAS = ["CULTURA", "NOCTURNO", "GASTRONOMÍA"] as const;

export default function EventForm({
  initialData,
  onSubmit,
  isLoading = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventoInsert>({
    nombre: initialData?.nombre ?? "",
    lugar: initialData?.lugar ?? "",
    categoria: initialData?.categoria ?? "",
    fecha_evento: initialData?.fecha_evento
      ? new Date(initialData.fecha_evento).toISOString().slice(0, 16)
      : "",
    fingerprint: initialData?.fingerprint ?? crypto.randomUUID(),
    fuente: initialData?.fuente ?? "manual",
    descripcion: initialData?.descripcion ?? null,
  });

  // Sync if initialData changes (modal reuse)
  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre ?? "",
        lugar: initialData.lugar ?? "",
        categoria: initialData.categoria ?? "",
        fecha_evento: initialData.fecha_evento
          ? new Date(initialData.fecha_evento).toISOString().slice(0, 16)
          : "",
        fingerprint: initialData.fingerprint ?? crypto.randomUUID(),
        fuente: initialData.fuente ?? "manual",
        descripcion: initialData.descripcion ?? null,
      });
    }
  }, [initialData?.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div className="space-y-2">
        <label htmlFor="nombre" className="text-sm font-semibold text-zinc-700">
          Nombre del Evento
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          value={formData.nombre}
          onChange={handleChange}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="Ej: Fiesta de la Vendimia"
        />
      </div>

      {/* Lugar */}
      <div className="space-y-2">
        <label htmlFor="lugar" className="text-sm font-semibold text-zinc-700">
          Lugar
        </label>
        <input
          id="lugar"
          name="lugar"
          type="text"
          required
          value={formData.lugar}
          onChange={handleChange}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="Ej: Plaza Independencia"
        />
      </div>

      {/* Grid: Fecha y Categoría */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="fecha_evento" className="text-sm font-semibold text-zinc-700">
            Fecha y Hora
          </label>
          <input
            id="fecha_evento"
            name="fecha_evento"
            type="datetime-local"
            required
            value={formData.fecha_evento}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="categoria" className="text-sm font-semibold text-zinc-700">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria ?? ""}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          >
            <option value="">Seleccionar...</option>
            {CATEGORIAS.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Fuente */}
      <div className="space-y-2">
        <label htmlFor="fuente" className="text-sm font-semibold text-zinc-700">
          Fuente
        </label>
        <input
          id="fuente"
          name="fuente"
          type="text"
          value={formData.fuente ?? ""}
          onChange={handleChange}
          className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="Ej: instagram, manual, n8n"
        />
      </div>

      {/* Descripción */}
      <div className="space-y-2">
        <label htmlFor="descripcion" className="text-sm font-semibold text-zinc-700">
          Descripción
          <span className="ml-2 text-xs font-normal text-zinc-400">(opcional)</span>
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={3}
          value={formData.descripcion ?? ""}
          onChange={handleChange}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20 resize-none"
          placeholder="Descripción del evento..."
        />
      </div>

      {/* Botones — los maneja el modal */}
      <input type="submit" id="event-form-submit" className="hidden" />
    </form>
  );
}

export { CATEGORIAS };
