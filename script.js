const basesDeDatos = {
    "imec_2023": [
        { sem: 1, materias: [
            { id: "MAT1", n: "Matemática 1", c: 6, a: "Básicas" },
            { id: "QUI", n: "Química", c: 6, a: "Básicas" },
            { id: "PROG1", n: "Programación 1", c: 8, a: "Informática" },
            { id: "IME", n: "Introd. a la Mecatrónica", c: 4, a: "Mecánica" },
            { id: "COE", n: "Comun. Oral y Escrita", c: 4, a: "Transversal" },
            { id: "ING1", n: "Inglés 1", c: 3, a: "Idiomas" }
        ]},
        { sem: 2, materias: [
            { id: "MAT2", n: "Matemática 2", c: 6, a: "Básicas", reqCurso: ["MAT1"] },
            { id: "FIS1", n: "Física 1", c: 6, a: "Básicas", reqCurso: ["MAT1"] },
            { id: "TC1", n: "Teoría de Circuitos 1", c: 7, a: "Eléctrica", reqCurso: ["MAT1", "PROG1"] },
            { id: "CAD", n: "Dibujo (CAD)", c: 5, a: "Mecánica", reqCurso: ["IME"] },
            { id: "TDM1", n: "Tecnología de Materiales", c: 6, a: "Mecánica", reqCurso: ["QUI"] },
            { id: "PI1", n: "Proyecto Integrador 1", c: 10, a: "Proyecto", reqCurso: ["IME", "PROG1"] }
        ]},
        { sem: 3, materias: [
            { id: "MAT3", n: "Matemática 3", c: 6, a: "Básicas", reqCurso: ["MAT2"], reqExamen: ["MAT1"] },
            { id: "FIS2", n: "Física 2", c: 6, a: "Básicas", reqCurso: ["FIS1", "MAT2"], reqExamen: ["MAT1"] },
            { id: "TC2", n: "Teoría de Circuitos 2", c: 7, a: "Eléctrica", reqCurso: ["TC1", "MAT2"], reqExamen: ["MAT1"] },
            { id: "ME1", n: "Mecánica 1", c: 6, a: "Mecánica", reqCurso: ["FIS1", "CAD"] },
            { id: "DIG1", n: "Electrónica Digital 1", c: 7, a: "Electrónica", reqCurso: ["TC1"] }
        ]},
        { sem: 4, materias: [
            { id: "EST", n: "Probabilidad y Estadística", c: 6, a: "Básicas", reqCurso: ["MAT2"] },
            { id: "FIS3", n: "Física 3", c: 6, a: "Básicas", reqCurso: ["FIS2"], reqExamen: ["FIS1"] },
            { id: "ANA1", n: "Electrónica Analógica 1", c: 7, a: "Electrónica", reqCurso: ["TC2", "DIG1"] },
            { id: "ME2", n: "Mecánica 2", c: 6, a: "Mecánica", reqCurso: ["ME1"] },
            { id: "PI2", n: "Proyecto Integrador 2", c: 10, a: "Proyecto", reqExamen: ["PI1"] },
            { id: "EVC1", n: "Eval. Competencias (Tec.)", c: 0, a: "Hito", reqExamen: ["PI1"] }
        ]},
        { sem: 5, materias: [
            { id: "SIS1", n: "Sistemas de Control 1", c: 7, a: "Control", reqCurso: ["MAT3", "TC2"], reqExamen: ["MAT2"] },
            { id: "MICR", n: "Microcontroladores", c: 7, a: "Electrónica", reqCurso: ["DIG1"], reqExamen: ["PROG1"] },
            { id: "MET", n: "Metrología", c: 4, a: "Mecánica", reqCurso: ["FIS1"] },
            { id: "TER", n: "Termodinámica", c: 6, a: "Mecánica", reqCurso: ["FIS2", "QUI"] },
            { id: "ING2", n: "Inglés 2", c: 3, a: "Idiomas", reqExamen: ["ING1"] }
        ]},
        { sem: 6, materias: [
            { id: "SIS2", n: "Sistemas de Control 2", c: 7, a: "Control", reqCurso: ["SIS1"], reqExamen: ["MAT3"] },
            { id: "INST", n: "Instrumentación", c: 7, a: "Control", reqCurso: ["ANA1", "SIS1"] },
            { id: "MAQ", n: "Máquinas Eléctricas", c: 7, a: "Eléctrica", reqCurso: ["TC2", "FIS2"] },
            { id: "PI3", n: "Proyecto Integrador 3", c: 20, a: "Proyecto", reqExamen: ["PI2", "EVC1"] },
            { id: "EVC2", n: "Eval. Comp. (Final Tec.)", c: 0, a: "Hito", reqExamen: ["PI2", "EVC1"] }
        ]},
        { sem: 7, materias: [
            { id: "AUT1", n: "Automatización Ind. 1", c: 8, a: "Control", reqCurso: ["SIS1", "MICR"] },
            { id: "POT", n: "Electrónica de Potencia", c: 7, a: "Electrónica", reqCurso: ["ANA1", "TC2"] },
            { id: "HID", n: "Hidráulica y Neumática", c: 6, a: "Mecánica", reqCurso: ["TER", "ME1"] },
            { id: "GEST", n: "Gestión de Proyectos", c: 5, a: "Gestión" },
            { id: "ING3", n: "Inglés 3", c: 3, a: "Idiomas", reqExamen: ["ING2"] }
        ]},
        { sem: 8, materias: [
            { id: "AUT2", n: "Automatización Ind. 2", c: 8, a: "Control", reqCurso: ["AUT1"] },
            { id: "ROB", n: "Robótica Industrial", c: 8, a: "Control", reqCurso: ["SIS2", "ME2"] },
            { id: "MAN", n: "Mantenimiento Industrial", c: 5, a: "Mecánica", reqCurso: ["TDM1"] },
            { id: "PI4", n: "Proyecto Integrador 4", c: 10, a: "Proyecto", reqExamen: ["PI3"] }
        ]},
        { sem: 9, materias: [
            { id: "OPT1", n: "Electiva / Optativa 1", c: 8, a: "Especialización" },
            { id: "OPT2", n: "Electiva / Optativa 2", c: 8, a: "Especialización" },
            { id: "SEG", n: "Seguridad e Higiene", c: 4, a: "Transversal" },
            { id: "ETI", n: "Ética Profesional", c: 4, a: "Transversal" },
            { id: "ING4", n: "Inglés 4", c: 3, a: "Idiomas", reqExamen: ["ING3"] }
        ]},
        { sem: 10, materias: [
            { id: "PFC", n: "Proyecto Final de Carrera", c: 40, a: "Proyecto", reqExamen: ["PI4", "EVC2"] },
            { id: "PAS", n: "Pasantía Profesional", c: 10, a: "Práctica", reqExamen: ["PI4", "EVC2"] },
            { id: "EVC3", n: "Eval. Comp. (Egreso)", c: 0, a: "Hito", reqExamen: ["PFC"] }
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
                    alert('🔒 No puedes acceder a esta materia. Te falta:\n' + faltanTextos.join('\n'));
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
