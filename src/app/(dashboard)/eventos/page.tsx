"use client";

import { useState, useMemo } from "react";
import { useEventos, useCreateEvento, useUpdateEvento, useDeleteEvento } from "@/hooks/useEventos";
import EventTable from "@/components/eventos/EventTable";
import EventModal from "@/components/eventos/EventModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import type { Evento, EventoInsert } from "@/types/database";
import { useToast } from "@/components/ui/Toaster";
import { CATEGORIAS } from "@/components/eventos/EventForm";

type ModalState =
  | { mode: "create" }
  | { mode: "edit"; evento: Evento }
  | null;

export default function EventosPage() {
  const { data: eventos = [], isLoading, isError } = useEventos();

  const createEvento = useCreateEvento();
  const updateEvento = useUpdateEvento();
  const deleteEvento = useDeleteEvento();

  const [modal, setModal] = useState<ModalState>(null);

  // Estado de eliminación — manejado aquí, no en la tabla
  const [confirmEvento, setConfirmEvento] = useState<Evento | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Filtros
  const [filterCategoria, setFilterCategoria] = useState<string>("");
  const [filterFechaDesde, setFilterFechaDesde] = useState<string>("");

  const filteredEventos = useMemo(() => {
    let result = eventos;
    if (filterCategoria) result = result.filter((e) => e.categoria === filterCategoria);
    if (filterFechaDesde) {
      const fechaDesde = new Date(filterFechaDesde);
      result = result.filter((e) => new Date(e.fecha_evento) >= fechaDesde);
    }
    return result;
  }, [filterCategoria, filterFechaDesde, eventos]);

  const { showToast } = useToast();

  const isModalLoading = createEvento.isPending || updateEvento.isPending;

  const handleModalSubmit = (data: EventoInsert) => {
    if (!modal) return;

    if (modal.mode === "create") {
      createEvento.mutate(data, {
        onSuccess: () => {
          showToast("Evento creado exitosamente! 🎉", "success");
          setModal(null);
        },
        onError: () => showToast("Error al crear el evento.", "error"),
      });
    } else {
      updateEvento.mutate(
        { ...data, id: modal.evento.id },
        {
          onSuccess: () => {
            showToast("Evento actualizado correctamente.", "success");
            setModal(null);
          },
          onError: () => showToast("Error al actualizar el evento.", "error"),
        }
      );
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmEvento) return;
    const id = confirmEvento.id;
    setConfirmEvento(null);
    setRemovingId(id);
    // Wait for row exit animation
    await new Promise((r) => setTimeout(r, 350));
    deleteEvento.mutate(id, {
      onSuccess: () => showToast("Evento eliminado.", "success"),
      onError: () => showToast("Error al eliminar el evento.", "error"),
    });
    setRemovingId(null);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[500px] animate-fade-in">
        <div className="w-full space-y-4">
          <div className="h-8 w-44 rounded-lg animate-shimmer" />
          <div className="h-4 w-64 rounded-lg animate-shimmer" />
          <div className="mt-8 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-14 w-full rounded-xl animate-shimmer"
                style={{ animationDelay: `${i * 80}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center min-h-[500px] animate-scale-in">
        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center max-w-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-red-700">Error al cargar</p>
          <p className="text-sm text-red-500 mt-2">No se pudieron cargar los eventos.</p>
        </div>
      </div>
    );

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in-down">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Eventos</h1>
            <p className="text-sm text-zinc-500 mt-1">Gestioná los eventos de Zoco Tucumán</p>
          </div>
          <button
            onClick={() => setModal({ mode: "create" })}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 hover:shadow-lg active:scale-[0.98]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Crear Evento
          </button>
        </div>

        {/* Filtros */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label htmlFor="filter-cat" className="text-sm font-medium text-zinc-700">
                Categoría
              </label>
              <select
                id="filter-cat"
                value={filterCategoria}
                onChange={(e) => setFilterCategoria(e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              >
                <option value="">Todas</option>
                {CATEGORIAS.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 space-y-2">
              <label htmlFor="filter-fecha" className="text-sm font-medium text-zinc-700">
                Desde Fecha
              </label>
              <input
                id="filter-fecha"
                type="date"
                value={filterFechaDesde}
                onChange={(e) => setFilterFechaDesde(e.target.value)}
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm transition-all hover:border-zinc-300 focus:border-zinc-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900/20"
              />
            </div>
            {(filterCategoria || filterFechaDesde) && (
              <div className="flex items-end animate-fade-in">
                <button
                  onClick={() => { setFilterCategoria(""); setFilterFechaDesde(""); }}
                  className="h-11 px-5 text-sm font-medium text-red-600 transition-all hover:text-red-700 hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Contador */}
        <div className="flex items-center justify-between animate-fade-in" style={{ animationDelay: "160ms" }}>
          <p className="text-sm text-zinc-500">
            Mostrando <span className="font-semibold text-zinc-900">{filteredEventos.length}</span> de{" "}
            <span className="font-semibold text-zinc-900">{eventos.length}</span> eventos
          </p>
        </div>

        {/* Tabla / Empty */}
        {filteredEventos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-12 text-center animate-scale-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100">
              <svg className="h-8 w-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-zinc-700">No hay eventos</p>
            <p className="text-sm text-zinc-500 mt-1">
              {filterCategoria || filterFechaDesde
                ? "No se encontraron eventos con los filtros seleccionados."
                : "Creá el primer evento usando el botón de arriba."}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <EventTable
              eventos={filteredEventos}
              removingId={removingId}
              onDeleteRequest={setConfirmEvento}
              onEdit={(evento) => setModal({ mode: "edit", evento })}
            />
          </div>
        )}
      </div>

      {/* Modal create/edit — renderizado en el root, fuera de cualquier transform */}
      <EventModal
        isOpen={modal !== null}
        mode={modal?.mode ?? "create"}
        evento={modal?.mode === "edit" ? modal.evento : undefined}
        isLoading={isModalLoading}
        onSubmit={handleModalSubmit}
        onClose={() => !isModalLoading && setModal(null)}
      />

      {/* ConfirmDialog — renderizado en el root, sin stacking context problemático */}
      <ConfirmDialog
        isOpen={confirmEvento !== null}
        title="Eliminar evento"
        message={`¿Eliminás "${confirmEvento?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        cancelText="Cancelar"
        isDestructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConfirmEvento(null)}
      />
    </>
  );
}
