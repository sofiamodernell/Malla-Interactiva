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
            { id: "ING9", n: "Inglés 9", c: 4, a: "Idiomas" },
            { id: "PE9", n: "Programas Especiales 9", c: 2, a: "Otro" }
        ]}
    ]
};

let estadoMaterias = new Map(); 
let carreraActual = "imec_2023";

function renderMalla(carreraId) {
    carreraActual = carreraId;
    estadoMaterias.clear();
    dibujarInterfaz();
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

        // === NUEVO: BOTÓN DE APROBAR SEMESTRE ENTERO ===
        const btnSemestre = document.createElement('button');
        btnSemestre.className = 'btn-semestre';
        
        // Verificamos si TODAS las materias de este semestre ya están en estado 2 (Aprobadas)
        const semestreCompleto = semestre.materias.every(mat => estadoMaterias.get(mat.id) === 2);
        
        if (semestreCompleto) {
            btnSemestre.innerText = "Desmarcar Semestre";
            btnSemestre.classList.add('completado');
        } else {
            btnSemestre.innerText = "✓ Aprobar Semestre";
        }

        // Qué pasa al hacer clic en el botón del semestre
        btnSemestre.addEventListener('click', () => {
            if (semestreCompleto) {
                // Si estaba completo, desmarcamos todo (volvemos a 0)
                semestre.materias.forEach(mat => estadoMaterias.set(mat.id, 0));
            } else {
                // Si faltaban materias, las forzamos todas a estado 2 (Examen salvado)
                semestre.materias.forEach(mat => estadoMaterias.set(mat.id, 2));
            }
            dibujarInterfaz(); // Redibujamos la pantalla
        });

        semDiv.appendChild(btnSemestre);
        // ===============================================

        semestre.materias.forEach(mat => {
            const matDiv = document.createElement('div');
            matDiv.className = 'materia';
            
            let estaBloqueada = false;
            let faltanTextos = [];

            if (mat.reqExamen) {
                mat.reqExamen.forEach(reqId => {
                    if (estadoMaterias.get(reqId) !== 2) {
                        faltanTextos.push(`${reqId} (Examen)`);
                    }
                });
            }
            
            if (mat.reqCurso) {
                mat.reqCurso.forEach(reqId => {
                    if ((estadoMaterias.get(reqId) || 0) < 1) {
                        faltanTextos.push(`${reqId} (Curso)`);
                    }
                });
            }

            if (faltanTextos.length > 0) estaBloqueada = true;

            const estadoActual = estadoMaterias.get(mat.id) || 0;
            
            if (estaBloqueada) {
                matDiv.classList.add('bloqueada');
            } else if (estadoActual === 1) {
                matDiv.classList.add('cursada');
            } else if (estadoActual === 2) {
                matDiv.classList.add('aprobada');
                totalCreditos += mat.c;
            }

            let previasTexto = "";
            if (mat.reqExamen && mat.reqExamen.length > 0) previasTexto += `Ex: ${mat.reqExamen.join(', ')} `;
            if (mat.reqCurso && mat.reqCurso.length > 0) previasTexto += `Cur: ${mat.reqCurso.join(', ')}`;
            if (!previasTexto) previasTexto = "Ninguna";

            matDiv.innerHTML = `
                <span class="area-tag">${mat.a}</span>
                <span class="materia-name">${mat.n}</span>
                <div class="materia-info">
                    <span>${mat.c} Créditos</span>
                    <span title="Previas necesarias" style="font-size: 0.7rem; color:#888;">Previas: ${previasTexto}</span>
                </div>
            `;
            
            matDiv.addEventListener('click', () => {
                if (estaBloqueada) {
                    alert('🔒 No puedes acceder a esta materia. Te falta:\n' + faltanTextos.join('\n') + '\n\n¡Revisa el plan de estudios!');
                    return; 
                }

                if (estadoActual === 0) {
                    estadoMaterias.set(mat.id, 1);
                } else if (estadoActual === 1) {
                    estadoMaterias.set(mat.id, 2);
                } else {
                    estadoMaterias.set(mat.id, 0);
                }
                
                dibujarInterfaz();
            });

            semDiv.appendChild(matDiv);
        });
        container.appendChild(semDiv);
    });
    
    document.getElementById('creditos-count').innerText = totalCreditos;
}

window.onload = () => renderMalla('imec_2023');
