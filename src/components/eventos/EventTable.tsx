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
    <div className="relative w-full overflow-auto">
      <table className="w-full caption-bottom text-sm">
        <thead className="[&_tr]:border-b">
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]=bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Nombre
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Lugar
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Fecha
            </th>
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
              Categoría
            </th>
            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {eventos.map((evento) => (
            <tr
              key={evento.id}
              className="border-b transition-colors hover:bg-muted/50 data-[state=selected]=bg-muted"
            >
              <td className="p-4 align-middle font-medium">{evento.nombre}</td>
              <td className="p-4 align-middle">{evento.lugar}</td>
              <td className="p-4 align-middle">
                {new Date(evento.fecha_evento).toLocaleDateString("es-AR")}
              </td>
              <td className="p-4 align-middle">{evento.categoria || "—"}</td>
              <td className="p-4 align-middle text-right space-x-2">
                <button
                  onClick={() => router.push(`/dashboard/eventos/${evento.id}`)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteClick(evento.id)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      {tableContent}
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
