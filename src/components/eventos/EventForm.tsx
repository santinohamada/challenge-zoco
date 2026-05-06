"use client";

import { useState } from "react";
import type { Evento, EventoInsert } from "@/types/database";

interface EventFormProps {
  initialData?: Evento;
  // El formulario siempre envía los campos base de EventoInsert
  onSubmit: (data: EventoInsert) => void;
  isLoading?: boolean;
}

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
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
          className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
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
          className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="Ej: Plaza Independencia"
        />
      </div>

      {/* Grid: Fecha y Categoría */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
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
            className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          >
            <option value="">Seleccionar...</option>
            <option value="Música">Música</option>
            <option value="Feria">Feria</option>
            <option value="Gastronomía">Gastronomía</option>
            <option value="Arte">Arte</option>
            <option value="Deportes">Deportes</option>
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
          className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2 text-sm transition-all placeholder:text-zinc-400 hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
          placeholder="Ej: instagram, manual, n8n"
        />
      </div>

      {/* Botones */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              Guardando...
            </>
          ) : (
            <>
              {initialData ? "Actualizar Evento" : "Crear Evento"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-all hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98]"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
