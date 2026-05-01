import { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Moon, Sun, Calculator, Search, RotateCcw } from 'lucide-react';
import { basesDeDatos, configuracionSCP } from './data';
import { Materia, Semestre, MateriaEstado } from './types';

export default function App() {
  const [carreraActual, setCarreraActual] = useState("imec_2023");
  const [estadoMaterias, setEstadoMaterias] = useState<Map<string, MateriaEstado>>(new Map());
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [materiaEnfocada, setMateriaEnfocada] = useState<Materia | null>(null);
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('bienvenida_vista') !== 'true');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDisponibles, setShowDisponibles] = useState(false);

  // Stats
  const plan = useMemo(() => basesDeDatos[carreraActual] || [], [carreraActual]);
  const todasLasMaterias = useMemo(() => plan.flatMap(s => s.materias), [plan]);
  const maxCreditos = useMemo(() => todasLasMaterias.reduce((acc, m) => acc + m.c, 0), [todasLasMaterias]);
  
  const totalCreditos = useMemo(() => {
    let count = 0;
    todasLasMaterias.forEach(m => {
      if (estadoMaterias.get(m.id) === 2) count += m.c;
    });
    return count;
  }, [todasLasMaterias, estadoMaterias]);

  const porcentaje = maxCreditos > 0 ? (totalCreditos / maxCreditos) * 100 : 0;

  // Persistent Storage
  useEffect(() => {
    const saved = localStorage.getItem('progreso_imec');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEstadoMaterias(new Map(parsed));
        }
      } catch (e) {
        console.error("Error loading progress", e);
        localStorage.removeItem('progreso_imec');
      }
    }
  }, []);

  useEffect(() => {
    if (estadoMaterias.size > 0) {
      localStorage.setItem('progreso_imec', JSON.stringify(Array.from(estadoMaterias.entries())));
    }
  }, [estadoMaterias]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Handlers
  const handleMateriaClick = (m: Materia) => {
    const currentStatus = estadoMaterias.get(m.id) || 0;
    
    // Check prerequisites
    const faltan: string[] = [];
    if (m.reqExamen) {
      m.reqExamen.forEach(id => {
        if (estadoMaterias.get(id) !== 2) faltan.push(`${id} (Aprobada)`);
      });
    }
    if (m.reqCurso) {
      m.reqCurso.forEach(id => {
        const s = estadoMaterias.get(id) || 0;
        if (s < 1) faltan.push(`${id} (Cursada)`);
      });
    }

    if (faltan.length > 0) {
      alert(`No podés rendir ${m.n}, debés cursar/aprobar:\n${faltan.join('\n')}`);
      return;
    }

    let nextStatus: MateriaEstado = 0;
    if (currentStatus === 0) nextStatus = 1;
    else if (currentStatus === 1) nextStatus = 2;
    else nextStatus = 0;

    const newMap = new Map(estadoMaterias);
    newMap.set(m.id, nextStatus);
    setEstadoMaterias(newMap);
  };

  const handleAprobarSemestre = (sem: Semestre) => {
    const isComplete = sem.materias.every(m => estadoMaterias.get(m.id) === 2);
    const newMap = new Map(estadoMaterias);
    
    if (isComplete) {
      sem.materias.forEach(m => newMap.set(m.id, 0));
    } else {
      // Logic to check if any subject in the semester is blocked by prerequisites
      const materiaIdsEnSemestre = new Set(sem.materias.map(m => m.id));
      const blockedMaterias = sem.materias.filter(m => {
        const failEx = m.reqExamen?.some(id => !materiaIdsEnSemestre.has(id) && estadoMaterias.get(id) !== 2);
        const failCur = m.reqCurso?.some(id => !materiaIdsEnSemestre.has(id) && (estadoMaterias.get(id) || 0) < 1);
        return failEx || failCur;
      });

      if (blockedMaterias.length > 0) {
        const names = blockedMaterias.map(m => m.n).join(', ');
        alert(`No podés marcar el semestre como aprobado porque las siguientes materias tienen previas pendientes: ${names}`);
        return;
      }

      sem.materias.forEach(m => newMap.set(m.id, 2));
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#007ea7', '#00a8e8', '#a8e6cf']
      });
    }
    setEstadoMaterias(newMap);
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres borrar todo tu progreso?")) {
      setEstadoMaterias(new Map());
      localStorage.removeItem('progreso_imec');
    }
  };

  // Highlighting Logic
  const highlightedReqs = useMemo(() => {
    if (!materiaEnfocada) return new Set<string>();
    return new Set([...(materiaEnfocada.reqCurso || []), ...(materiaEnfocada.reqExamen || [])]);
  }, [materiaEnfocada]);

  const highlightedPosts = useMemo(() => {
    if (!materiaEnfocada) return new Set<string>();
    return new Set(todasLasMaterias.filter(m => 
      (m.reqCurso && m.reqCurso.includes(materiaEnfocada.id)) || 
      (m.reqExamen && m.reqExamen.includes(materiaEnfocada.id))
    ).map(m => m.id));
  }, [materiaEnfocada, todasLasMaterias]);

  const materiasDisponibles = useMemo(() => {
    return todasLasMaterias.filter(mat => {
      if ((estadoMaterias.get(mat.id) || 0) > 0) return false;
      const cumpleExamen = !mat.reqExamen || mat.reqExamen.every(id => estadoMaterias.get(id) === 2);
      const cumpleCurso = !mat.reqCurso || mat.reqCurso.every(id => (estadoMaterias.get(id) || 0) >= 1);
      return cumpleExamen && cumpleCurso;
    });
  }, [todasLasMaterias, estadoMaterias]);

  return (
    <div className="min-h-screen">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="modal-fondo">
          <div className="modal-contenido">
            <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">SISTEMA_INICIALIZADO 🛠️</h2>
            <p className="mb-4 text-sm font-mono opacity-80">Cargando base de datos curricular Plan 2023...</p>
            <ul className="space-y-3 mb-6 text-sm">
              <li><strong>[!] PROTOCOLO_ENFOQUE:</strong> Hover para detectar dependencias (pre-requisitos y post-requisitos).</li>
              <li><strong>[!] MÓDULO_CÁLCULO:</strong> Herramienta de predicción de exoneración integrada.</li>
              <li><strong>[!] REGISTRO_PROGRESO:</strong> 1 click [CURSADA] // 2 clicks [APROBADA] // 3 clicks [RESET].</li>
            </ul>
            <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded text-[0.6rem] mb-6 font-mono">
              <p className="font-bold mb-1 uppercase tracking-widest text-[#00BFFF]">ADVERTENCIA_DE_SEGURIDAD:</p>
              <p>DOCUMENTACIÓN NO OFICIAL. REFERENCIA ACADÉMICA ÚNICAMENTE. VERIFICAR SIEMPRE CON BEDELÍA UTEC.</p>
            </div>
            <button 
              className="btn-theme w-full py-3"
              onClick={() => { setShowWelcome(false); localStorage.setItem('bienvenida_vista', 'true'); }}
            >
              EJECUTAR [ACCESO_PERMITIDO]
            </button>
          </div>
        </div>
      )}

      {/* Calculator Modal */}
      {showCalculator && <CalculatorModal onClose={() => setShowCalculator(false)} />}

      {/* Disponibles Modal */}
      {showDisponibles && (
        <div className="modal-fondo" onClick={() => setShowDisponibles(false)}>
          <div className="modal-contenido" onClick={e => e.stopPropagation()}>
            <h2>
              <Search size={22} />
              DIAGNÓSTICO_DE_DISPONIBILIDAD
            </h2>
            <p className="mb-6 text-sm opacity-60 font-mono">// MATERIAS_DESBLOQUEADAS_PARA_CURSADO_INMEDIATO</p>
            {materiasDisponibles.length === 0 ? (
              <div className="p-8 border border-dashed border-white/20 text-center opacity-40">
                NO SE DETECTARON NUEVAS MATERIAS DISPONIBLES.
              </div>
            ) : (
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
                {materiasDisponibles.map(m => (
                  <li key={m.id} className="p-3 border border-white/10 bg-white/5 flex justify-between items-center group hover:border-[var(--secondary)] transition-colors">
                    <div className="flex flex-col">
                      <span className="text-[var(--secondary)] font-bold text-xs">[{m.id}]</span>
                      <span className="text-sm font-bold uppercase">{m.n}</span>
                    </div>
                    <span className="text-[0.6rem] opacity-40 font-mono">{m.c}_CRED</span>
                  </li>
                ))}
              </ul>
            )}
            <button className="btn-theme w-full mt-8" onClick={() => setShowDisponibles(false)}>CERRAR_DIAGNÓSTICO</button>
          </div>
        </div>
      )}

      <Header />

      <main>
        <div className="controls">
          <button className="flex items-center gap-2 btn-theme" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            {isDarkMode ? 'CLARO' : 'OSCURO'}
          </button>
          
          <button className="flex items-center gap-2 btn-theme" onClick={() => setShowDisponibles(true)}>
            <Search size={14} />
            DIAGNÓSTICO_DISPONIBILIDAD
          </button>

          <button className="flex items-center gap-2 btn-theme" onClick={() => setShowCalculator(true)}>
            <Calculator size={14} />
            MÓDULO_CALCULADORA
          </button>

          <button className="flex items-center gap-2 btn-theme border-red-500 text-red-500 hover:bg-red-500 hover:text-white" onClick={handleReset}>
            <RotateCcw size={14} />
            RESET_SISTEMA
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[0.6rem] font-bold opacity-50 uppercase tracking-widest">PROYECTO:</span>
            <select value={carreraActual} onChange={(e) => setCarreraActual(e.target.value)}>
              <option value="imec_2023">IMEC_PLAN_2023</option>
            </select>
          </div>
        </div>

        <div className={`malla-wrapper ${materiaEnfocada ? 'dimming-active' : ''}`}>
          {plan.map((semestre) => (
            <div key={semestre.sem} className="semestre">
              <h3>Semestre {semestre.sem}</h3>
              <button 
                className={`btn-semestre ${semestre.materias.every((m: Materia) => estadoMaterias.get(m.id) === 2) ? 'completado' : ''}`}
                onClick={() => handleAprobarSemestre(semestre)}
              >
                {semestre.materias.every((m: Materia) => estadoMaterias.get(m.id) === 2) ? "Desmarcar Semestre" : "Aprobar Semestre ✓"}
              </button>
              
              <div className="space-y-4">
                {semestre.materias.map((m: Materia) => {
                  const status = estadoMaterias.get(m.id) || 0;
                  const isBlocked = (() => {
                    const failEx = m.reqExamen?.some((id: string) => estadoMaterias.get(id) !== 2);
                    const failCur = m.reqCurso?.some((id: string) => (estadoMaterias.get(id) || 0) < 1);
                    return failEx || failCur;
                  })();

                  return (
                    <MateriaCard 
                      key={m.id}
                      materia={m}
                      estado={status}
                      isBlocked={isBlocked}
                      isHighlighted={materiaEnfocada?.id === m.id}
                      isReq={highlightedReqs.has(m.id)}
                      isPost={highlightedPosts.has(m.id)}
                      onMouseEnter={() => setMateriaEnfocada(m)}
                      onMouseLeave={() => setMateriaEnfocada(null)}
                      onClick={() => handleMateriaClick(m)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="site-footer">
        <p className="mb-2"><strong>[!] DISCLAIMER:</strong> PROYECTO NO OFICIAL. DOCUMENTACIÓN TÉCNICA PARA REFERENCIA ESTUDIANTIL.</p>
        <p>IDENTIFICACIÓN ESTUDIANTE: <a href="mailto:sofia.modernell@estudiantes.utec.edu.uy" className="text-white hover:underline">sofia.modernell@estudiantes.utec.edu.uy</a></p>
      </footer>

      <div className="stats-bar">
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${porcentaje}%` }}></div>
        </div>
        <span className="font-bold flex items-center justify-center gap-2">
          Créditos: <span className="bg-white/20 px-2 py-0.5 rounded">{totalCreditos} / {maxCreditos}</span> ({porcentaje.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

function Header() {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return (
    <header className="overflow-hidden">
      <img src={`${baseUrl}utec_logo.jpg`} alt="UTEC" className="logo-container logo-utec" />
      <img src={`${baseUrl}imec_logo.jpg`} alt="IMEC" className="logo-container logo-imec" />

      <div className="header-content">
        <p className="mb-4">ENGINEERING DIAGRAM // SPEC_023</p>
        <h1 className="text-white">Malla Curricular</h1>
        <p className="text-white/60">INGENIERÍA_MECATRÓNICA // UTEC</p>
      </div>
    </header>
  );
}

interface MateriaCardProps {
  key?: string | number;
  materia: Materia;
  estado: number;
  isBlocked: boolean;
  isHighlighted: boolean;
  isReq: boolean;
  isPost: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function MateriaCard({ 
  materia, 
  estado, 
  isBlocked, 
  isHighlighted, 
  isReq, 
  isPost,
  onMouseEnter,
  onMouseLeave,
  onClick 
}: MateriaCardProps) {
  const classNames = [
    'materia',
    estado === 1 ? 'cursada' : '',
    estado === 2 ? 'aprobada' : '',
    isBlocked ? 'bloqueada' : '',
    isHighlighted ? 'highlight-self' : '',
    isReq ? 'highlight-req' : '',
    isPost ? 'highlight-post' : '',
  ].filter(Boolean).join(' ');

  return (
    <div 
      id={materia.id}
      className={classNames}
      data-area={materia.a}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      <span className="area-tag">{materia.a}</span>
      <span className="materia-name">{materia.n}</span>
      <div className="materia-info">
        <span>{materia.c} Créditos</span>
      </div>
    </div>
  );
}

function CalculatorModal({ onClose }: { onClose: () => void }) {
  const [scp, setScp] = useState("1");
  const config = configuracionSCP[scp];
  const [notas, setNotas] = useState<Record<number, string>>({});

  const handleNotaChange = (idx: number, val: string) => {
    setNotas(prev => ({ ...prev, [idx]: val }));
  };

  const calculation = useMemo(() => {
    let notaAcum = 0;
    let pesoAcum = 0;
    let pesoFaltante = 0;
    const faltantes: { name: string, peso: number }[] = [];

    config.campos.forEach((name, i) => {
      const val = parseFloat(notas[i] || "");
      const peso = config.pesos[i];
      if (!isNaN(val) && val >= 1 && val <= 5) {
        notaAcum += val * peso;
        pesoAcum += peso;
      } else {
        pesoFaltante += peso;
        faltantes.push({ name, peso });
      }
    });

    return { notaAcum, pesoAcum, pesoFaltante, faltantes };
  }, [scp, notas, config]);

  const esSinExamen = ["11", "12"].includes(scp);

  const getSituacion = (nf: number) => {
    if (nf >= 4.00) return { emoji: "🟢", texto: "EXONERA", type: "success" };
    if (nf >= 3.00) return { emoji: "🟡", texto: "EXAMEN REGLAMENTADO", type: "warning" };
    if (nf >= 2.00) return { emoji: "🟠", texto: "TUTORÍA + EXAMEN", type: "warning" };
    return { emoji: "🔴", texto: "RECURSAR O EXAMEN ÚNICO", type: "danger" };
  };

  return (
    <div className="modal-fondo">
      <div className="modal-contenido max-w-lg">
        <h2>
          <Calculator size={22} />
          CALCULADORA_DE_NOTAS
        </h2>

        <div className="mb-4">
          <label className="text-[0.6rem] font-bold mb-1 block opacity-60">SISTEMA_CALIFICACIÓN (SCP):</label>
          <select 
            className="w-full" 
            value={scp} 
            onChange={e => { setScp(e.target.value); setNotas({}); }}
          >
            {Object.keys(configuracionSCP).map(id => (
              <option key={id} value={id}>SCP_{id}: {configuracionSCP[id].campos.join(' + ')}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {config.campos.map((name, i) => (
            <div key={i} className="flex flex-col">
              <label className="text-[0.6rem] font-bold mb-1 opacity-60">{name}</label>
              <input 
                type="number" 
                step="0.01" 
                min="1" 
                max="5"
                className="p-2 border border-white/20 bg-black/20 font-mono text-sm outline-none focus:border-[var(--secondary)]"
                placeholder="0.00"
                value={notas[i] || ""}
                onChange={e => handleNotaChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-dashed border-white/10 pt-6">
          {calculation.faltantes.length === 0 ? (
            <ResultDisplay nf={calculation.notaAcum} sit={getSituacion(calculation.notaAcum)} isNoExamen={esSinExamen} />
          ) : calculation.faltantes.length === 1 ? (
            <PredictionDisplay 
              fId={calculation.faltantes[0].name} 
              fPeso={calculation.faltantes[0].peso} 
              notaAcum={calculation.notaAcum} 
              isNoExamen={esSinExamen} 
            />
          ) : (
            <div className="text-center opacity-40 py-4 italic text-sm">
              [!] INGRESAR MÁS DATOS PARA PROYECCIÓN FINAL
              <p className="text-xs mt-2 font-mono">POTENCIAL_MÁXIMO: {(calculation.notaAcum + 5 * calculation.pesoFaltante).toFixed(2)}</p>
            </div>
          )}
        </div>

        <button className="btn-theme w-full mt-6" onClick={onClose}>CERRAR_MÓDULO</button>
      </div>
    </div>
  );
}

function ResultDisplay({ nf, sit, isNoExamen }: { nf: number, sit: any, isNoExamen: boolean }) {
  const normNf = parseFloat(nf.toFixed(2));
  return (
    <div className={`result-box text-center ${sit.type}`}>
      <div className="font-bold text-xs mb-2 tracking-widest">{sit.emoji} {sit.texto}</div>
      <div className="text-5xl font-black mb-1">{normNf}</div>
      <div className="text-[0.6rem] opacity-70 tracking-tighter">CALIFICACIÓN_FINAL_CURSO</div>
      <div className="text-xs mt-4 font-mono opacity-90 max-w-[280px] mx-auto">
        {!isNoExamen && normNf >= 3 && normNf < 4 ? `// ADVERTENCIA: SE REQUIERE MIN_EXAMEN: ~${((3 - normNf * 0.7) / 0.3).toFixed(2)} PARA APROBACIÓN FINAL.` : ''}
      </div>
    </div>
  );
}

function PredictionDisplay({ fId, fPeso, notaAcum, isNoExamen }: { fId: string, fPeso: number, notaAcum: number, isNoExamen: boolean }) {
  const calc = (target: number) => {
    const res = (target - notaAcum) / fPeso;
    return res > 5 ? "N/A" : Math.max(1, res).toFixed(2);
  };
  
  return (
    <div className="text-xs font-mono">
      <p className="font-bold mb-4 opacity-70 uppercase tracking-widest">PROYECCIÓN_REQUERIMIENTO: [{fId}]</p>
      <div className="space-y-3">
        <div className="flex justify-between p-3 border border-[var(--success)]/20 bg-[var(--success)]/5 text-[var(--success)]">
          <span>// EXONERACIÓN (4.00)</span>
          <span className="font-black text-sm">{calc(4)}</span>
        </div>
        {!isNoExamen && (
          <>
            <div className="flex justify-between p-3 border border-[var(--cursada)]/20 bg-[var(--cursada)]/5 text-[var(--cursada)]">
              <span>// EXAMEN (3.00)</span>
              <span className="font-black text-sm">{calc(3)}</span>
            </div>
            <div className="flex justify-between p-3 border border-orange-500/20 bg-orange-500/5 text-orange-400">
              <span>// TUTORÍA (2.00)</span>
              <span className="font-black text-sm">{calc(2)}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
