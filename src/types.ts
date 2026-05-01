export interface Materia {
  id: string;
  n: string; // nombre
  c: number; // creditos
  a: string; // area
  reqCurso?: string[];
  reqExamen?: string[];
}

export interface Semestre {
  sem: number;
  materias: Materia[];
}

export interface SCPConfig {
  campos: string[];
  pesos: number[];
}

export type MateriaEstado = 0 | 1 | 2; // 0: nada, 1: cursada, 2: aprobada
