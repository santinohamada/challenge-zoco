"use client";

import { useState } from "react";
import type { Evento } from "@/types/database";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

interface EventTableProps {
  eventos: Evento[];
  onDelete: (id: string) => Promise<void>;
}

export default function EventTable({ eventos, onDelete }: EventTableProps) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedId) {
      await onDelete(selectedId);
    }
    setConfirmOpen(false);
    setSelectedId(null);
  };

  if (eventos.length === 0) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No hay eventos para mostrar. ¡Empezá creando uno!
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50/50">
              <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Nombre</th>
              <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Lugar</th>
              <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Fecha</th>
              <th className="h-12 px-6 text-left align-middle font-semibold text-zinc-600">Categoría</th>
              <th className="h-12 px-6 text-right align-middle font-semibold text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento, index) => (
              <tr 
                key={evento.id} 
                className={`border-b border-zinc-100 transition-colors hover:bg-zinc-50/80 ${index % 2 === 0 ? 'bg-white' : 'bg-zinc-50/30'}`}
              >
                <td className="p-4 px-6 align-middle font-medium text-zinc-900">{evento.nombre}</td>
                <td className="p-4 px-6 align-middle text-zinc-600">{evento.lugar}</td>
                <td className="p-4 px-6 align-middle text-zinc-600">
                  {new Date(evento.fecha_evento).toLocaleDateString("es-AR", {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>
                <td className="p-4 px-6 align-middle">
                  {evento.categoria ? (
                    <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
                      {evento.categoria}
                    </span>
                  ) : (
                    <span className="text-zinc-400">—</span>
                  )}
                </td>
                <td className="p-4 px-6 align-middle text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => router.push(`/eventos/${evento.id}`)} 
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                      </svg>
                      Editar
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(evento.id)} 
                      className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que querés eliminar este evento? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
