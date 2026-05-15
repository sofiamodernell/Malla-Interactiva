import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Moon, Sun, Calculator, Search, RotateCcw, Share2, FileText, Printer, Link, Check, MessageSquare, Send, LogIn, LogOut, CheckCircle2, Trash2, X, StickyNote, Edit2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, where } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import { basesDeDatos, configuracionSCP } from './data';
import { Materia, Semestre, MateriaEstado, StudentTip } from './types';

// Extend jsPDF with autoTable type
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

export default function App() {
  const [carreraActual, setCarreraActual] = useState("imec_2023");
  const [estadoMaterias, setEstadoMaterias] = useState<Map<string, MateriaEstado>>(new Map());
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [materiaEnfocada, setMateriaEnfocada] = useState<Materia | null>(null);
  const [showWelcome, setShowWelcome] = useState(() => localStorage.getItem('bienvenida_vista') !== 'true');
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDisponibles, setShowDisponibles] = useState(false);
  const [showCommunityBoard, setShowCommunityBoard] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [adminClickCount, setAdminClickCount] = useState(0);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [notasSemestres, setNotasSemestres] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('notas_semestres');
    return saved ? JSON.parse(saved) : {};
  });
  const [semestreEditandoNota, setSemestreEditandoNota] = useState<number | null>(null);
  const [tempNota, setTempNota] = useState("");
  
  const mallaRef = useRef<HTMLDivElement>(null);

  const scrollToSemester = (index: number) => {
    if (mallaRef.current) {
      const semNodes = mallaRef.current.querySelectorAll('.semestre');
      if (semNodes[index]) {
        semNodes[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  };

  useEffect(() => {
    localStorage.setItem('notas_semestres', JSON.stringify(notasSemestres));
  }, [notasSemestres]);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  const handleTitleClick = () => {
    const nextCount = adminClickCount + 1;
    setAdminClickCount(nextCount);
    if (nextCount >= 5) {
      setShowLoginButton(true);
      setAdminClickCount(0);
    }
    // Auto-hide after 10 seconds if not logged in
    setTimeout(() => {
      if (!auth.currentUser) setShowLoginButton(false);
    }, 10000);
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const handleLogout = () => signOut(auth);

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

  const checkPrerrequisitos = (m: Materia) => {
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
    return faltan;
  };

  // Persistent Storage & Share Link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedData = params.get('data');
    
    if (sharedData) {
      try {
        const decoded = atob(sharedData);
        const [career, statesStr] = decoded.split('|');
        if (career && statesStr) {
          const states = JSON.parse(statesStr);
          setCarreraActual(career);
          setEstadoMaterias(new Map(states));
          // Clear URL after import to avoid re-importing on refresh if user changes stuff
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }
      } catch (e) {
        console.error("Error decoding shared link", e);
      }
    }

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
    const faltan = checkPrerrequisitos(m);

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

  const handleExportPDF = () => {
    setShowShareMenu(false);
    const nombre = prompt("Ingresá tu nombre para el reporte (opcional):") || "Estudiante";
    
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(40);
    doc.text("REPORTE NO OFICIAL DE AVANCE ACADÉMICO - IMEC", 14, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Carrera: ${carreraActual.toUpperCase()}`, 14, 30);
    doc.text(`Estudiante: ${nombre}`, 14, 35);
    doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 14, 40);
    
    // Stats Summary Table
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("RESUMEN GENERAL", 14, 50);

    const totalCreditosMalla = todasLasMaterias.reduce((acc, m) => acc + m.c, 0);
    const progresoPorcentaje = totalCreditosMalla > 0 ? (totalCreditos / totalCreditosMalla) * 100 : 0;

    autoTable(doc, {
      startY: 55,
      head: [['Métrica', 'Valor']],
      body: [
        ['Créditos Aprobados', totalCreditos.toString()],
        ['Créditos Totales Carrera', totalCreditosMalla.toString()],
        ['Porcentaje de Avance', `${progresoPorcentaje.toFixed(1)}%`],
        ['Estado Actual', totalCreditos >= totalCreditosMalla ? 'CARRERA COMPLETADA' : 'EN CURSO']
      ],
      theme: 'grid',
      headStyles: { fillColor: [60, 60, 60], textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 3 }
    });

    let currentY = (doc as any).lastAutoTable.finalY + 15;

    // Semester Details
    plan.forEach((semestre) => {
      // Check for page overflow
      if (currentY > 240) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(`SEMESTRE ${semestre.sem}`, 14, currentY);
      
      const tableData = semestre.materias.map(m => {
        const estado = estadoMaterias.get(m.id) || 0;
        const estadoTxt = estado === 2 ? 'APROBADA' : (estado === 1 ? 'CURSADA' : 'PENDIENTE');
        return [m.id, m.n, m.c.toString(), estadoTxt];
      });

      autoTable(doc, {
        startY: currentY + 4,
        head: [['CÓDIGO', 'MATERIA', 'CRÉDITOS', 'ESTADO']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [100, 100, 100], textColor: [255, 255, 255] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          2: { halign: 'center' },
          3: { fontStyle: 'bold' }
        },
        didDrawPage: (data) => {
          currentY = data.cursor?.y || currentY;
        }
      });

      currentY = (doc as any).lastAutoTable.finalY + 12;
    });

    // Final signature placeholder
    if (currentY > 260) { doc.addPage(); currentY = 20; }
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("----------------------------------------------------------------", 14, currentY + 10);
    doc.text("Firma del Estudiante", 14, currentY + 15);

    // Page numbers
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(`MALLA INTERACTIVA UTEC - Reporte Académico NO OFICIAL - Pag. ${i} de ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
    }

    doc.save(`avance_utec_${carreraActual}_${nombre.replace(/\s+/g, '_')}.pdf`);
  };

  const handleGenerateLink = () => {
    const dataStr = `${carreraActual}|${JSON.stringify(Array.from(estadoMaterias.entries()))}`;
    const encoded = btoa(dataStr);
    const url = `${window.location.origin}${window.location.pathname}?data=${encoded}`;
    
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres borrar todo tu progreso y notas?")) {
      setEstadoMaterias(new Map());
      setNotasSemestres({});
      localStorage.removeItem('progreso_imec');
      localStorage.removeItem('notas_semestres');
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
    <div className="app-container">
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
              <li><strong>[!] REPOSITORIO_TIPS:</strong> Dejá un tip para otros estudiantes! [tendrá que ser leído y aprobado antes de ser publicado oficialmente].</li>
            </ul>
            <div className="p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded text-[0.6rem] mb-6 font-mono">
              <p className="font-bold mb-1 uppercase tracking-widest text-[#00BFFF]">ADVERTENCIA_DE_SEGURIDAD:</p>
              <p className="mb-2">DOCUMENTACIÓN NO OFICIAL. REFERENCIA ACADÉMICA ÚNICAMENTE. VERIFICAR SIEMPRE PLAN DE ESTUDIOS.</p>
              <p className="opacity-70">Desarrollado por una estudiante para estudiantes :).</p>
              <p className="opacity-70">Contacto por feedback: <a href="mailto:sofia.modernell@estudiantes.utec.edu.uy" className="underline">sofia.modernell@estudiantes.utec.edu.uy</a></p>
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
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-4">
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

      {showCommunityBoard && (
        <div className="modal-fondo" onClick={() => setShowCommunityBoard(false)}>
          <div className="modal-contenido max-w-2xl h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">REPOSITORIO_DE_CONSEJOS</h2>
              <button 
                className="p-2 hover:bg-white/10 rounded transition-colors"
                onClick={() => setShowCommunityBoard(false)}
              >
                <X size={24} />
              </button>
            </div>
            <CommunityBoard />
            <button 
              className="btn-theme w-full mt-4 py-4" 
              onClick={() => setShowCommunityBoard(false)}
            >
              CERRAR_REPOSITORIO
            </button>
          </div>
        </div>
      )}

      <main>
        <div className="main-content-scroll custom-scrollbar">
          <div className="sticky-horizontal">
            <Header onTitleClick={handleTitleClick} />
            
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

              <button className="flex items-center gap-2 btn-theme" onClick={() => setShowCommunityBoard(true)}>
                <MessageSquare size={14} />
                REPOSITORIO_COMUNIDAD
              </button>

              <button className="flex items-center gap-2 btn-theme" onClick={handleReset}>
                <RotateCcw size={14} />
                RESET_SISTEMA
              </button>

              {user && (
                <button className="flex items-center gap-2 btn-theme border-green-500/50" onClick={handleLogout} title={user.email || ""}>
                  <LogOut size={14} />
                  SALIR [{user.displayName?.split(' ')[0].toUpperCase()}]
                </button>
              )}

              {!user && showLoginButton && (
                <button className="flex items-center gap-2 btn-theme animate-pulse border-[var(--primary)]" onClick={handleLogin}>
                  <LogIn size={14} />
                  ACCESO_ADMINISTRADOR
                </button>
              )}

              <div className="relative">
                <button className="flex items-center gap-2 btn-theme" onClick={() => setShowShareMenu(!showShareMenu)}>
                  <Share2 size={14} />
                  COMPARTIR / EXPORTAR
                </button>
                
                {showShareMenu && (
                  <div className="share-menu-dropdown">
                    <button className="share-menu-item" onClick={handleGenerateLink}>
                      {copied ? <Check size={14} className="text-green-400" /> : <Link size={14} />}
                      <span>{copied ? 'ENLACE_COPIADO' : 'COPIAR_ENLACE_PROGRESO'}</span>
                    </button>
                    <button className="share-menu-item" onClick={() => { setShowShareMenu(false); window.print(); }}>
                      <Printer size={14} />
                      <span>IMPRIMIR / GUARDAR_PDF</span>
                    </button>
                    <button className="share-menu-item" onClick={handleExportPDF}>
                      <FileText size={14} />
                      <span>DESCARGAR_PDF_DIRECTO</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] font-bold opacity-50 uppercase tracking-widest">PROYECTO:</span>
                <select value={carreraActual} onChange={(e) => setCarreraActual(e.target.value)}>
                  <option value="imec_2023">IMEC_PLAN_2023</option>
                </select>
              </div>
            </div>
          </div>

          <div ref={mallaRef} className={`malla-wrapper ${materiaEnfocada ? 'dimming-active' : ''}`}>
            {plan.map((semestre, index) => (
              <div key={semestre.sem} className="semestre">
                <div className="semestre-header">
                  <div className="flex justify-between items-start w-full mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex bg-white/5 rounded p-0.5 border border-white/5">
                        <button 
                          className={`p-0.5 rounded transition-colors ${index > 0 ? 'text-white/60 hover:text-[var(--primary)] hover:bg-white/10' : 'text-white/10 cursor-not-allowed'}`}
                          onClick={() => index > 0 && scrollToSemester(index - 1)}
                          disabled={index === 0}
                          title="Semestre anterior"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          className={`p-0.5 rounded transition-colors ${index < plan.length - 1 ? 'text-white/60 hover:text-[var(--primary)] hover:bg-white/10' : 'text-white/10 cursor-not-allowed'}`}
                          onClick={() => index < plan.length - 1 && scrollToSemester(index + 1)}
                          disabled={index === plan.length - 1}
                          title="Siguiente semestre"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                      <h3>Semestre {semestre.sem}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        className="p-1 hover:bg-white/10 rounded transition-colors text-white/50 hover:text-[var(--primary)]"
                        onClick={() => {
                          setSemestreEditandoNota(semestre.sem);
                          setTempNota(notasSemestres[semestre.sem] || "");
                        }}
                        title="Notas del semestre"
                      >
                        <StickyNote size={14} className={notasSemestres[semestre.sem] ? "text-[var(--primary)]" : ""} />
                      </button>
                    </div>
                  </div>

                  {notasSemestres[semestre.sem] && semestreEditandoNota !== semestre.sem && (
                    <div 
                      className="mb-3 p-2 bg-yellow-500/5 border-l-2 border-yellow-500/50 text-[0.65rem] italic text-yellow-200/60 rounded-r cursor-pointer hover:bg-yellow-500/10 transition-colors"
                      onClick={() => {
                        setSemestreEditandoNota(semestre.sem);
                        setTempNota(notasSemestres[semestre.sem] || "");
                      }}
                    >
                      <p className="line-clamp-3">{notasSemestres[semestre.sem]}</p>
                    </div>
                  )}

                  {semestreEditandoNota === semestre.sem && (
                    <div className="mb-3 space-y-2">
                      <textarea
                        className="w-full bg-black/40 border border-white/10 rounded p-2 text-[0.7rem] font-mono focus:outline-none focus:border-[var(--primary)] min-h-[80px]"
                        value={tempNota}
                        autoFocus
                        onChange={(e) => setTempNota(e.target.value)}
                        placeholder="Escribe una nota para este semestre..."
                      />
                      <div className="flex gap-2 justify-end">
                        <button 
                          className="flex items-center gap-1 text-[0.6rem] px-2 py-1 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded transition-colors border border-green-500/20"
                          onClick={() => {
                            setNotasSemestres(prev => ({ ...prev, [semestre.sem]: tempNota }));
                            setSemestreEditandoNota(null);
                          }}
                        >
                          <Save size={10} /> GUARDAR
                        </button>
                        <button 
                          className="flex items-center gap-1 text-[0.6rem] px-2 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors border border-white/10"
                          onClick={() => setSemestreEditandoNota(null)}
                        >
                          <X size={10} /> CANCELAR
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="semestre-summary">
                    <div className="summary-item">
                      <span className="label">MATERIAS:</span>
                      <span className="value">{semestre.materias.filter(m => estadoMaterias.get(m.id) === 2).length}/{semestre.materias.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">CRÉDITOS:</span>
                      <span className="value">
                        {semestre.materias.reduce((acc, m) => acc + (estadoMaterias.get(m.id) === 2 ? m.c : 0), 0)} / {semestre.materias.reduce((acc, m) => acc + m.c, 0)}
                      </span>
                    </div>
                  </div>
                </div>
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

          <footer className="site-footer">
            <p className="mb-2"><strong>[!] DISCLAIMER:</strong> PROYECTO NO OFICIAL. DOCUMENTACIÓN TÉCNICA PARA REFERENCIA ESTUDIANTIL.</p>
            <p>IDENTIFICACIÓN ESTUDIANTE: <a href="mailto:sofia.modernell@estudiantes.utec.edu.uy" className="text-white hover:underline">sofia.modernell@estudiantes.utec.edu.uy</a></p>
          </footer>
        </div>
      </main>

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

function Header({ onTitleClick }: { onTitleClick: () => void }) {
  const baseUrl = import.meta.env.BASE_URL || '/';
  return (
    <header className="overflow-hidden">
      <img src={`${baseUrl}utec_logo.jpg`} alt="UTEC" className="logo-container logo-utec" />
      <img src={`${baseUrl}imec_logo.jpg`} alt="IMEC" className="logo-container logo-imec" />

      <div className="header-content">
        <p className="mb-4">ENGINEERING DIAGRAM // SPEC_023</p>
        <h1 
          className="text-white cursor-default select-none" 
          onClick={onTitleClick}
        >
          Malla Curricular
        </h1>
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
  onClick,
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
      <div className="flex justify-between items-start">
        <span className="area-tag">{materia.a}</span>
      </div>
      <span className="materia-name">{materia.n}</span>
      <div className="materia-info">
        <span>{materia.c} Créditos</span>
      </div>
    </div>
  );
}

function CommunityBoard() {
  const [tips, setTips] = useState<StudentTip[]>([]);
  const [newTip, setNewTip] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const isAdmin = user?.email === 'sofaaa163@gmail.com';

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  useEffect(() => {
    let q;
    if (isAdmin) {
      q = query(
        collection(db, "tips"),
        orderBy("createdAt", "desc")
      );
    } else {
      q = query(
        collection(db, "tips"),
        where("approved", "==", true),
        orderBy("createdAt", "desc")
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tipsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as StudentTip[];
      setTips(tipsData);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "tips");
    });

    return () => unsubscribe();
  }, [isAdmin]);

  const handleAddTip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTip.trim() || !authorName.trim() || isSending) return;

    // Validate format name.lastname
    const nameRegex = /^[a-z]+\.[a-z]+$/;
    if (!nameRegex.test(authorName.toLowerCase())) {
      alert("El nombre debe tener el formato: nombre.apellido (en minúsculas)");
      return;
    }

    setIsSending(true);
    try {
      await addDoc(collection(db, "tips"), {
        content: newTip,
        author: authorName.toLowerCase(),
        approved: false,
        createdAt: serverTimestamp()
      });
      setNewTip("");
      alert("Consejo enviado. Pendiente de aprobación por el autorizador.");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "tips");
      alert("Error al enviar consejo. Intentá de nuevo.");
    } finally {
      setIsSending(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateDoc(doc(db, "tips", id), { approved: true });
    } catch (error) {
      console.error("Error approving tip:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Borrar este consejo?")) return;
    try {
      await deleteDoc(doc(db, "tips", id));
    } catch (error) {
      console.error("Error deleting tip:", error);
    }
  };

  return (
    <section className="bg-black/20 p-6 border border-white/5 rounded-lg flex flex-col h-full overflow-hidden">
      <h4 className="text-[0.6rem] font-bold text-[var(--primary)] mb-4 tracking-widest uppercase flex items-center gap-2">
        <MessageSquare size={12} />
        COMUNIDAD_MECATRÓNICA_TIPS
      </h4>
      
      <form onSubmit={handleAddTip} className="flex flex-col gap-2 mb-6">
        <input 
          type="text" 
          placeholder="nombre.apellido"
          className="bg-white/5 border border-white/10 p-2 text-[0.65rem] font-mono outline-none focus:border-[var(--primary)] transition-all"
          value={authorName}
          onChange={e => setAuthorName(e.target.value)}
        />
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Escribí un consejo para otros..."
            className="flex-1 bg-white/5 border border-white/10 p-3 text-xs font-mono outline-none focus:border-[var(--primary)] transition-all"
            value={newTip}
            onChange={e => setNewTip(e.target.value)}
            maxLength={200}
          />
          <button 
            type="submit" 
            className="px-4 bg-[var(--primary)] text-black hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center shrink-0"
            disabled={!newTip.trim() || !authorName.trim() || isSending}
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-[0.5rem] opacity-30 mt-1 uppercase tracking-widest">Su mensaje requerirá aprobación antes de ser visible.</p>
      </form>

      <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {tips.length === 0 ? (
          <p className="text-[0.6rem] opacity-30 italic text-center py-4 uppercase tracking-widest">
            {isAdmin ? "No hay consejos para moderar." : "Aún no hay consejos aprobados."}
          </p>
        ) : (
          tips.map(tip => (
            <div key={tip.id} className={`p-3 border-l-2 ${tip.approved ? 'border-[var(--primary)]/20' : 'border-yellow-500/40 bg-yellow-500/5'} bg-white/2 pb-1 relative group`}>
              {!tip.approved && isAdmin && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <button 
                    onClick={() => handleApprove(tip.id)}
                    className="p-1 bg-green-500/20 text-green-500 rounded hover:bg-green-500/40 transition-colors"
                    title="Aprobar"
                  >
                    <CheckCircle2 size={12} />
                  </button>
                  <button 
                    onClick={() => handleDelete(tip.id)}
                    className="p-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
              {tip.approved && isAdmin && (
                <button 
                  onClick={() => handleDelete(tip.id)}
                  className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 bg-red-500/20 text-red-500 rounded hover:bg-red-500/40 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 size={12} />
                </button>
              )}
              <p className="text-xs font-sans mb-1 pr-8">{tip.content}</p>
              <div className="flex justify-between items-center opacity-30 text-[0.5rem] font-mono">
                <span className={!tip.approved ? 'text-yellow-500 opacity-100 font-bold' : ''}>
                  {tip.author} {!tip.approved && '[PENDIENTE]'}
                </span>
                <span>{tip.createdAt?.toDate ? tip.createdAt.toDate().toLocaleDateString() : 'Pendiente...'}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
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

