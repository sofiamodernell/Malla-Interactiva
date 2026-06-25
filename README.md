# Malla Interactiva - UTEC

Herramienta web interactiva para el seguimiento del progreso académico de los estudiantes de **Ingeniería Mecatrónica (IMEC, Plan 2023)** de la **Universidad Tecnológica del Uruguay (UTEC)**.

Permite visualizar la malla curricular completa, marcar el estado de cada materia (pendiente, cursada o aprobada), validar correlatividades en tiempo real, calcular notas finales según el sistema de evaluación de cada curso, y exportar un reporte de avance en PDF.

---
**DEMO EN VIVO:** [sofiamodernell.github.io/Malla-Interactiva](https://sofiamodernell.github.io/Malla-Interactiva/)
---

## Tabla de contenidos

- [Características](#características)
- [Vista general](#vista-general)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Modelo de datos](#modelo-de-datos)
- [Instalación y uso local](#instalación-y-uso-local)
- [Configuración de Firebase](#configuración-de-firebase)
- [Despliegue](#despliegue)
- [Cómo agregar o editar una carrera](#cómo-agregar-o-editar-una-carrera)
- [Seguridad](#seguridad)
- [Agradecimientos](#agradecimientos)
- [Autora](#autora)
- [Licencia](#licencia)

---

## Características

### [1] Seguimiento académico
*   **Malla interactiva por semestre:** Visualización de las 10 ediciones semestrales de cada plan de estudios, con sus materias, créditos y áreas temáticas.
*   **Estado de cada materia** con tres niveles seleccionables mediante clics sucesivos:
    *   `[ ] Pendiente` (Sin cursar)
    *   `[/] Cursada` (Cursó pero no aprobó examen)
    *   `[X] Aprobada` (Acreditada con sus respectivos créditos)
*   **Validación automática de correlatividades:** Cada materia define sus requisitos de curso (`reqCurso`) y de examen (`reqExamen`). El sistema restringe el progreso inconsistente y señala de forma explícita qué materias de origen faltan cumplir.
*   **Soporte para materias anuales** (`anualId`): Agrupa partes fragmentadas de una misma asignatura de carácter anual (por ejemplo, Prácticas Profesionales distribuidas en varios semestres) y las computa para el total de créditos únicamente cuando se han acreditado todas sus partes.
*   **Aprobación rápida de semestre completo:** Automatización opcional para completar semestres enteros con validaciones lógicas cruzadas de prerrequisitos obligatorios externos.
*   **Progreso de créditos en tiempo real:** Barra global de avance que expone dinámicamente la proporción de créditos aprobados respecto a las exigencias totales del plan de estudios.
*   **Selector de carrera:** Transiciones rápidas entre IMEC (Mecatrónica) e IBIO (Biomédica) manteniendo persistencias de estado aisladas de forma independiente.

### [2] Calculadora de notas (SCP)
*   **Estructuras de ponderación:** Módulo integrado para descifrar la nota final de curso según 12 esquemas tradicionales de Sistema de Calificación por Parciales (SCP), cada uno compuesto por diferentes componentes (Ev1, Ev2, Examen Final, Talleres, Participación).
*   **Proyección algorítmica:** Si el estudiante carece de una única calificación para cerrar el curso, el software calcula con precisión matemática el puntaje mínimo requerido en la evaluación restante para calificar en cada franja (Exonerado, Examen reglamentado, etc.).
*   **Clasificación normativa de resultados:** Ubicación automática del rendimiento del alumno de acuerdo a las ordenanzas académicas vigentes en UTEC.

### [3] Persistencia y compartibilidad
*   **Almacenamiento web seguro (`localStorage`):** Grabación continua de todos los avances y estados de las mallas, asegurando la permanencia de los datos en cierres o refrescos accidentales del navegador sin necesidad de autenticaciones previas.
*   **Anotaciones por ciclo:** Lienzos de comentarios y notas de texto libre dedicados al seguimiento personalizado dentro de cada bloque semestral.
*   **Enlace de transporte portable:** Generación instantánea de una URL con el estado estructurado del estudiante codificado en Base64 para respaldos externos, portabilidad o envíos rápidos de avance sin base de datos persistente obligatoria.
*   **Emisión de reportes en formato PDF:** Generación dinámica fuera de línea del boletín académico interactivo no oficial, estructurando porcentajes generales, tablas semestrales y firmas del estudiante haciendo uso de `jsPDF` y `jspdf-autotable`.

### [4] Métricas y conectividad inteligente (Firebase)
*   **Contador global de accesos:** Registro agregador en tiempo real de visitas a la plataforma.
*   **Métrica de usuarios concurrentes:** Monitor de concurrencia activo basado en un sistema de latidos (*presence heartbeat*) asincrónico por servidor cada 30 segundos con un filtro de expiración de sesiones cada 120 segundos.

### [5] Directrices de UI / UX
*   **Dualidad de apariencia:** Selector fluido entre modo claro y modo oscuro de forma persistente.
*   **Estética inspirada en interfaces HUD / Terminal:** Uso prioritario de fuentes monoespaciadas, tarjetas estructuradas, bordes discontinuos e indicadores simplificados con contrastes óptimos adecuados para largas jornadas de lectura.
*   **Mensaje de inducción introductorio:** Cartel explicativo de navegación rápida en el primer ingreso del usuario a la aplicación.
*   **Preservación de responsabilidad:** Declaración explícita sobre el rol de simulación no oficial de la herramienta, sin validez documental oficial.

---

## Vista general

La organización visual de la aplicación se distribuye en tres secciones principales:

*   **Bloque Superior: Encabezado**
    Presenta la titulación, con el selector dinámico del plan de estudios activo, visualizador rápido de usuarios concurrentes globales y accesos al cambio de apariencia general.
*   **Bloque Central: El Tablero Curricular**
    Diagramación cartesiana por columnas representando semestres consecutivos. Los nodos corresponden a las materias, las cuales reaccionan a clics y eventos de cursor (*hover*) destacando gráficamente en color naranja los prerrequisitos anteriores y en celeste las materias que habilita en su línea de progreso futuro.
*   **Bloque Flotante: Consola de Herramientas**
    Barra utilitaria de acceso inmediato para desplegar la calculadora SCP, consultar disponibilidad de materias y solicitar la exportación o codificación del estado activo de la carrera.

---

## Stack tecnológico

| Componente | Tecnología principal | Implementación / Rol |
| :--- | :--- | :--- |
| **Biblioteca de interfaz** | React 19 + TypeScript | Construcción de componentes, gestión de estados complejos y tipado estático robusto |
| **Estructuración y compilación** | Vite 6 | Empaquetado optimizado de activos, compilación modular rápida y servidor local de desarrollo |
| **Hoja de estilos** | Tailwind CSS 4 | Maquetación responsiva estilizada, variables nativas para control del tema visual claro/oscuro |
| **Motor de animaciones** | Motion | Animación de transiciones, despliegue de menús y paneles interactivos contextuales |
| **Iconografía técnica** | Lucide React | Recursos vectoriales escalables integrados sintácticamente |
| **Persistencia e indicadores** | Firebase Firestore + Auth | Manejo de lecturas/escrituras atómicas para métricas de visitas, presencias de red y autenticaciones de rol |
| **Generación de documentos** | jsPDF + jspdf-autotable | Formulación algorítmica matemática para maquetado de tablas y reporte portable descargable |
| **Procesamiento de imágenes** | html-to-image | Conversión estática instantánea de vistas para exportación y reportes visuales rápidos |

---

## Estructura del proyecto

```text
Malla-Interactiva/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Flujo automatizado de compilación y publicación
├── public/
│   ├── ibio_logo.jpg           # Material gráfico: Identificador de Ingeniería Biomédica
│   ├── imec_logo.jpg           # Material gráfico: Identificador de Ingeniería Mecatrónica
│   └── utec_logo.jpg           # Identidad institucional ITR
├── src/
│   ├── App.tsx                  # Lógica general e integraciones del tablero interactivo
│   ├── data.ts                  # Diccionarios de asignaturas, carreras oficiales y esquemas SCP
│   ├── types.ts                 # Contratos, interfaces tipadas y estructuras de datos estrictas
│   ├── firebase.ts              # Gestión de conexiones y captura del comportamiento de red del cliente
│   ├── index.css                # Estilo de interfaz, fuentes de sistema y variables de apariencia
│   ├── main.tsx                 # Instanciación y renderizado en el DOM web
│   └── vite-env.d.ts            # Definiciones globales para el compilador de TypeScript
├── firebase-applet-config.json  # Parametrización pública del cliente del servicio de base de datos
├── firebase-blueprint.json      # Esquemas estruturales lógicos de colecciones y registros
├── firestore.rules              # Políticas regulatorias de acceso del motor de base de datos
├── metadata.json                # Información de configuración del contenedor e iframe
├── index.html                   # HTML raíz del portal
├── vite.config.ts               # Parametrizaciones específicas del empaquetador de la SPA
├── package.json                 # Especificación de dependencias y scripts de automatización
└── tsconfig.json                # Reglas, límites y directivas del compilador de TypeScript
```

---

## Modelo de datos

Los parámetros contractuales más relevantes del sistema operativo se definen estrictamente en `src/types.ts`:

```typescript
export interface Materia {
  id: string;            // Código unívoco del curso (por ejemplo: "MAT1", "ELC2")
  n: string;             // Nombre semántico legible de la asignatura
  c: number;             // Volumen de asignación de créditos académicos en el plan
  a: string;             // Área o campo científico al que pertenece la materia
  reqCurso?: string[];   // Lista de identificadores que son obligatorios en estado de cursada
  reqExamen?: string[];  // Lista de identificadores mandatorios aprobados con examen finalizado
  anualId?: string;      // Identificador de emparejamiento para materias semestralmente segmentadas
}

export interface Semestre {
  sem: number;           // Índice numérico del semestre curricular
  materias: Materia[];   // Vector de cursos asociados a la división temporal
}

export interface SCPConfig {
  campos: string[];      // Componentes descriptivos evaluativos (por ejemplo: parciales, laboratorios)
  pesos: number[];       // Modificadores de peso porcentual para el cálculo final
}

export type MateriaEstado = 0 | 1 | 2; // Estados: 0 para Pendiente, 1 para Cursada, 2 para Aprobada
```

Las estructuras estáticas de apoyo que alimentan el visualizador residen en el archivo `src/data.ts` agrupadas bajo tres variables globales accesibles:
*   `nombresCarreras`: Mapas de títulos, subtítulos generales y archivos gráficos de logos representativos de cada opción de carrera.
*   `basesDeDatos`: Los planes de estudios oficiales estructurados por semestres cronológicos para las carreras disponibles.
*   `configuracionSCP`: Las plantillas de coeficientes asignados a las evaluaciones de cada asignatura del plan.

---

## Instalación y uso local

### Requisitos previos mínimos
*   Node.js versión 20 o superior instalada de forma global.
*   Gestor de paquetes npm (provisto por defecto con Node.js).

### Procedimiento paso a paso para el arranque

```bash
# 1. Clonar el repositorio oficial
git clone https://github.com/sofiamodernell/Malla-Interactiva.git
cd Malla-Interactiva

# 2. Instalar el árbol de dependencias
npm install

# 3. Levantar la aplicación en un entorno de desarrollo local
npm run dev
```

El servidor local pondrá a disposición la interfaz de visualización por defecto en la dirección: `http://localhost:3000`.

### Scripts operativos disponibles

| Comando de ejecución | Utilidad y descripción del proceso |
| :--- | :--- |
| `npm run dev` | Inicia el entorno de desarrollo local en tiempo real con recarga automatizada rápida |
| `npm run build` | Ejecuta la optimización y empaquetamiento estático nativo de la aplicación en la carpeta `dist/` |
| `npm run preview` | Levanta un servidor estático para pruebas previas de la build optimizada de producción |
| `npm run clean` | Purga las carpetas de compilación previas del espacio de trabajo |
| `npm run lint` | Valida el cumplimiento exhaustivo de TypeScript y la consistencia de tipos en el repositorio |

---

## Configuración de Firebase

La plataforma hereda un sistema de mensajería, visitas y estadísticas utilizando Google Firebase. La parametrización requerida se encuentra disponible de manera local en `firebase-applet-config.json` y se inicializa mediante la lectura del componente `src/firebase.ts`.

Si deseas configurar un servidor y base de datos propia para tu bifurcación del proyecto, realiza el siguiente curso de acción:

1.  Crea un nuevo proyecto en la [Consola de Firebase](https://console.firebase.google.com/).
2.  Habilita los servicios de **Cloud Firestore** y **Authentication** (configurando Google Sign-In como método de provisión).
3.  Modifica el archivo `firebase-applet-config.json` en tu directorio raíz ingresando las llaves correspondientes del cliente:

```json
{
  "projectId": "TU-PROYECTO-ID",
  "appId": "TU-APP-ID",
  "apiKey": "TU-API-KEY",
  "authDomain": "TU-PROYECTO.firebaseapp.com",
  "firestoreDatabaseId": "TU-DATABASE-ID",
  "storageBucket": "TU-PROYECTO.firebasestorage.app",
  "messagingSenderId": "TU-SENDER-ID",
  "measurementId": ""
}
```

4.  Despliega las definiciones presentes en `firestore.rules` al servidor Firebase para asegurar las rutas de datos para las estadísticas, registros y políticas administrativas.
5.  Puedes guiarte con las especificaciones estructuradas dentro de `firebase-blueprint.json` para esquematizar los documentos de colecciones secundarias requeridas.

---

## Despliegue

La aplicación se beneficia de integraciones continuas configuradas a través de GitHub Actions en `.github/workflows/deploy.yml`:

*   Cada cambio confirmado con un `push` en la rama de producción `main` inicia el ejecutor en la nube.
*   Este entorno virtual instala dependencias críticas, ejecuta `npm run build` y aloja de forma automatizada los archivos estáticos obtenidos en la rama respectiva para el servicio de GitHub Pages.

> Consistencia de Rueda: La base de compilación se encuentra mapeada en `vite.config.ts` bajo la variable `/Malla-Interactiva/`. Si decides alojar la aplicación con un nombre de subdirectorio o repositorio alternativo, actualiza dicho valor en las opciones del servidor de Vite de antemano.

---

## Cómo agregar o editar una carrera

Toda la definición curricular vive encapsulada de manera aislada en el archivo `src/data.ts`. No se necesita conocimiento en React o modificación estructural del componente principal en `App.tsx` para extender la plataforma:

1.  **Declaración identitaria en nombresCarreras:**  
    Agrega la firma e información inicial de la carrera:
    ```typescript
    "codigo_carrera_2026": {
      titulo: "NOMBRE_CARRERA_PLAN_2026",
      subtitulo: "DESCRIPCION_GENERAL // UTEC",
      logo: "nombre_recurso_grafico.jpg"
    }
    ```
2.  **Definición de asignaturas en basesDeDatos:**  
    Crea el arreglo de semestres (del 1 al 10 en su formato correspondiente) poblándolo con objetos conformes a la interfaz estricta de `Materia`.
3.  **Configuración evaluativa en configuracionSCP:**  
    En caso de emplear metodologías alternativas de calificación académica de curso, crea y asigna los nuevos arreglos de pesos evaluativos correspondientes.
4.  **Carga del logo representativo:**  
    Inserta el archivo gráfico correspondiente a la identificación de la carrera en el directorio público de activos `/public/`.

---

## Seguridad

*   **Acceso restringido de datos:** Las directrices en `firestore.rules` bloquean por definición los intentos de lectura y de escritura no declarados de forma predeterminada para cualquier origen que no coincida con colecciones públicas controladas, impidiendo alteraciones externas accidentales o intencionadas de los contadores e indicadores de red.
*   **Gestión por roles autorizados:** El despliegue de funcionalidades administrativas está restringido al nivel de validación de credenciales del emisor según su correo electrónico autorizado u ordenamiento en colecciones de administradores (`admins`).
*   **Políticas de privacidad en datos estudiantiles:** Ningún avance curricular o plan de notas de usuario es transmitido del navegador a servidores externos. Toda persistencia e historiales habitan estrictamente en el entorno aislado del dispositivo del estudiante (`localStorage`), salvo cuando el usuario decide de manera voluntaria presionar el botón de generación de enlace portable para transcribir su estatus como un enlace Base64 para guardarlo o compartirlo con terceros.

---

## Agradecimientos

Un agradecimiento y reconocimiento especial a los creadores de **Mallas Curriculares LabComp** de la Universidad Técnica Federico Santa María, cuyo impecable trabajo y diseño en su plataforma [mallas.labcomp.cl](https://mallas.labcomp.cl/) sirvió como una excelente referencia e inspiración para la concepción visual e interactiva de este proyecto. ¡Mucho respeto por su gran aporte a la comunidad estudiantil!

---

## Autoría

Desarrollado y diagramado de forma independiente por **Sofía Modernell**, estudiante de Ingeniería Mecatrónica en UTEC (ITR Suroeste, Fray Bentos, Uruguay).

---

## Aviso legal

La presente es una herramienta de simulación de carácter no oficial, desarrollada con fines puramente pedagógicos y de apoyo estudiantil autónomo. No cuenta con validez legal, administrativa ni vinculación formal con los sistemas regulatorios del portal de UTEC. Cualquier desvío de información frente a los boletines oficiales o reglamentos vigentes debe resolverse directamente con el área administrativa ] correspondiente de la institución.

---

## Licencia

Este proyecto no cuenta actualmente con una licencia explícitamente declarada. Si deseas utilizar, modificar, publicar o heredar parte del código fuente en otros fines académicos, te invitamos a adjuntar un archivo simple de licencia abierta (por ejemplo, Licencia MIT) o establecer contacto para mayor acuerdo de uso de activos.

---

