# CreatorCV Frontend

Aplicación web para crear, editar y exportar currículums vitae con inteligencia artificial.

## Tecnologías

- **React 18** con **Vite** (build tool)
- **Supabase** (autenticación y base de datos en tiempo real)
- **html2pdf.js** (exportación a PDF)
- **Font Awesome** (iconografía)
- **Google Fonts** (tipografías)

## Características

### Autenticación
- Login/Registro con email y contraseña
- Autenticación OAuth con Google
- Validación de seguridad de contraseñas en tiempo real
- Video de fondo personalizable en `/public/background.mp4`

### Editor de CV
- **6 plantillas predefinidas**: Professional, Clean Minimal, Elegant Serif, Creative Designer, Warm Creative, Dark Impact
- **Compositor de diseños**: Crea plantillas personalizadas con bloques modulares
- **Editor en tiempo real**: Vista previa instantánea mientras editas
- **Gestión de fotos**: Recorte circular con zoom y posición

### Inteligencia Artificial
- Asistente de redacción basado en backend Spring Boot
- Sugerencias automáticas de habilidades e idiomas
- Regeneración completa del CV mediante IA

### Persistencia
- Guardado automático en Supabase (PostgreSQL)
- Historial de versiones con snapshots
- Diseños guardados (recipes) reutilizables
- Documentos adjuntos (certificaciones) vinculables

### Exportación
- Exportar a PDF con calidad profesional (3x scale)
- Compartir CV mediante enlace público `/share/{projectId}`

## Estructura del Proyecto

```
src/
├── components/
│   ├── AuthPage.jsx/css        # Página de login/registro
│   ├── Dashboard.jsx           # Menú principal de selección
│   ├── SharedCV.jsx            # Visualización de CV compartido
│   ├── ProfileModal.jsx        # Modal de perfil de usuario
│   └── ErrorBoundary.jsx       # Manejo de errores
├── context/
│   └── AuthContext.jsx         # Contexto de autenticación
├── hooks/
│   ├── useCvData.js            # Hook principal de datos CV + Supabase
│   └── useChatIA.js            # Hook para interacción con IA
├── templates/
│   ├── ResumeA-F.jsx           # Plantillas estáticas
│   ├── CVTemplate.jsx          # Componente principal
│   └── engine/
│       ├── ComposerPanel.jsx   # Panel de composición de bloques
│       ├── ComposedTemplate.jsx # Plantilla compuesta
│       ├── registry.js          # Registro de bloques
│       └── blocks/              # Bloques modulares reutilizables
├── services/
│   └── api.js                 # URLs del backend Spring Boot
└── utils/
    ├── theme.js                 # Sistema de temas
    ├── dialogs.js               # Diálogos personalizados
    └── mergeCvData.js           # Fusión de datos extraídos
```

## Configuración

### Variables de Entorno
El proyecto usa Supabase configurado en `src/lib/supabase.js`:
- **URL**: `https://cbejosufzuzubkwlazjb.supabase.co`
- **Anon Key**: Almacenada en el cliente (las políticas RLS protegen los datos)

### Backend IA
El motor de IA requiere el servicio Spring Boot ejecutándose. Configura `src/services/api.js` con la URL del backend.

## Scripts Disponibles

```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo (Vite)
npm run build        # Build de producción
npm run preview      # Vista previa del build
npm run lint         # Ejecutar ESLint
```

## Video de Fondo (Login)

Coloca `background.mp4` en `/public/` siguiendo estas especificaciones:
- Formato: H.264, .mp4
- Resolución: 1920x1080 o 1280x720
- Duración: 10-30 segundos (loop fluido)
- Peso: <10MB (comprimido)

## Base de Datos (Supabase)

### Tablas
| Tabla | Descripción |
|-------|-------------|
| `cv_projects` | Proyectos de currículum (JSON completo) |
| `cv_versions` | Historial de versiones con snapshots |
| `saved_designs` | Recetas de diseños personalizados |

Todas las tablas tienen **RLS (Row Level Security)** habilitado. Ver `CreatorCV-DataBase-/README.md` para scripts SQL de configuración.