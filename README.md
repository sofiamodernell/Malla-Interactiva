# Malla-Interactiva

¡Bienvenido/a al repositorio de la **Malla Interactiva UTEC**!  
Esta es una herramienta virtual e interactiva desarrollada para asistir a los estudiantes en el seguimiento autónomo de su trayectoria académica. Actualmente cuenta con soporte detallado para **Ingeniería Mecatrónica (Plan 2023)** e **Ingeniería Biomédica (Plan 2021)**, pero está diseñada para ser completamente adaptable y escalable.

---

##  Especificaciones y Características

La aplicación ofrece un conjunto de herramientas de planificación académica pensadas para simplificar el proceso de inscripción y control curricular:

*   ** Control de Estados de Asignaturas (Protocolo de Clics):**
    Cada materia de la malla varía cíclicamente su estado con simples clics:
    *   `Pendiente (Sin cursar)` ➔ `Cursada (Cursó pero no aprobó examen)` ➔ `Aprobada (Acreditada con créditos correspondientes)`.
*   ** Enfoque Dinámico de Prerrequisitos:**
    Al pasar el cursor (hover) sobre cualquier asignatura se activa la focalización visual instantánea:
    *   **Naranja (Prerrequisitos):** Las asignaturas obligatorias previas necesarias.
    *   **Celeste (Postrequisitos):** Las asignaturas futuras que se desbloquearán gracias a este curso.
*   ** Diagnóstico de Disponibilidad en Tiempo Real:**
    Un algoritmo filtra tu avance curricular actual e identifica al instante qué asignaturas de semestres posteriores están completamente libres de previas y listas para inscribirse.
*   ** Calculadora de Notas SCP:**
    Permite proyectar el puntaje final de cursado y exámenes según los ponderadores y coeficientes específicos de la materia en evaluación.
*   ** Exportación de Reporte Académico en PDF:**
    Generación automática de un reporte analítico detallado del progreso por semestre con firma de estudiante para planificación interna no oficial.
*   ** Sincronización e Intercambio por Enlace:**
    Posibilidad de codificar todo tu progreso actual en una cadena base64 en la URL para compartir o respaldar tu avance con un solo clic.
*   ** Persistencia Local:**
    Los estados seleccionados y las notas se guardan de forma automática en el navegador utilizando `localStorage`, evitando la pérdida de información al refrescar la página.

---

## ¿Cómo funciona la cosa?

La lógica del sistema y el catálogo de las mallas académicas se estructuran de forma modular desvinculando la interfaz visual de las mallas.

### Formato de Materias en `src/data.ts`
El corazón de la malla radica en el archivo `src/data.ts`. Cada plan de estudio se define como un arreglo de semestres en `basesDeDatos`, donde cada semestre contiene asignaturas bajo el siguiente formato tipado:

```typescript
export interface Materia {
  id: string;          // Código identificador único (ej: "PRG1")
  n: string;           // Nombre descriptivo legible (ej: "Programación 1")
  c: number;           // Cantidad de créditos asignados
  a: string;           // Área de conocimiento (ej: "Informática", "Mecánica")
  reqCurso?: string[]; // Prerrequisitos de cursada (códigos de materia)
  reqExamen?: string[];// Prerrequisitos de examen aprobado (códigos de materia)
  anualId?: string;    // ID para agrupar materias de carácter anual si aplica
}
```

### Flujo de Validación de Previas
*   No puedes marcar una asignatura como *Cursada* o *Aprobada* si los prerrequisitos respectivos no están cumplidos según la regla:
    *   `reqCurso` exige que la materia previa haya sido al menos **Cursada** (Estado $\ge 1$).
    *   `reqExamen` exige que la materia previa esté **Aprobada** (Estado $= 2$).
*   **Aprobación Rápida de Semestre:** Es posible autocompletar semestres completos. El sistema validará si alguna materia intermedia tiene alguna previa externa pendiente para resguardar la consistencia académica.

---

## Adaptabilidad a otros ITRs y Sedes

Uno de los mayores fuertes de esta plataforma es su capacidad de escala. UTEC cuenta con diversos **ITRs (Institutos Tecnológicos Regionales)**:
*   ITR Centro-Sur
*   ITR Suroeste
*   ITR Norte 
*   ITR Este 

Cualquier estudiante, docente o colaborador de otra sede o carrera de la universidad puede adaptar el mapa de materias sin necesidad de saber programar interfaces complejas:

1.  Abre el archivo `src/data.ts`.
2.  Agrega el identificador y nombres de la carrera en el objeto `nombresCarreras`.
3.  Establece el mapa de semestres en el objeto `basesDeDatos` usando los códigos respectivos de su plan.
4.  ¡Listo! La interfaz autodetectará la nueva carrera, adaptará el panel horizontal, el selector superior, las estadísticas del contador de créditos, el diagnóstico de disponibilidad y el reporte PDF instantáneamente sin necesidad de tocar `App.tsx`.

---

##¡Súmate a Colaborar!

Este proyecto es de código abierto y busca ser una herramienta de apoyo impulsada por la comunidad estudiantil. La colaboración mantiene la herramienta actualizada ante modificaciones de planes de estudios y añade nuevas funcionalidades valoradas por todos.

**¿De qué maneras puedes colaborar?**
*   Corrigiendo errores tipográficos en nombres de materias o requisitos de previas.
*   Agregando los planes de estudio completos de tu carrera.
*   Diseñando nuevas funciones para el planificador.
*   Proponiendo mejoras de diseño responsivo o accesibilidad.

---

## ¿Quieres que tu carrera sea parte?

Si prefieres que tu carrera e ITR figuren en la grilla oficial de la aplicación pero no tienes tiempo de codificar o no te sientes cómodo/a editando el código, **¡no te preocupes!**  

Puedes contactarme directamente para facilitarme la grilla de previas y el plan de estudio oficial, y yo me encargaré de diagramarlo e incorporarlo a la plataforma:

*   **📧 Contacto directo:** [sofia.modernell@estudiantes.utec.edu.uy](mailto:sofia.modernell@estudiantes.utec.edu.uy)

---
