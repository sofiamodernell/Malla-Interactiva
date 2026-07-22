import { Materia, Semestre } from './types';

export interface SemesterReq {
  semStart: number;
  semEnd: number;
}

/**
 * Parsea un string de prerrequisito que haga referencia a semestres.
 * Soporta formatos como:
 * - "SEM1", "SEM_1", "SEM:1" -> Semestre 1 completo
 * - "SEM1-5", "SEM_1_A_5", "SEM1_A_5", "SEM_1_5", "SEM1..5" -> Semestres 1 a 5 completos
 */
export function parseSemesterReq(reqId: string): SemesterReq | null {
  if (!reqId) return null;
  const trimmed = reqId.trim().toUpperCase();

  const match = trimmed.match(/^SEM(?:_|\:)?(\d+)(?:(?:_?A_?|-|_|\.\.)(\d+))?$/i);
  if (!match) return null;

  const semStart = parseInt(match[1], 10);
  const semEnd = match[2] ? parseInt(match[2], 10) : semStart;

  if (isNaN(semStart) || isNaN(semEnd)) return null;

  return {
    semStart: Math.min(semStart, semEnd),
    semEnd: Math.max(semStart, semEnd)
  };
}

/**
 * Resuelve una clave de requisito (id de materia, anualId, o token de semestre)
 * devolviendo las materias asociadas.
 */
export function resolveRequirementSubjects(
  reqId: string,
  plan: Semestre[],
  todasLasMaterias: Materia[]
): { isSemester: boolean; semReq: SemesterReq | null; subjects: Materia[] } {
  const semReq = parseSemesterReq(reqId);
  if (semReq) {
    const subjects = plan
      .filter(s => s.sem >= semReq.semStart && s.sem <= semReq.semEnd)
      .flatMap(s => s.materias);
    return { isSemester: true, semReq, subjects };
  }

  // Verificar si es un anualId
  const anualSubjects = todasLasMaterias.filter(m => m.anualId === reqId);
  if (anualSubjects.length > 0) {
    return { isSemester: false, semReq: null, subjects: anualSubjects };
  }

  // Id directo de materia
  const direct = todasLasMaterias.filter(m => m.id === reqId);
  return { isSemester: false, semReq: null, subjects: direct };
}

/**
 * Genera una etiqueta legible para un requerimiento de curso o examen no cumplido.
 */
export function formatReqLabel(
  reqId: string,
  type: 'curso' | 'examen',
  todasLasMaterias: Materia[]
): string {
  const semReq = parseSemesterReq(reqId);
  const verb = type === 'examen' ? 'Aprobado' : 'Cursado';

  if (semReq) {
    if (semReq.semStart === semReq.semEnd) {
      return `Semestre ${semReq.semStart} completo (${verb})`;
    }
    return `Semestres ${semReq.semStart} a ${semReq.semEnd} completos (${verb})`;
  }

  const found = todasLasMaterias.find(x => x.id === reqId || x.anualId === reqId);
  const verbMateria = type === 'examen' ? 'Aprobada' : 'Cursada';
  if (found) {
    return `${found.n} [${reqId}] (${verbMateria})`;
  }
  return `${reqId} (${verbMateria})`;
}
