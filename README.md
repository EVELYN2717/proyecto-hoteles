# Proyecto Hoteles - Prueba Técnica UltraGroup

Sistema de gestión hotelera desarrollado con **Angular 21** como prueba técnica Frontend Developer. La aplicación maneja dos perfiles de usuario (Administrador y Viajero) con funcionalidades diferenciadas para la gestión de hoteles, habitaciones y reservas.

## Funcionalidades

### Módulo 1 - Administrador

| Funcionalidad | Descripción |
|---|---|
| Crear hotel | Formulario reactivo con validaciones (nombre, ciudad, dirección, estrellas, descripción) |
| Editar hotel | Edición de datos del hotel con precarga de valores existentes |
| Habilitar / Deshabilitar | Toggle de estado activo/inactivo por hotel |
| Gestión de habitaciones | CRUD de habitaciones por hotel (tipo, costo, impuestos, ubicación, capacidad) |
| Gestión de reservas | Listado de reservas filtrable por hotel con detalle completo del huésped |

### Módulo 2 - Viajero

| Funcionalidad | Descripción |
|---|---|
| Búsqueda de hoteles | Filtros por ciudad (obligatorio), fecha entrada (obligatorio) y fecha salida (opcional) con validaciones de fecha |
| Selección de hotel | Detalle del hotel con listado de habitaciones disponibles, precios e impuestos |
| Reserva | Formulario de datos del huésped (7 campos obligatorios) + contacto de emergencia |
| Confirmación | Pantalla de confirmación con resumen completo de la reserva |

## Arquitectura

```
src/app/
  core/                          # Servicios singleton, guards, estado global
    models/                      # Interfaces TypeScript (Hotel, Room, Booking, Guest)
    services/                    # HotelService, BookingService (CRUD in-memory con Signals)
    guards/                      # RoleGuard - protección de rutas por rol
    state/                       # RoleState - estado global del rol con Signals
  shared/                        # Componentes reutilizables
    components/
      header/                    # Navegación dinámica según rol activo
      loading-spinner/           # Indicador de carga
      notification/              # Sistema de notificaciones toast (success/error/info)
  features/
    role-select/                 # Página de selección de rol
    admin/                       # Feature lazy-loaded
      hotel-list/                # Grid de hoteles con toggle activo/inactivo
      hotel-form/                # Formulario crear/editar hotel + gestión de habitaciones
      booking-list/              # Listado de reservas con detalle
    traveler/                    # Feature lazy-loaded
      hotel-search/              # Búsqueda con filtros y validaciones de fecha
      hotel-detail/              # Detalle hotel + habitaciones disponibles
      booking-form/              # Formulario de reserva (huésped + emergencia)
      booking-confirmation/      # Confirmación con resumen completo
```

## Decisiones Técnicas

| Decisión | Justificación |
|---|---|
| **Angular 21 Standalone Components** | Sin NgModules, aprovechando la API moderna de Angular para componentes más ligeros y tree-shakeable |
| **Signals para state management** | El scope del proyecto no justifica NgRx. Signals ofrece reactividad granular con menos boilerplate y mejor rendimiento |
| **Reactive Forms** | Validaciones declarativas, tipado fuerte y control programático sobre el estado del formulario |
| **Lazy Loading por feature** | Cada módulo (admin/traveler) se carga bajo demanda, simulando escalabilidad en un entorno empresarial |
| **Mock in-memory con Signals** | Los servicios simulan un backend con datos en memoria. La interfaz de servicio está diseñada para ser reemplazable por HTTP sin cambiar los componentes |
| **SCSS + CSS Custom Properties** | Variables globales para colores, radios y sombras permiten theming consistente y fácil mantenimiento |
| **Guard basado en rol** | `roleGuard` protege rutas por rol seleccionado, redirigiendo al selector si no hay rol activo |
| **SSR con renderMode Client** | Rutas con parámetros dinámicos usan `RenderMode.Client` para evitar problemas de prerender |

## Modelo de Dominio

- **Hotel**: id, name, city, address, description, stars, isActive, imageUrl, rooms[]
- **Room**: id, hotelId, type (single/double/suite/family), baseCost, taxes, location, isAvailable, capacity
- **Booking**: id, hotelId, hotelName, roomId, roomType, checkIn, checkOut, guest, emergencyContact, totalCost, createdAt
- **Guest**: fullName, birthDate, gender, documentType, documentNumber, email, phone
- **EmergencyContact**: fullName, phone

## Requisitos

- **Node.js** >= 20
- **npm** >= 9
- **Angular CLI** 21.x

## Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:4200)
npm start

# Build de producción
npm run build

# Ejecutar build de producción con SSR
npm run serve:ssr:proyecto-hoteles

# Ejecutar tests unitarios
npm test
```

## Testing

El proyecto incluye tests unitarios con **Vitest** (12 tests):

- **HotelService** (11 tests): CRUD completo, búsqueda por ciudad, toggle activo/inactivo, gestión de habitaciones, toggle de disponibilidad
- **App** (1 test): Creación del componente root

```bash
npm test
```

## Validaciones implementadas

- Todos los formularios usan Reactive Forms con validadores (`required`, `minLength`, `min`, `max`, `email`)
- Mensajes de error con layout estable (no desplazan otros campos al aparecer)
- Fechas: entrada no permite fechas pasadas, salida no permite fechas anteriores a entrada
- Búsqueda filtra hoteles sin habitaciones disponibles
- Guard de ruta impide acceso a módulos sin rol seleccionado

## Escalabilidad

La arquitectura está diseñada para escalar:

- **Servicios desacoplados**: La interfaz de `HotelService` y `BookingService` puede reemplazarse por implementaciones HTTP sin modificar componentes
- **Feature modules lazy-loaded**: Nuevos módulos se agregan como features independientes
- **Estado centralizado con Signals**: Migración a NgRx posible si la complejidad crece
- **Componentes shared reutilizables**: Header, spinner, notificaciones disponibles globalmente
- **TypeScript estricto**: Interfaces tipadas garantizan contratos claros entre capas
