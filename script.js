const basesDeDatos = {
    "imec_2023": [
        { sem: 1, materias: [
            { id: "COES", n: "Comun. Oral y Escrita", c: 5, a: "General" },
            { id: "PRG1", n: "Programación 1", c: 6, a: "Informática" },
            { id: "TDC1", n: "Teoría de Circuitos 1", c: 6, a: "Electrónica"},
            { id: "MAT1", n: "Matemática 1", c: 8, a: "Básicas" },
            { id: "QMCA", n: "Química", c: 6, a: "Básicas" },
            { id: "INTM", n: "Introd. a la Mecatrónica", c: 4, a: "Mecánica" },
            { id: "ING1", n: "Inglés 1", c: 4, a: "Idiomas" },
            { id: "PE1", n: "Programas Especiales 1", c: 2, a: "Otro" }
        ]},
        
        { sem: 2, materias: [
            { id: "MAT2", n: "Matemática 2", c: 8, a: "Básicas", reqCurso: ["MAT1"] },
            { id: "FMIN", n: "Fundamentos Matemáticos con Informatica", c: 6, a: "Informática", reqCurso: ["MAT1", "PRG1"] },
            { id: "TDC2", n: "Teoría de Circuitos 2", c: 6, a: "Electrónica", reqCurso: ["TDC1"]},
            { id: "FIS1", n: "Física 1", c: 7, a: "Básicas", reqCurso: ["MAT1"] },
            { id: "TDM1", n: "Tecnologías de Materiales", c: 6, a: "Mecánica", reqCurso: ["QMCA"] },
            { id: "DCAD", n: "Dibujo Computarizado", c: 5, a: "Mecánica", reqCurso: ["INTM"] },
            { id: "PIC1", n: "Proyecto Integrador de Competencias 1", c: 3, a: "Competencias", reqCurso: ["INTM", "FMIN","TDC2","TDM1","DCAD"] },
            { id: "ING2", n: "Inglés 2", c: 4, a: "Idiomas" },
            { id: "PE2", n: "Programas Especiales 2", c: 2, a: "Otro" }
        ]},
        
        { sem: 3, materias: [
            { id: "MAT3", n: "Matemática 3", c: 8, a: "Básicas", reqCurso: ["MAT2"], reqExamen: ["MAT1"] },
            { id: "PRG2", n: "Programación 2", c: 6, a: "Informática", reqCurso: ["FMIN"], reqExamen: ["PRG1"]},
            { id: "EALG", n: "Electrónica Analógica Aplicada 1", c: 6, a: "Electrónica", reqCurso: ["TDC2", "FIS1","MAT2"], reqExamen: ["MAT1", "TDC1"] },
            { id: "SLSO", n: "Seguridad Laboral y Salud Ocupacional", c: 5, a: "General", reqExamen: ["MAT1","QMCA","INTM","COES","PRG1","TDC1"] },
            { id: "DIES", n: "Dinámica y Estática", c: 7, a: "Mecánica" ,reqCurso: ["FIS1"], reqExamen: ["INTM"]},
            { id: "EDG1", n: "Electrónica Digital 1", c: 7, a: "Electrónica", reqCurso: ["FMIN"], reqExamen: ["TDC1"] },
            { id: "ING3", n: "Inglés 3", c: 4, a: "Idiomas" },
            { id: "PE3", n: "Programas Especiales 3", c: 2, a: "Otro" }
        ]},
        { sem: 4, materias: [
            { id: "TMPR", n: "Tecnologías de Microprocesadores", c: 7, a: "Electrónica", reqCurso: ["EDG1"], reqExamen: ["FMIN"] },
            { id: "PRG3", n: "Programación 3", c: 7, a: "Informática", reqCurso: ["PRG1","MAT1"] },
            { id: "MEM1", n: "Materiales y Elementos de Maquinas 1", c: 6, a: "Mecánica", reqCurso: ["DIES"], reqExamen: ["FMIN"] },
            { id: "FIS2", n: "Física 2", c: 7, a: "Básicas", reqExamen: ["MAT1", "FMIN","FIS1"] },
            { id: "AEIN", n: "Aplicaciones Electro Industriales", c: 6, a: "Electrónica", reqCurso: ["EALG"], reqExamen: ["TDC2", "FMIN"] },
            { id: "PIC2", n: "Proyecto Integrador de Competencias 2", c: 3, a: "Competencias", reqCurso: ["TMPR","PRG3","MEM1","AEIN"], reqExamen:["PIC1"] },
            { id: "ING4", n: "Inglés 4", c: 4, a: "Idiomas" },
            { id: "PE4", n: "Programas Especiales 4", c: 2, a: "Otro" }
        ]},
        { sem: 5, materias: [
            { id: "MAEL", n: "Máquinas Eléctricas", c: 7, a: "Electrónica", reqCurso: ["AEIN"], reqExamen: ["EALG"]  },
            { id: "TIND", n: "Telemática Industrial", c: 7, a: "Telemática", reqCurso: ["EALG", "PRG3"], reqExamen: ["TMPR", "PRG2"]  },
            { id: "FIS3", n: "Física 3", c: 7, a: "Básicas", reqExamen: ["PRG2","EALG","SLSO","EDG1","MAT3","DIES"] },
            { id: "INSC", n: "Introducción a los Sistemas de Control", c: 7, a: "Electrónica", reqCurso: ["AEIN"], reqExamen: ["PRG2","EALG","SLSO","EDG1","MAT3","DIES"] },
            { id: "LEGL", n: "Legislación Laboral", c: 5, a: "General", reqExamen: ["PRG2","EALG","SLSO","EDG1","MAT3","DIES"] },
            { id: "PFAB", n: "Procesos de Fabricación", c: 5, a: "Mecánica", reqExamen: ["PRG2","EALG","SLSO","EDG1","MAT3","DIES"] },
            { id: "APTM", n: "Anteproyecto de Tecnólogo", c: 5, a: "Competencias", reqExamen: ["PIC2"] },
            { id: "PPCU", n: "Practica Profesional Curricular", c: 8, a: "Competencias", reqExamen: ["PRG2","EALG","SLSO","EDG1","MAT3","DIES"] },
            { id: "ING5", n: "Inglés 5", c: 4, a: "Idiomas" },
            { id: "PE5", n: "Programas Especiales 5", c: 2, a: "Otro" }
        ]},
        { sem: 6, materias: [
            { id: "EDG2", n: "Electrónica Digital 2", c: 7, a: "Electrónica", reqExamen: ["EALG","EDG1"] },
            { id: "HYNE", n: "Hidráulica y Neumática", c: 7, a: "Mecánica", reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ] },
            { id: "AUTM", n: "Automatización", c: 7, a: "Telemática", reqCurso: ["TIND", "INSC"], reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ] },
            { id: "TDCR", n: "Tecnologías de Control y Robótica", c: 7, a: "Mecatrónica", reqCurso: ["INSC"] },
            { id: "IMEL", n: "Instrumentación y Medidas Eléctricas", c: 7, a: "Electrónica", reqCurso: ["MAEL", "INSC"], reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ]  },
            { id: "PIND", n: "Procesos Industriales", c: 5, a: "Soporte", reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ] },
            { id: "PFTM", n: "Proyecto Final de Tecnólogo", c: 5, a: "Competencias", reqExamen: ["APTM"] },
            { id: "ING6", n: "Inglés 6", c: 4, a: "Idiomas" },
            { id: "PE6", n: "Programas Especiales 6", c: 2, a: "Otro" }
        ]},
        { sem: 7, materias: [
            { id: "MAT4", n: "Matemática 4", c: 8, a: "Básicas", reqExamen: ["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
            { id: "EPOT", n: "Electrónica de Potencia", c: 7, a: "Electrónica", reqCurso: ["TDCR", "IMEL"], reqExamen: ["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"] },
            { id: "MEM2", n: "Materiales y Elementos de Maquinas 2", c: 6, a: "Mecánica", reqExamen:["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
            { id: "GPYE", n: "Gestión de Proyectos y Emprendimientos", c: 4, a: "General", reqExamen:["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"] },
            { id: "SEMB", n: "Sistemas Embebidos", c: 6, a: "Telemática" , reqCurso: ["TDCR"], reqExamen:["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
            { id: "TCYF", n: "Transferencia de Calor y Fluidos", c: 6, a: "Mecánica", reqExamen: ["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
            { id: "ING7", n: "Inglés 7", c: 4, a: "Idiomas" },
            { id: "PE7", n: "Programas Especiales 7", c: 2, a: "Otro" }
        ]},
        { sem: 8, materias: [
            { id: "PYES", n: "Probabilidad y Estadística", c: 5, a: "Básicas", reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"] },
            { id: "MNPI", n: "Métodos Númericos para Ingeniería", c: 7, a: "Soporte", reqCurso: ["MAT4"], reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
            { id: "PRDS", n: "Procesamiento de Señales", c: 7, a: "Telemática", reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
            { id: "MDSA", n: "Mantenimiento de Sistemas Automaizados", c: 6, a: "Mecánica", reqCurso: ["SEMB"], reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
            { id: "SCAP", n: "Sistemas de Control Aplicados ", c: 7, a: "Mecatrónica", reqCurso: ["EPOT"], reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
            { id: "TDM2", n: "Tecnologías de Materiales 2", c: 6, a: "Mecánica", reqExamen: ["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"] },
            { id: "ING8", n: "Inglés 8", c: 4, a: "Idiomas" },
            { id: "PE8", n: "Programas Especiales 8", c: 2, a: "Otro" }
        ]},
        { sem: 9, materias: [
            { id: "DMEC", n: "Diseño Mecatónico", c: 7, a: "Mecatrónica", reqCurso: ["SCAP","MDSA"], reqExamen: ["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"] },
            { id: "RBIN", n: "Robótica Industrial ", c: 7, a: "Mecatrónica", reqCurso: ["SCAP"] , reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"]},
            { id: "MIAC", n: "Manufactura Asistida por Computador ", c: 5, a: "Soporte", reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"] },
            { id: "CPIN", n: "Costos para Ingeniería ", c: 5, a: "Soporte" , reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"]},
            { id: "OPT1", n: "Optativa 1", c: 6, a: "Optativa", reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"] },
            { id: "PFG1", n: "Proyecto Final de Grado 1", c: 8, a: "Competencias" , reqExamen:["PYES","MNPI","PRDS","MDSA","SCAP","TDM2"]},
            { id: "ING9", n: "Inglés 9", c: 4, a: "Idiomas" },
            { id: "PE9", n: "Programas Especiales 9", c: 2, a: "Otro" }
        ]},
        { sem: 10, materias: [
            { id: "GCAL", n: "Gestion de Calidad", c: 5, a: "Soporte" , reqExamen:["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"]},
            { id: "GIAM", n: "Gestion de Impacto Ambiental ", c: 5, a: "Soporte" , reqExamen:["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"]},
            { id: "SICF", n: "Sistemas Inteligentes y Ciberfísicos", c: 7, a: "Mecatrónica", reqExamen: ["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"] },
            { id: "OPT2", n: "Optativa 2", c: 6, a: "Optativa", reqExamen: ["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"]},
            { id: "PFG2", n: "Proyecto Final de Grado 2", c: 8, a: "Competencias", reqExamen: ["TDM2","PYES","MNPI","PRDS","SCAP","MDSA","OPT1","CPIN","MIAC","PFG1"] },
            { id: "ING10", n: "Inglés 10", c: 4, a: "Idiomas" },
            { id: "PE10", n: "Programas Especiales 10", c: 2, a: "Otro" }
        ]}
    ]
};

// --- ESTADO GLOBAL ---
let estadoMaterias = new Map(); 
let carreraActual = "imec_2023";
let materiaEnfocadaId = null;

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Cargar progreso
    const progresoGuardado = localStorage.getItem('progreso_imec');
    if (progresoGuardado) {
        estadoMaterias = new Map(JSON.parse(progresoGuardado));
    }
    // 2. Control del modal de bienvenida
    if (localStorage.getItem('bienvenida_vista') === 'true') {
        const modal = document.getElementById('modal-bienvenida');
        if (modal) modal.style.display = 'none';
    }

    // 3. Dibujar
    dibujarInterfaz();
});

function cerrarBienvenida() {
    const modal = document.getElementById('modal-bienvenida');
    if (modal) {
        modal.style.display = 'none';
        localStorage.setItem('bienvenida_vista', 'true');
    }
}


function dibujarInterfaz() {
    const container = document.getElementById('malla-container');
    if (!container) return;
    container.innerHTML = '';
    
    const plan = basesDeDatos[carreraActual];
    let totalCreditos = 0;

    plan.forEach(semestre => {
        const semDiv = document.createElement('div');
        semDiv.className = 'semestre';
        semDiv.innerHTML = `<h3>Semestre ${semestre.sem}</h3>`;

        // === BOTÓN DE APROBAR SEMESTRE ENTERO ===
        // 1. Primero calculamos si está completo
        const semestreCompleto = semestre.materias.every(mat => estadoMaterias.get(mat.id) === 2);
        // 2. Luego creamos el botón usando ese dato
        const btnSemestre = document.createElement('button');
        btnSemestre.className = 'btn-semestre' + (semestreCompleto ? ' completado' : '');
        btnSemestre.innerText = semestreCompleto ? "Desmarcar Semestre" : "Aprobar Semestre ✓";

        btnSemestre.addEventListener('click', () => {
            e.stopPropagation();
            // Limpiamos cualquier resaltado previo para que no se vea gris en móviles
            desactivarResaltado();
            materiaEnfocadaId = null;
            
            if (semestreCompleto) {
                semestre.materias.forEach(m => estadoMaterias.set(m.id, 0));
            } else {
                semestre.materias.forEach(m => estadoMaterias.set(m.id, 2));
                // 🎉 EFECTO CONFETTI
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#007ea7', '#00a8e8', '#a8e6cf']
                });
            }
            // Guardar progreso automáticamente
            localStorage.setItem('progreso_imec', JSON.stringify(Array.from(estadoMaterias.entries())));
            dibujarInterfaz();
        });

        semDiv.appendChild(btnSemestre);

        semestre.materias.forEach(mat => {
            const matDiv = document.createElement('div');
            matDiv.id = mat.id; 
            matDiv.className = 'materia';

            // --- LÓGICA DE ESTADOS (necesaria para el bloqueo en el click) ---
            let estaBloqueada = false;
            let faltanTextos = [];

            if (mat.reqExamen) {
                mat.reqExamen.forEach(reqId => {
                    if (estadoMaterias.get(reqId) !== 2) faltanTextos.push(`${reqId} (Aprobada)`);
                });
            }
            if (mat.reqCurso) {
                mat.reqCurso.forEach(reqId => {
                    if ((estadoMaterias.get(reqId) || 0) < 1) faltanTextos.push(`${reqId} (Cursada)`);
                });
            }
            if (faltanTextos.length > 0) estaBloqueada = true;

            // --- LÓGICA DE INTERACCIÓN (PC y MÓVIL) ---
            // En PC: Hover normal
            matDiv.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) activarResaltado(mat);
            });
            matDiv.addEventListener('mouseleave', () => {
                if (window.innerWidth > 768) desactivarResaltado();
            });

            matDiv.addEventListener('click', (e) => {
                const esMovil = window.innerWidth <= 768;
                
                // Si es móvil y no está enfocada, primero la enfocamos
                if (esMovil && materiaEnfocadaId !== mat.id) {
                    desactivarResaltado(); 
                    activarResaltado(mat);
                    materiaEnfocadaId = mat.id;
                    return; 
                }

                // Acción de marcar/desmarcar
                if (estaBloqueada) {
                    alert('🔒 No podés acceder a esta materia!. Te falta:\n' + faltanTextos.join('\n'));
                    return; 
                }

                const estadoActual = estadoMaterias.get(mat.id) || 0;
                if (estadoActual === 0) estadoMaterias.set(mat.id, 1);
                else if (estadoActual === 1) estadoMaterias.set(mat.id, 2);
                else estadoMaterias.set(mat.id, 0);
                
                materiaEnfocadaId = null; 
                desactivarResaltado();
                localStorage.setItem('progreso_imec', JSON.stringify(Array.from(estadoMaterias.entries())));
                dibujarInterfaz();
            });

            // --- RENDERIZADO VISUAL ---
            const estadoActual = estadoMaterias.get(mat.id) || 0;
            if (estaBloqueada) matDiv.classList.add('bloqueada');
            else if (estadoActual === 1) matDiv.classList.add('cursada');
            else if (estadoActual === 2) {
                matDiv.classList.add('aprobada');
                totalCreditos += mat.c;
            }

            matDiv.setAttribute('data-area', mat.a);
            matDiv.innerHTML = `
                <span class="area-tag">${mat.a}</span>
                <span class="materia-name">${mat.n}</span>
                <div class="materia-info">
                    <span>${mat.c} Créditos</span>
                </div>
            `;
            
            semDiv.appendChild(matDiv);
        });
        container.appendChild(semDiv);
    });

    const totalElement = document.getElementById('total-creditos');
    if (totalElement) totalElement.innerText = totalCreditos;
}


// --- LÓGICA DEL MODO OSCURO ---
const themeToggleBtn = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Aplicar tema guardado al cargar
if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggleBtn.innerText = '☀️ Light Mode';
}

themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerText = '🌙 Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerText = '☀️ Light Mode';
    }
});


// Cargar progreso guardado al iniciar
const progresoGuardado = localStorage.getItem('progreso_imec');
if (progresoGuardado) {
    estadoMaterias = new Map(JSON.parse(progresoGuardado));
}

function renderMalla(carreraId) {
    carreraActual = carreraId;
    estadoMaterias.clear();
    dibujarInterfaz();
}


    
// === CÁLCULO DE CRÉDITOS Y BARRA DE PROGRESO ===
    // Extraemos TODAS las materias del plan actual en una sola lista
    const todasLasMaterias = plan.flatMap(sem => sem.materias);
    
    // Calculamos el máximo de créditos posibles
    const maxCreditos = todasLasMaterias.reduce((acc, materia) => acc + materia.c, 0); 
    
    // Calculamos el porcentaje
    const porcentaje = maxCreditos > 0 ? (totalCreditos / maxCreditos) * 100 : 0;

    // Actualizamos los textos y el ancho de la barra
    const creditosCount = document.getElementById('creditos-count');
    const progressBar = document.getElementById('progress-bar');
    
    if (creditosCount && progressBar) {
        creditosCount.innerText = `Créditos: ${totalCreditos} / ${maxCreditos} (${porcentaje.toFixed(1)}%)`;
        progressBar.style.width = `${porcentaje}%`;
    }
}

window.onload = () =>    renderMalla('imec_2023'); // Renderiza la malla
    
// --- FUNCIONES DE EFECTO ENFOQUE ---
function activarResaltado(materiaSeleccionada) {
    const mallaWrapper = document.querySelector('.malla-wrapper');
    if(mallaWrapper) mallaWrapper.classList.add('dimming-active');
    
    // Obtener qué materias necesita esta (prerrequisitos)
    const reqs = [...(materiaSeleccionada.reqCurso || []), ...(materiaSeleccionada.reqExamen || [])];
    
    // Extraemos TODAS las materias del plan actual para buscar quiénes la necesitan
    const plan = basesDeDatos[carreraActual];
    const todasLasMaterias = plan.flatMap(sem => sem.materias);

    // Obtener a qué materias destraba esta (postrrequisitos) usando todasLasMaterias
    const postReqs = todasLasMaterias.filter(m => 
        (m.reqCurso && m.reqCurso.includes(materiaSeleccionada.id)) || 
        (m.reqExamen && m.reqExamen.includes(materiaSeleccionada.id))
    ).map(m => m.id);

    // Iterar por todas las tarjetas y aplicar estilos
    document.querySelectorAll('.materia').forEach(div => {
        const id = div.id;
        if (id === materiaSeleccionada.id) {
            div.classList.add('highlight-self');
        } else if (reqs.includes(id)) {
            div.classList.add('highlight-req');
        } else if (postReqs.includes(id)) {
            div.classList.add('highlight-post');
        }
    });
}

function desactivarResaltado() {
    const mallaWrapper = document.querySelector('.malla-wrapper');
    mallaWrapper.classList.remove('dimming-active');
    document.querySelectorAll('.materia').forEach(div => {
        div.classList.remove('highlight-self', 'highlight-req', 'highlight-post');
    });
}

document.getElementById('btn-reset').addEventListener('click', () => {
    if (confirm("¿Estás seguro de que quieres borrar todo tu progreso? Esta acción no se puede deshacer.")) {
        estadoMaterias.clear(); // Limpia el mapa de estados
        dibujarInterfaz(); // Refresca la pantalla
    }
});

document.getElementById('btn-disponibles').addEventListener('click', () => {
    const plan = basesDeDatos[carreraActual]; // Obtiene el plan actual
    const todas = plan.flatMap(sem => sem.materias); // Aplana la lista de materias
    const listaUl = document.getElementById('items-disponibles');
    listaUl.innerHTML = '';

    const disponibles = todas.filter(mat => {
        // Solo considerar materias que no están cursadas ni aprobadas (estado 0)
        if ((estadoMaterias.get(mat.id) || 0) > 0) return false;

        // Verificar requisitos de Examen
        const cumpleExamen = !mat.reqExamen || mat.reqExamen.every(reqId => estadoMaterias.get(reqId) === 2);
        
        // Verificar requisitos de Curso
        const cumpleCurso = !mat.reqCurso || mat.reqCurso.every(reqId => (estadoMaterias.get(reqId) || 0) >= 1);

        return cumpleExamen && cumpleCurso;
    });

    if (disponibles.length === 0) {
        listaUl.innerHTML = '<li>¡No tienes materias nuevas disponibles por ahora!</li>';
    } else {
        disponibles.forEach(mat => {
            const li = document.createElement('li');
            li.textContent = `${mat.n} (${mat.id})`;
            listaUl.appendChild(li);
        });
    }
    document.getElementById('lista-disponibles').style.display = 'block';
});

// Función para el botón de Reiniciar (Debes añadir el ID 'btn-reset' a un botón en el HTML si quieres usarlo)
function reiniciarTodo() {
    if (confirm("¿Seguro que quieres borrar todo tu progreso?")) {
        estadoMaterias.clear();
        localStorage.removeItem('progreso_imec');
        dibujarInterfaz();
    }
}

// Lógica para ver qué materias puedes cursar
function mostrarDisponibles() {
    const plan = basesDeDatos[carreraActual];
    const todas = plan.flatMap(s => s.materias);
    const listaUl = document.getElementById('items-disponibles');
    listaUl.innerHTML = '';

    const disponibles = todas.filter(mat => {
        if ((estadoMaterias.get(mat.id) || 0) > 0) return false;
        const cumpleExamen = !mat.reqExamen || mat.reqExamen.every(id => estadoMaterias.get(id) === 2);
        const cumpleCurso = !mat.reqCurso || mat.reqCurso.every(id => (estadoMaterias.get(id) || 0) >= 1);
        return cumpleExamen && cumpleCurso;
    });

    if (disponibles.length === 0) {
        listaUl.innerHTML = '<li>No hay materias nuevas disponibles.</li>';
    } else {
        disponibles.forEach(m => {
            const li = document.createElement('li');
            li.style.marginBottom = "5px";
            li.innerHTML = `<strong>${m.id}</strong> - ${m.n}`;
            listaUl.appendChild(li);
        });
    }
    document.getElementById('lista-disponibles').style.display = 'block';
}

// Vincular botones (Asegúrate de que los IDs coincidan con tu HTML)
// Puedes poner esto al final del script
document.addEventListener('DOMContentLoaded', () => {
    const btnDisp = document.getElementById('btn-disponibles');
    if(btnDisp) btnDisp.onclick = mostrarDisponibles;
    
    const btnRes = document.getElementById('btn-reset');
    if(btnRes) btnRes.onclick = reiniciarTodo;
});

const configuracionSCP = {
    "1": { campos: ["Ev1", "Ev2", "EC"], pesos: [0.25, 0.35, 0.40] },
    "2": { campos: ["Ev1", "Ev2", "EC"], pesos: [0.30, 0.30, 0.40] },
    "3": { campos: ["Ev1", "Ev2", "Lab", "EC"], pesos: [0.25, 0.35, 0.20, 0.20] },
    "4": { campos: ["Participación", "Trabajo"], pesos: [0.70, 0.30] },
    "5": { campos: ["Ev1", "Ev2", "Ev3"], pesos: [0.30, 0.50, 0.20] },
    "6": { campos: ["Actividades", "Participación"], pesos: [0.60, 0.40] },
    "7": { campos: ["Ev1", "Ev2"], pesos: [0.50, 0.50] },
    "8": { campos: ["Ev1", "Ev2"], pesos: [0.40, 0.60] },
    "9": { campos: ["Teórico-Práctico", "EC"], pesos: [0.70, 0.30] },
    "10": { campos: ["Participación", "Trabajo"], pesos: [0.70, 0.30] },
    "11": { campos: ["Lab", "EC", "Proy", "Ev1", "Ev2", "Ev3", "Ev4"], pesos: [0.3, 0.1, 0.2, 0.1, 0.1, 0.1, 0.1] },
    "12": { campos: ["Lab", "EC", "Proy"], pesos: [0.30, 0.30, 0.40] }
};

function generarCamposDinamicos() {
    const scpId = document.getElementById('scp-tipo').value;
    const config = configuracionSCP[scpId];
    const contenedor = document.getElementById('contenedor-dinamico');
    contenedor.innerHTML = '';

    config.campos.forEach((nombre, index) => {
        const div = document.createElement('div');
        div.className = 'input-group';
        div.innerHTML = `
            <label>${nombre} (Escala 1-5):</label>
            <input type="number" step="0.01" min="1" max="5" class="nota-input" 
                   data-peso="${config.pesos[index]}" placeholder="Ej: 3.50">
        `;
        contenedor.appendChild(div);
    });
}

function abrirCalculadora() {
    const modal = document.getElementById('modal-calculadora');
    if (modal) {
        modal.style.display = 'flex';
        // Generamos los campos por defecto (SCP 1) al abrir
        generarCamposDinamicos(); 
    } else {
        console.error("No se encontró el modal de la calculadora en el HTML");
    }
}

function cerrarCalculadora() {
    document.getElementById('modal-calculadora').style.display = 'none';
}

function procesarCalculo() {
    const scpId = document.getElementById('scp-tipo').value;
    const config = configuracionSCP[scpId];
    const inputs = document.querySelectorAll('.nota-input');
    const resDiv = document.getElementById('resultado-calc');
    
    let notaFinalEscala = 0;
    let pesoFaltante = 0;
    let camposVacios = [];

    inputs.forEach((input, index) => {
        const notaEntrada = parseFloat(input.value);
        const peso = parseFloat(input.dataset.peso);
        const nombreCampo = config.campos[index];

        if (!isNaN(notaEntrada)) {
            notaFinalEscala += notaEntrada * peso;
        } else {
            pesoFaltante += peso;
            camposVacios.push(nombreCampo);
        }
    });

    resDiv.style.display = 'block';
    let msg = "";

    if (camposVacios.length === 0) {
        const nf = parseFloat(notaFinalEscala.toFixed(2));
        let situacion = nf >= 4.00 ? "🟢 EXONERA" : (nf >= 3.00 ? "🟡 EXAMEN" : "🟠 TUTORÍA");
        msg = `<strong>${situacion}</strong><br>Nota Final: <span style="font-size:1.8rem">${nf}</span>`;
    } else if (camposVacios.length === 1) {
        const notaNecExon = (4.00 - notaFinalEscala) / pesoFaltante;
        msg = `Para exonerar necesitás un: <strong>${Math.max(1, notaNecExon).toFixed(2)}</strong> en ${camposVacios[0]}`;
    } else {
        msg = "Ingresá más notas para predecir.";
    }

    resDiv.innerHTML = msg;
    resDiv.style.color = "#333";

} 

