import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';

import { Moon, Sun, Calculator, Search, RotateCcw, Share2, FileText, Link, Check, MessageSquare,MessageCircleQuestionMark ,  Send, LogIn, LogOut, CheckCircle2, Trash2, X, StickyNote, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, updateDoc, doc, deleteDoc, where, increment, getDoc, setDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType, auth } from './firebase';
import { basesDeDatos, configuracionSCP, nombresCarreras } from './data';
import { Materia, Semestre, MateriaEstado } from './types';

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
    const [welcomeStep, setWelcomeStep] = useState(1);
  const [mockMateriaEstado, setMockMateriaEstado] = useState<number>(0);
  const [mockFocusId, setMockFocusId] = useState<string | null>(null);
  
  const [showCalculator, setShowCalculator] = useState(false);
  const [showDisponibles, setShowDisponibles] = useState(false);
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
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [liveUsers, setLiveUsers] = useState(0);
  
  const mallaRef = useRef<HTMLDivElement>(null);

  const scrollToSemester = (index: number) => {
    if (mallaRef.current) {
      const semNodes = mallaRef.current.querySelectorAll('.semestre');
      if (semNodes[index]) {
        semNodes[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    }
  };

    // Load notes when career changes
  useEffect(() => {
    const saved = localStorage.getItem(`notas_semestres_${carreraActual}`);
    setNotasSemestres(saved ? JSON.parse(saved) : {});
  }, [carreraActual]);

  // Save notes when they change
  useEffect(() => {
    if (Object.keys(notasSemestres).length > 0) {
      localStorage.setItem(`notas_semestres_${carreraActual}`, JSON.stringify(notasSemestres));
    }
  }, [notasSemestres, carreraActual]);
  
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Visit Counter & Presence
  useEffect(() => {
    const sessionId = sessionStorage.getItem('presence_session_id') || Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('presence_session_id', sessionId);

    // 1. Visit Counter
    const incrementVisits = async () => {
      const countersRef = doc(db, 'stats', 'counters');
      try {
        const snap = await getDoc(countersRef);
        if (!snap.exists()) {
          // Initialize if it doesn't exist (Admin might need to do this first or rules might need to allow create)
          // For now we assume it exists or we try to set it.
          // Note: My rules for stats only allow update. I should probably add an initialization if I can't guarantee existence.
          // But I'll try to update first.
          await setDoc(countersRef, { totalVisits: 1 }, { merge: true });
        } else {
          await updateDoc(countersRef, { totalVisits: increment(1) });
        }
      } catch (err) {
        console.warn("Could not increment visits:", err);
      }
    };

    incrementVisits();

    const unsubscribeVisits = onSnapshot(doc(db, 'stats', 'counters'), (snap) => {
      if (snap.exists()) {
        setTotalVisits(snap.data().totalVisits);
      }
    });

    // 2. Presence Heartbeat
    const presenceRef = doc(db, 'presence', sessionId);
    const updatePresence = async () => {
      try {
        await setDoc(presenceRef, { lastSeen: serverTimestamp() });
      } catch (err) {
        console.warn("Presence update failed:", err);
      }
    };

    updatePresence();
    const interval = setInterval(updatePresence, 30000); // 30s heartbeat

    // 3. Live Users Count
    const oneMinuteAgo = new Date(Date.now() - 60000);
    const qPresence = query(collection(db, 'presence'), where('lastSeen', '>=', oneMinuteAgo));
    
    const unsubscribePresence = onSnapshot(qPresence, (snap) => {
      // Filter client-side as well to be sure we only count truly active ones
      const now = Date.now();
      const activeCount = snap.docs.filter(doc => {
        const data = doc.data();
        if (!data.lastSeen) return false;
        const lastSeen = data.lastSeen.toDate?.()?.getTime() || 0;
        return (now - lastSeen) < 120000; // 2 minutes threshold
      }).length;
      setLiveUsers(activeCount || 1); // At least 1 (me)
    }, (error) => {
      console.warn("Presence snapshot failed:", error);
    });

    return () => {
      incrementVisits(); // Not really needed on cleanup but placeholder
      clearInterval(interval);
      unsubscribeVisits();
      unsubscribePresence();
    };
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
  const infoCarrera = useMemo(() => nombresCarreras[carreraActual] || { titulo: "UTEC", subtitulo: "" }, [carreraActual]);
  const todasLasMaterias = useMemo(() => plan.flatMap(s => s.materias), [plan]);

  const isMateriaCompletada = useCallback((m: Materia) => {
    if (estadoMaterias.get(m.id) !== 2) return false;
    if (m.anualId) {
      const g = todasLasMaterias.filter(x => x.anualId === m.anualId);
      return g.every(x => estadoMaterias.get(x.id) === 2);
    }
    return true;
  }, [estadoMaterias, todasLasMaterias]);
  
  const maxCreditos = useMemo(() => todasLasMaterias.reduce((acc, m) => acc + m.c, 0), [todasLasMaterias]);
  
  const totalCreditos = useMemo(() => {
    let count = 0;
    
    // Agrupamos las materias anuales para verificar si están completas
    const anualGroups = new Map<string, { materias: Materia[], todasAprobadas: boolean }>();
    
    todasLasMaterias.forEach(m => {
      if (m.anualId) {
        if (!anualGroups.has(m.anualId)) {
          anualGroups.set(m.anualId, { materias: [], todasAprobadas: true });
        }
        const group = anualGroups.get(m.anualId)!;
        group.materias.push(m);
        if (estadoMaterias.get(m.id) !== 2) {
          group.todasAprobadas = false;
        }
      } else {
      if (estadoMaterias.get(m.id) === 2) count += m.c;
      }
    });

    // Sumamos grupos anuales solo si están completos
    anualGroups.forEach(group => {
      if (group.todasAprobadas) {
        group.materias.forEach(m => count += m.c);
      }
    });
    
    return count;
  }, [todasLasMaterias, estadoMaterias]);

  const porcentaje = maxCreditos > 0 ? (totalCreditos / maxCreditos) * 100 : 0;

  const isRequisitoCumplido = useCallback((targetId: string, type: 'curso' | 'examen') => {
    // Check if it's a direct subject ID
    const directState = estadoMaterias.get(targetId);
    if (directState !== undefined) {
      return type === 'examen' ? directState === 2 : directState >= 1;
    }

    // Check if it's an anualId
    const subjectsInGroup = todasLasMaterias.filter(m => m.anualId === targetId);
    if (subjectsInGroup.length > 0) {
      if (type === 'examen') {
        return subjectsInGroup.every(m => estadoMaterias.get(m.id) === 2);
      } else {
        return subjectsInGroup.every(m => (estadoMaterias.get(m.id) || 0) >= 1);
      }
    }

    return false;
  }, [estadoMaterias, todasLasMaterias]);
  
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

    const saved = localStorage.getItem(`progreso_${carreraActual}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setEstadoMaterias(new Map(parsed));
        }
      } catch (e) {
        console.error("Error loading progress", e);
        localStorage.removeItem(`progreso_${carreraActual}`);
      }
    }
  }, []);

  useEffect(() => {
    if (estadoMaterias.size > 0) {
      localStorage.setItem(`progreso_${carreraActual}`, JSON.stringify(Array.from(estadoMaterias.entries())));
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
        const failEx = m.reqExamen?.some(id => !materiaIdsEnSemestre.has(id) && !isRequisitoCumplido(id, 'examen'));
        const failCur = m.reqCurso?.some(id => !materiaIdsEnSemestre.has(id) && !isRequisitoCumplido(id, 'curso'));
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
    doc.text("REPORTE DE AVANCE ACADÉMICO NO OFICIAL", 14, 22);
    
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
        doc.text(`MALLA CURRICULAR INTERACTIVA IMEC - Reporte Académico NO OFICIAL! - Pag. ${i} de ${totalPages}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
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
      localStorage.removeItem(`progreso_${carreraActual}`);
      localStorage.removeItem(`notas_semestres_${carreraActual}`);
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
      const cumpleExamen = !mat.reqExamen || mat.reqExamen.every(id => isRequisitoCumplido(id, 'examen'));
      const cumpleCurso = !mat.reqCurso || mat.reqCurso.every(id => isRequisitoCumplido(id, 'curso'));
      return cumpleExamen && cumpleCurso;
    });
  }, [todasLasMaterias, estadoMaterias, isRequisitoCumplido]);

  return (
    <div className="app-container">
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-fondo select-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="modal-contenido max-w-2xl"
            >
              {/* Header with Step Tracker */}
              <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4 font-mono">
                <span className="text-xs text-[var(--secondary)] font-bold tracking-widest">// ASISTENTE_INDUCCIÓN: PASO_0{welcomeStep}_DE_05</span>
                <button 
                  className="text-[0.65rem] opacity-60 hover:opacity-100 hover:text-red-400 bg-white/5 border border-white/10 px-2 py-1 rounded transition-colors"
                  onClick={() => { setShowWelcome(false); localStorage.setItem('bienvenida_vista', 'true'); }}
                >
                  SALTAR_INTRO [X]
                </button>
              </div>

              {/* Step content */}
              {welcomeStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[var(--primary)] m-0 border-0 p-0 flex items-center gap-2">
                    BIENVENIDO/A AL SISTEMA IMEC 🎓
                  </h2>
                  <p className="text-sm leading-relaxed mb-4">
                    Este entorno virtual interactivo ha sido desarrollado para asistirte en la visualización de tu trayectoria en <strong>Ingeniería Mecatrónica</strong> (otras carreras próximamente!) en la UTEC.
                  </p>
                  <p className="text-xs text-[var(--secondary)] font-mono uppercase tracking-wider">
                    // ESPECIFICACIONES:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-black/20 p-4 border border-white/5 rounded">
                    <div>
                      <strong className="text-yellow-400 font-bold">[!]</strong> Guardado Local Automático.
                    </div>
                    <div>
                      <strong className="text-yellow-400 font-bold">[!]</strong> Modo Claro y Oscuro.
                    </div>
                    <div>
                      <strong className="text-yellow-400 font-bold">[!]</strong> Generación de Reportes en PDF.
                    </div>
                    <div>
                      <strong className="text-yellow-400 font-bold">[!]</strong> Sincronización en la Nube.
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed opacity-70">
                    Acompañanos en esta breve guía de 4 pasos para dominar los protocolos, requerimientos y análisis predictivo integrados en la malla.
                  </p>
                </div>
              )}

              {welcomeStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[var(--primary)] m-0 border-0 p-0">
                    02_PROTOCOLO_CLICS (ESTADOS)
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Las asignaturas de la malla cambian su estado académico secuencialmente al hacerles clic. <strong>Hacé clic en la tarjeta piloto de abajo</strong> para experimentar la transición real del estado:
                  </p>

                  {/* Simulated Card Sandbox */}
                  <div className="py-6 flex flex-col items-center justify-center bg-black/25 border border-white/5 rounded relative">
                    <span className="text-[0.5rem] absolute top-2 left-3 opacity-30 font-mono tracking-widest font-bold">SIMULADOR_INTERACTIVO</span>
                    
                    <div 
                      className={`materia cursor-pointer select-none transition-all ${
                        mockMateriaEstado === 1 ? 'cursada scale-102 shadow-[0_0_12px_rgba(255,215,0,0.15)]' : ''
                      } ${
                        mockMateriaEstado === 2 ? 'aprobada scale-102 shadow-[0_0_12px_rgba(0,255,150,0.15)]' : ''
                      }`}
                      onClick={() => setMockMateriaEstado(prev => (prev + 1) % 3)}
                      style={{ transform: 'scale(1.05)' }}
                    >
                      <div className="flex justify-between items-start">
                        <span className="area-tag text-[0.55rem] font-bold">[PILOTO]</span>
                        {mockMateriaEstado === 1 && (
                          <span className="text-[0.45rem] font-bold uppercase text-[var(--cursada)] animate-pulse tracking-tight">STATUS: IN_PROGRESS</span>
                        )}
                        {mockMateriaEstado === 2 && (
                          <span className="text-[0.45rem] font-bold uppercase text-green-400 animate-pulse tracking-tight">STATUS: OK_PASSED</span>
                        )}
                      </div>
                      <span className="materia-name block font-bold text-center my-4 tracking-wide text-sm">FÍSICA I</span>
                      <div className="materia-info">
                        <span>6 CRÉDITOS</span>
                        {mockMateriaEstado === 2 && (
                          <span className="text-[0.45rem] text-green-400 font-bold tracking-tighter">[APROBADO]</span>
                        )}
                      </div>
                    </div>

                    {/* Console Log Simulator */}
                    <div className="w-11/12 mt-6 bg-black/60 border border-white/10 rounded p-3 font-mono text-[0.65rem] text-green-400 space-y-1">
                      <p className="text-white/40 border-b border-white/10 pb-1 uppercase tracking-widest">// REGISTRO_ACADÉMICO_OUT_V2.1</p>
                      {mockMateriaEstado === 0 && (
                        <>
                          <p className="text-cyan-400">{`> ESTADO_ACTUAL: [0] PENDIENTE`}</p>
                          <p>{`> La materia no ha sido cursada. Está habilitada esperando interacción.`}</p>
                        </>
                      )}
                      {mockMateriaEstado === 1 && (
                        <>
                          <p className="text-yellow-400">{`> ESTADO_ACTUAL: [1] CURSADA`}</p>
                          <p>{`> El estudiante asistió al curso pero aún no aprobó el examen final.`}</p>
                        </>
                      )}
                      {mockMateriaEstado === 2 && (
                        <>
                          <p className="text-emerald-400">{`> ESTADO_ACTUAL: [2] APROBADA ✓`}</p>
                          <p>{`> La materia está aprobada. ¡Sumás +5 créditos al contador total!`}</p>
                        </>
                      )}
                      <p className="text-white/20 animate-pulse">{`> [!] Hacé clic en la tarjeta de arriba para cambiar de estado...`}</p>
                    </div>
                  </div>
                </div>
              )}

              {welcomeStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[var(--primary)] m-0 border-0 p-0">
                    03_PROTOCOLO_ENFOQUE (REQUERIMIENTOS)
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Las asignaturas pueden tener requisitos o co-requisitos. Al <strong>pasar el cursor (hover)</strong> por encima de una materia, el sistema colorea automáticamente los recorridos de avance para evitar confusiones de inscripción:
                  </p>

                  <div className="p-4 bg-black/20 border border-white/5 rounded space-y-4">
                    <p className="text-[0.6rem] font-mono opacity-50 uppercase tracking-widest text-center">// SIMULACIÓN DE DETECCIÓN EN CADENA (HOVER/FOCALIZACIÓN)</p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-around items-center pt-2 pb-2">
                      {/* Course A (Prerequisito) */}
                      <div 
                        className={`p-3 border rounded text-xs text-center font-mono w-40 transition-all ${
                          mockFocusId === 'mat2' 
                            ? 'border-orange-500/80 bg-orange-500/10 text-orange-400 scale-95 opacity-90 shadow-[0_0_10px_rgba(255,87,34,0.1)] font-bold' 
                            : 'border-white/10 bg-white/5 opacity-70'
                        }`}
                      >
                        <span className="text-[0.5rem] block opacity-40">// PRERREQUISITO</span>
                        <strong className="block font-bold">MATEMÁTICA I</strong>
                        <span className="text-[0.5rem] text-orange-400/80 font-bold block mt-1 tracking-widest">REQUISITO_OBLIGATORIO</span>
                      </div>

                      <div className="text-white/30 font-bold text-center select-none rotate-90 sm:rotate-0">➔</div>

                      {/* Course B (Focused Course) */}
                      <div 
                        className={`p-3 border rounded text-xs text-center font-mono w-44 transition-all cursor-crosshair ${
                          mockFocusId === 'mat2' 
                            ? 'border-[var(--primary)] bg-white/10 scale-105 shadow-[0_0_15px_rgba(255,255,255,0.15)] font-bold' 
                            : 'border-white/20 bg-white/5'
                        }`}
                        onMouseEnter={() => setMockFocusId('mat2')}
                        onMouseLeave={() => setMockFocusId(null)}
                      >
                        <span className="text-[0.5rem] block text-[var(--secondary)] font-bold">// HOVER_FOCALIZADO</span>
                        <strong className="block font-bold animate-pulse">MATEMÁTICA II</strong>
                        <span className="text-[0.45rem] opacity-70 block mt-1 text-cyan-300">== COLOCÁ EL MOUSE ACÁ ==</span>
                      </div>

                      <div className="text-white/30 font-bold text-center select-none rotate-90 sm:rotate-0">➔</div>

                      {/* Course C (Postrequisite) */}
                      <div 
                        className={`p-3 border rounded text-xs text-center font-mono w-40 transition-all ${
                          mockFocusId === 'mat2' 
                            ? 'border-[var(--secondary)]/80 bg-[var(--secondary)]/10 text-[var(--secondary)] scale-95 opacity-90 shadow-[0_0_10px_rgba(0,191,255,0.1)] font-bold' 
                            : 'border-white/10 bg-white/5 opacity-70'
                        }`}
                      >
                        <span className="text-[0.5rem] block opacity-40">// POSTREQUISITO</span>
                        <strong className="block font-bold">MATEMÁTICA III</strong>
                        <span className="text-[0.5rem] text-[var(--secondary)] font-bold block mt-1 tracking-widest">DESBLOQUEO_POSTERIOR</span>
                      </div>
                    </div>

                    <div className="bg-black/40 p-3 rounded text-[0.65rem] font-mono leading-relaxed space-y-1">
                      <div className="flex gap-2">
                        <span className="text-orange-500 font-bold">[!] COLOR_NARANJA:</span>
                        <span>Asignatura previa. Debe estar aprobada o cursada para poder rendir/cursar Matemática II.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-[var(--secondary)] font-bold">[!] COLOR_CELESTE:</span>
                        <span>Asignatura consecuente. Se requiere Matemática II aprobada para poder habilitarla.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {welcomeStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[var(--primary)] m-0 border-0 p-0 flex items-center gap-2">
                    04_HERRAMIENTAS_INTEGRADAS ⚙️
                  </h2>
                  <p className="text-sm leading-relaxed">
                    Además de la vista diagramática principal, contás con utilidades integradas de alto nivel accesibles en la barra superior:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-4 bg-black/20 border border-white/10 rounded font-mono text-center space-y-2">
                      <div className="flex justify-center text-[var(--secondary)]"><Calculator size={20} /></div>
                      <span className="text-[0.65rem] font-bold block text-[var(--primary)]">SISTEMA CÁLCULO</span>
                      <p className="text-[0.55rem] opacity-65 leading-normal">
                        Calculadora de notas según SCP. Calculá exactamente qué notas de examen o laboratorios necesitás para exonerar tus cursos.
                      </p>
                    </div>

                    <div className="p-4 bg-black/20 border border-white/10 rounded font-mono text-center space-y-2">
                      <div className="flex justify-center text-green-400"><Search size={20} /></div>
                      <span className="text-[0.65rem] font-bold block text-[var(--primary)]">DIAGNÓSTICO RÁPIDO</span>
                      <p className="text-[0.55rem] opacity-65 leading-normal">
                        Algoritmo que filtra tu avance curricular en tiempo real y te entrega una checklist con todas las materias habilitadas para cursar inmediatamente.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-black/20 border border-white/10 rounded font-mono text-center space-y-2">
                      <div className="flex justify-center text-pink-400"><Save size={20} /></div>
                      <span className="text-[0.65rem] font-bold block text-[var(--primary)]">EXPORTAR EN PDF</span>
                      <p className="text-[0.55rem] opacity-65 leading-normal">
                        Podés exportar tu progreso actual en forma de tablas (formato PDF), el cual podes imprimir y tener como referencia a mano!
                      </p>
                    </div>
                    
                  </div>
                </div>
              )}

              {welcomeStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-[var(--primary)] m-0 border-0 p-0 text-red-400">
                    SISTEMA_COMPLETADO_Y_LISTO_PARA_USAR 
                  </h2>
                  
                <div className={`p-4 border-l-4 rounded text-xs gap-3 space-y-2 font-mono ${
                    isDarkMode 
                      ? "bg-amber-500/10 border-amber-500 text-amber-200" 
                      : "bg-amber-500/15 border-amber-600 text-amber-950 font-medium"
                  }`}>
                    <p className={`font-bold uppercase tracking-widest ${isDarkMode ? "text-amber-400" : "text-amber-800"}`}>ADVERTENCIA_MÉTRICA_DE_SEGURIDAD:</p>
                    <p className="leading-normal">
                      ESTE SISTEMA ES DE CARÁCTER NO OFICIAL Y ESTÁ DISEÑADO ÚNICAMENTE PARA REFERENCIA VISUAL Y DE PLANIFICACIÓN PERSONAL.
                    </p>
                    <p className="leading-normal">
                      Cualquier divergencia siempre debe ser resuelta remitiéndose al Plan de Estudio o medios oficiales correspondientes.
                    </p>
                  </div>

                  <p className="text-[0.7rem] text-white/50 leading-relaxed font-mono">
                    Haciendo clic en el botón de abajo guardarás tu registro de bienvenida y entrarás de manera permanente a la malla curricular interactiva. Podés reabrir este asistente interactivo cuando desees desde el botón <strong>GUÍA_INTERACTIVA</strong> en la barra de controles.
                  </p>

                  <button 
                    className="btn-theme w-full py-4 text-xs font-black text-center border-green-500/80 hover:bg-green-500/20 text-green-400 animate-pulse bg-green-500/5 transition-all"
                    onClick={() => { setShowWelcome(false); localStorage.setItem('bienvenida_vista', 'true'); }}
                  >
                    EJECUTAR_SISTEMA [ACCESO_PERMITIDO] ➔
                  </button>
                </div>
              )}

              {/* Navigation Bar */}
              <div className="flex justify-between items-center mt-8 border-t border-white/20 pt-4 font-mono">
                <button 
                  className={`px-4 py-2 text-xs border border-white/10 bg-white/5 hover:bg-white/10 transition-colors ${
                    welcomeStep === 1 ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                  disabled={welcomeStep === 1}
                  onClick={() => setWelcomeStep(prev => prev - 1)}
                >
                  ◀ ANTERIOR
                </button>

                {/* Steps tracker dots */}
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <button
                      key={step}
                      onClick={() => setWelcomeStep(step)}
                      className={`w-3.5 h-3.5 rounded-full border transition-all ${
                        welcomeStep === step
                          ? 'bg-[var(--secondary)] border-[var(--secondary)] scale-110'
                          : 'bg-white/10 hover:bg-white/30 border-white/20'
                      }`}
                      title={`Página ${step}`}
                    />
                  ))}
                </div>

                <button 
                  className={`px-4 py-2 text-xs border hover:bg-white/10 transition-all ${
                    welcomeStep === 5 
                      ? 'border-green-500/40 text-green-400 hover:bg-green-500/10' 
                      : 'border-white/10 bg-white/5 hover:text-[var(--secondary)] hover:border-[var(--secondary)]/50'
                  }`}
                  onClick={() => {
                    if (welcomeStep === 5) {
                      setShowWelcome(false); 
                      localStorage.setItem('bienvenida_vista', 'true');
                    } else {
                      setWelcomeStep(prev => prev + 1);
                    }
                  }}
                >
                  {welcomeStep === 5 ? 'EJECUTAR ✓' : 'SIGUIENTE ▶'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCalculator && (
          <CalculatorModal onClose={() => setShowCalculator(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDisponibles && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-fondo" 
            onClick={() => setShowDisponibles(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="modal-contenido" 
              onClick={e => e.stopPropagation()}
            >
              <h2>
                <Search size={22} />
                DIAGNÓSTICO_DE_DISPONIBILIDAD
              </h2>
              <p className="mb-6 text-sm opacity-60 font-mono">// MATERIAS_DESBLOQUEADAS_PARA_CURSADO_INMEDIATO</p>
              <div className="max-h-[50vh] overflow-y-auto custom-scrollbar pr-4">
                {materiasDisponibles.length === 0 ? (
                  <div className="p-8 border border-dashed border-white/20 text-center opacity-40">
                    NO SE DETECTARON NUEVAS MATERIAS DISPONIBLES.
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {materiasDisponibles.map(m => (
                      <li key={m.id} className="p-4 border border-white/10 bg-white/5 flex justify-between items-center group hover:border-[var(--secondary)] transition-colors">
                        <div className="flex flex-col">
                          <span className="text-[var(--secondary)] font-bold text-xs">[{m.id}]</span>
                          <span className="text-sm font-bold uppercase">{m.n}</span>
                        </div>
                        <span className="text-[0.6rem] opacity-40 font-mono">{m.c}_CRED</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button className="btn-theme w-full mt-8 py-3" onClick={() => setShowDisponibles(false)}>CERRAR_DIAGNÓSTICO</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <div className="main-content-scroll custom-scrollbar">
          <div className="sticky-horizontal">
            <Header 
              onTitleClick={handleTitleClick} 
              liveUsers={liveUsers} 
              totalVisits={totalVisits} 
              carreraKey={carreraActual}
              isDarkMode={isDarkMode}
            />
            
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

             <button className="flex items-center gap-2 btn-theme" onClick={() => { setWelcomeStep(1); setShowWelcome(true); }} >
                <MessageCircleQuestionMark size={14} />
                GUÍA_INTERACTIVA
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
                
                <AnimatePresence>
                  {showShareMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="share-menu-dropdown"
                    >
                      <button className="share-menu-item" onClick={handleGenerateLink}>
                        {copied ? <Check size={14} className="text-green-400" /> : <Link size={14} />}
                        <span>{copied ? 'ENLACE_COPIADO' : 'COPIAR_ENLACE_PROGRESO'}</span>
                      </button>
                      <button className="share-menu-item" onClick={handleExportPDF}>
                        <FileText size={14} />
                        <span>DESCARGAR_PDF_ACADÉMICO</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[0.6rem] font-bold opacity-50 uppercase tracking-widest">PROYECTO:</span>
                <select 
                  className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[0.7rem] font-mono outline-none focus:border-[var(--primary)]"
                  value={carreraActual} 
                  onChange={(e) => setCarreraActual(e.target.value)}
                >
                  {Object.keys(nombresCarreras).map(key => (
                    <option key={key} value={key}>{nombresCarreras[key].titulo}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <motion.div 
            ref={mallaRef} 
            layout
            className={`malla-wrapper ${materiaEnfocada ? 'dimming-active' : ''}`}
          >
            {plan.map((semestre, index) => (
              <motion.div 
                key={`${carreraActual}-${semestre.sem}`} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="semestre"
              >
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
                    <motion.div 
                      layout
                      className={`mb-3 p-3 border-l-2 text-[0.65rem] italic rounded-r cursor-pointer transition-colors ${
                        isDarkMode 
                          ? "bg-yellow-500/5 border-yellow-500/50 text-yellow-200/80 hover:bg-yellow-500/10" 
                          : "bg-amber-500/10 border-amber-500 text-amber-900 hover:bg-amber-500/20"
                      }`}                   
                      onClick={() => {
                        setSemestreEditandoNota(semestre.sem);
                        setTempNota(notasSemestres[semestre.sem] || "");
                      }}
                    >
                      <p className="line-clamp-4 leading-relaxed">{notasSemestres[semestre.sem]}</p>
                    </motion.div>
                  )}

                  <AnimatePresence>
                    {semestreEditandoNota === semestre.sem && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-3 space-y-2 overflow-hidden"
                      >
                        <textarea
                      className={`mb-3 p-3 border-l-2 text-[0.65rem] italic rounded-r cursor-pointer transition-colors ${
                        isDarkMode 
                              ? "bg-yellow-500/5 border-yellow-500/50 text-yellow-200/80 hover:bg-yellow-500/10" 
                              : "bg-amber-500/10 border-amber-500 text-amber-900 hover:bg-amber-500/20"
                          }`}
                          
                          value={tempNota}
                          autoFocus
                          onChange={(e) => setTempNota(e.target.value)}
                          placeholder="ENTRADA_DE_DATOS_NOTAS..."
                        />
                        <div className="flex gap-2 justify-end">
                          <button 
                            className="flex items-center gap-1 text-[0.6rem] px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded transition-colors border border-green-500/20"
                            onClick={() => {
                              setNotasSemestres(prev => ({ ...prev, [semestre.sem]: tempNota }));
                              setSemestreEditandoNota(null);
                            }}
                          >
                            <Save size={12} /> GUARDAR
                          </button>
                          <button 
                            className="flex items-center gap-1 text-[0.6rem] px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded transition-colors border border-white/10"
                            onClick={() => setSemestreEditandoNota(null)}
                          >
                            <X size={12} /> CANCELAR
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="semestre-summary">
                    <div className="summary-item">
                      <span className="label">MATERIAS:</span>
                      <span className="value">{semestre.materias.filter(m => estadoMaterias.get(m.id) === 2).length}/{semestre.materias.length}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">CRÉDITOS:</span>
                      <span className="value">
                        {semestre.materias.reduce((acc, m) => acc + (isMateriaCompletada(m) ? m.c : 0), 0)} / {semestre.materias.reduce((acc, m) => acc + m.c, 0)}
                      </span>
                    </div>
                  </div>
                </div>
                <button 
                  className={`btn-semestre ${semestre.materias.every((m: Materia) => estadoMaterias.get(m.id) === 2) ? 'completado' : ''}`}
                  onClick={() => handleAprobarSemestre(semestre)}
                >
                  {semestre.materias.every((m: Materia) => estadoMaterias.get(m.id) === 2) ? "DESMARCAR_SEMESTRE" : "APROBAR_SEMESTRE ✓"}
                </button>
                
                <div className="space-y-4">
                  {semestre.materias.map((m: Materia) => {
                    const status = estadoMaterias.get(m.id) || 0;
                    const isBlocked = (() => {
                      const failEx = m.reqExamen?.some((id: string) => !isRequisitoCumplido(id, 'examen'));
                      const failCur = m.reqCurso?.some((id: string) => !isRequisitoCumplido(id, 'curso'));
                      return failEx || failCur;
                    })();

                    return (
                      <MateriaCard 
                        key={`${semestre.sem}-${m.id}`}
                        materia={m}
                        estado={status}
                        isBlocked={isBlocked}
                        isCompletada={isMateriaCompletada(m)}
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
              </motion.div>
            ))}
          </motion.div>

          <footer className="site-footer">
            
           <div className="max-w-4xl space-y-4 :text-left font-mono">
              <h4 className="text-mx font-bold uppercase tracking-widest text-[var(--secondary)]">
                // DESCARGO DE RESPONABILIDAD Y TÉRMINOS DE USO (DISCLAIMER)
              </h4>
              <p className="text-xs md:text-sm leading-relaxed opacity-60">
                Esta plataforma web interactiva es un proyecto de software libre de carácter <strong>completamente independiente, informal y no oficial</strong>. No se encuentra asociada de ninguna forma a la institución, Coordinación de Carrera, Seccretaría, ni cuenta con el aval oficial de la Universidad Tecnológica del Uruguay (UTEC).
              </p>
              <p className="text-xs md:text-sm leading-relaxed opacity-60">
                Los datos relativos a asignaturas (créditos, prerrequisitos, co-rrequisitos y códigos de materias) han sido recopilados con fines meramente visuales, ilustrativos y de simulación académica personal. Dado que la malla real y los esquemas normativos universitarios están sujetos a constantes actualizaciones, cambios curriculares y adaptaciones de calendario por parte de UTEC, queda estrictamente bajo exclusiva responsabilidad del estudiante contrastar y verificar el estado real de su escolaridad mediante el contacto directo con la Coordinación de IMEC o Secretaria de la carrera.
              </p>
              <p className={`text-xs md:text-sm leading-relaxed opacity-90 ${isDarkMode ? "text-yellow-400" : "text-amber-700"}`}>
                [!] Al interactuar con el sistema de simulación o generar reportes no oficiales en formato PDF, el usuario asume plenamente y deslinda de toda responsabilidad legal, civil o administrativa al desarrollador de la plataforma ante cualquier discrepancia curricular o error de inscripción en asignaturas reales.
              </p>
              <div className="pt-4 border-t border-white/5 text-xs flex flex-col sm:flex-row justify-between items-left sm: items-center gap-4 opacity-50">
                <span>MALLA INTERACTIVA // V8.1 // CONSTRUIDO PARA UTEC</span>
                <span>
                  IDENTIFICACIÓN ESTUDIANTE RESPONSABLE:{' '}
                  <a href="mailto:sofia.modernell@estudiantes.utec.edu.uy" className="hover:underline font-bold text-[var(--text)]">
                    sofia.modernell@estudiantes.utec.edu.uy
                  </a>
                </span>
              </div>
            </div>
            
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

function Header({ onTitleClick, liveUsers, totalVisits, carreraKey, isDarkMode }: { onTitleClick: () => void, liveUsers: number, totalVisits: number | null, carreraKey: string, isDarkMode: boolean }) {

  const baseUrl = import.meta.env.BASE_URL || '/';
  const infoCarrera = nombresCarreras[carreraKey];
  
  return (
    <header className="overflow-hidden">
      <img src={`${baseUrl}utec_logo.jpg`} alt="UTEC" className="logo-container logo-utec" />
      {infoCarrera.logo && (
        <img src={`${baseUrl}${infoCarrera.logo}`} alt={infoCarrera.titulo} className="logo-container logo-imec" />
      )}
      
      <div className="header-content">
        <p className="mb-4">ENGINEERING DIAGRAM // SOFIA.MODERNELL</p>
        <h1 
          className="text-white cursor-default select-none" 
          onClick={onTitleClick}
        >
          Malla Curricular
        </h1>
        <p className="text-white/60">{infoCarrera.subtitulo}</p>
        <div className="flex items-center gap-4 mt-2 text-[0.7rem] font-mono opacity-80 uppercase tracking-widest justify-center">
          <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded-sm border border-green-500/20">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-green-400 font-bold">{liveUsers} EN_VIVO</span>
          </div>

          {totalVisits !== null && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-sm border ${
              isDarkMode 
                ? "bg-white/5 border-white/10 text-white" 
                : "bg-black/5 border-black/10 text-black font-semibold"
            }`}>
              <span>{totalVisits} VISITAS_TOTALES</span>
            </div>
          )}

          
        </div>
      </div>
    </header>
  );
}

interface MateriaCardProps {
  key?: string | number;
  materia: Materia;
  estado: number;
  isBlocked: boolean;
  isCompletada: boolean;
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
  isCompletada,
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
    estado === 2 && !isCompletada ? 'pendiente-anual' : '',
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
       {materia.anualId && (
          <span className="text-[0.5rem] font-bold opacity-50 bg-white/10 px-1 rounded" title="Materia Anual">
            ANUAL
          </span>
        )}
        
      </div>
      <span className="materia-name">{materia.n}</span>
      <div className="materia-info">
        <span>{materia.c} Créditos</span>
        {estado === 2 && !isCompletada && (
        <span className="text-[0.5rem] text-[var(--cursada)] font-bold ml-2 animate-pulse">PARTIAL_PASS</span>
        )}
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
        {!isNoExamen && normNf >= 3 && normNf < 4 ? `// ADVERTENCIA: SE REQUIERE MIN_EXAMEN: ~${3} PARA APROBACIÓN FINAL.` : ''}
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
