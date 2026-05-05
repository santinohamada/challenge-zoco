-- ============================================
-- SCRIPT DE CONFIGURACIÓN SUPABASE - ZOCO TUCUMÁN
-- ============================================

-- 1. Crear tabla de eventos
-- ----------------------------------------------------------------------------
create table if not exists public.eventos (
  id uuid default uuid_generate_v4() primary key,
  nombre text not null,
  lugar text not null,
  categoria text,
  fecha_evento timestamp with time zone not null,
  fingerprint text not null unique, -- Clave única para evitar duplicados de n8n
  fuente text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Comentarios para documentación
comment on table public.eventos is 'Eventos obtenidos y procesados para Tucumán';
comment on column public.eventos.fingerprint is 'Hash único generado por n8n para evitar duplicados';

-- 2. Habilitar Row Level Security (RLS)
-- ----------------------------------------------------------------------------
-- RLS es fundamental en Supabase. Bloquea todo acceso por defecto a nivel de base de datos.
alter table public.eventos enable row level security;

-- 3. Definir Políticas de Acceso (Para el Challenge)
-- ----------------------------------------------------------------------------
-- NOTA PARA EL CHALLENGE: 
-- Como esto es una demo/prueba, usamos políticas permisivas (allow all).
-- EN PRODUCCIÓN: Deberías usar auth.uid() y roles para restringir quién edita qué.

-- Política para SELECT (Cualquiera puede ver, necesario para la Home Page)
create policy "Permitir lectura pública"
  on public.eventos
  for select
  using (true);

-- Política para INSERT (Cualquiera puede crear, para el formulario de 'new')
create policy "Permitir inserción"
  on public.eventos
  for insert
  with check (true);

-- Política para UPDATE (Cualquiera puede editar)
create policy "Permitir actualización"
  on public.eventos
  for update
  using (true)
  with check (true);

-- Política para DELETE (Cualquiera puede borrar, con confirmación en UI)
create policy "Permitir eliminación"
  on public.eventos
  for delete
  using (true);

-- 4. Trigger para actualizar 'updated_at' automáticamente
-- ----------------------------------------------------------------------------
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_eventos_updated_at
  before update on public.eventos
  for each row
  execute function public.handle_updated_at();

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- INSTRUCCIONES: Copiá este archivo, andá a tu proyecto de Supabase > SQL Editor,
-- pegá el contenido y hacé click en "Run".
-- ============================================
