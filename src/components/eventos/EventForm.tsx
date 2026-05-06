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
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <label htmlFor="nombre" className="text-sm font-medium">
          Nombre del Evento
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          required
          value={formData.nombre}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ej: Fiesta de la Vendimia"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lugar" className="text-sm font-medium">
          Lugar
        </label>
        <input
          id="lugar"
          name="lugar"
          type="text"
          required
          value={formData.lugar}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ej: Plaza Independencia"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="fecha_evento" className="text-sm font-medium">
            Fecha y Hora
          </label>
          <input
            id="fecha_evento"
            name="fecha_evento"
            type="datetime-local"
            required
            value={formData.fecha_evento}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="categoria" className="text-sm font-medium">
            Categoría
          </label>
          <select
            id="categoria"
            name="categoria"
            value={formData.categoria ?? ""}
            onChange={handleChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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

      <div className="space-y-2">
        <label htmlFor="fuente" className="text-sm font-medium">
          Fuente
        </label>
        <input
          id="fuente"
          name="fuente"
          type="text"
          value={formData.fuente ?? ""}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="Ej: instagram, manual, n8n"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          {isLoading
            ? "Guardando..."
            : initialData
            ? "Actualizar Evento"
            : "Crear Evento"}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
