# Zoco Tucumán - Sistema Automatizado de Eventos
🚀 Demo: https://challenge-zoco-rosy.vercel.app  
📦 Workflows n8n: https://github.com/santinohamada/n8n-zoco-challenge

---

## ✅ Cumplimiento de la Consigna

### Parte 1 – Obtención de Datos (Scraping)
- **Fuente**: Scraping directo a `agenda.eltucumano.com` (no mock)
- **Frecuencia**: Cada 3 horas (no agresivo, cumple requisito)
- **Datos extraídos**: `nombre`, `lugar`, `fecha_evento`, `categoría`, `fuente`
- **Manejo de errores**: Nodos de error en n8n + reintentos automáticos
- **Stack**: n8n + HTTP Request + CSS Selectors

### Parte 2 – CRUD
- **Stack**: Next.js 16 (App Router) + Supabase (PostgreSQL)
- **Campos**:
  | Campo          | Tipo       | Requerido |
  |----------------|------------|-----------|
  | nombre         | text       | Sí        |
  | lugar          | text       | Sí        |
  | categoria      | text       | No (la genera la IA)        |
  | fuente         | text       | No (la genera la IA)        |
  | fecha_evento   | timestamp  | Sí        |
  | fingerprint    | text       | Sí (único)|
  | descripcion    | text       | No (la genera la IA)       |
- **Operaciones**: Crear (modal con validación), Listar (dashboard con filtros), Editar, Eliminar/Desactivar
- **Ruta**: `/eventos` (dashboard)

### Parte 3 – Automatización (n8n en Render)
2 workflows deployados en Render:
1. **Scraping + Carga**: Schedule Trigger cada 3h → Scrapea → IA normaliza → POST a Supabase
2. **Verificación de Duplicados**: Webhook → IA semántica → Responde al frontend si es duplicado
- **Evita duplicados**: Doble capa (fingerprint + IA)
- **Logs**: n8n Execution Logs + tabla `eventos` con `created_at`

### Parte 4 – Uso de IA (Obligatorio)
IA vía **Groq LLM** en n8n para:
1. **Clasificación**: Categorías `CULTURA`, `NOCTURNO`, `GASTRONOMÍA`
2. **Normalización**: Limpieza de nombres, fechas ambiguas
3. **Detección semántica de duplicados**: Detecta "Bar Irlanda Tucumán" y "Irlanda Bar" como mismo evento

### Parte 5 – Criterio Técnico
#### ¿Cómo evitás duplicados?
- **Capa 1 (Determinista)**: Fingerprint único en DB (`nombre-lugar-fecha` normalizado)
- **Capa 2 (IA)**: Groq compara similitud semántica cuando hay eventos en la misma fecha
- **Umbrales**: >85% bloquea creación, 50-85% avisa warning

#### ¿Cómo escalarías este sistema?
- **DB**: Índices en `fecha_evento`, read replicas de Supabase, particionado por mes si crece >10k eventos
- **Frontend**: Paginación en dashboard, `staleTime` mayor en React Query
- **n8n**: Modo Queue con Redis para alto volumen de scraping
- **IA**: Cache de respuestas por fingerprint para reducir costos

#### ¿Qué problemas puede tener este flujo?
| Problema                | Mitigación                          |
|-------------------------|-------------------------------------|
| Scraping roto por HTML  | IA flexible para parseo, no solo selectores |
| Falsos positivos en IA  | Umbrales de confianza (85%+)        |
| n8n downtime            | Fallback a carga manual (ya implementado) |
| Rate limits en LLM      | Groq (alta velocidad, bajo costo)   |

#### ¿Cómo mejorarías la calidad de los datos?
- Agregar fuentes múltiples (Instagram, Facebook Events)
- Normalización de direcciones con IA + geolocalización
- Validación manual opcional (sistema de aprobación)
- Búsqueda full-text en PostgreSQL

---

## 🎁 Bonus Implementados
✅ Dashboard responsive (Next.js + Tailwind + Framer Motion)  
✅ ISR (60s de revalidación en home)  
✅ React Query para gestión de estado  
✅ TypeScript estricto  
✅ Detección de duplicados con IA  

---

## 🛠️ Stack Tecnológico
| Categoría       | Tecnología                     |
|-----------------|--------------------------------|
| Frontend        | Next.js 16, TypeScript, Tailwind |
| Backend/DB      | Supabase (PostgreSQL + RLS)    |
| Automatización  | n8n (deployado en Render)      |
| IA              | Groq LLM                       |
| Estado          | React Query v5                 |
| Animaciones     | Framer Motion 12               |

---

## 🚀 Deployment
- **App principal**: Vercel (https://challenge-zoco-rosy.vercel.app)
- **Workflows n8n**: Render (2 servicios, uno programado, otro webhook)

---

## 📦 Instalación Local
```bash
# 1. Clonar repo
git clone https://github.com/santinohamada/challenge-zoco.git
cd challenge-zoco

# 2. Instalar dependencias
npm install

# 3. Configurar .env.local (ver sección Variables de Entorno)

# 4. Ejecutar
npm run dev
```

---

## 🔑 Variables de Entorno
Crea `.env.local` en la raíz:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[TU-PROYECTO].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[TU-ANON-KEY]

# n8n (Render URLs)
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://[TU-SERVICIO-RENDER].onrender.com/webhook/duplicados
NEXT_PUBLIC_N8N_LOAD_WEBHOOK_URL=https://[TU-SERVICIO-RENDER].onrender.com/webhook/load
```

---

## 📸 Screenshots de los Workflows
https://github.com/santinohamada/n8n-zoco-challenge/tree/main/screenshots

---

## 📌 Conclusión
Todos los requisitos de la consigna están cubiertos: scraping real, CRUD funcional, automatización con n8n, uso obligatorio de IA para detección semántica de duplicados, y respuestas explícitas al criterio técnico. El sistema es escalable y está deployado.
