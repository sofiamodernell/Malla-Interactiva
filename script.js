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
            { id: "MAT2", n: "Matemática 2", c: 6, a: "Básicas", req: ["MAT1"] },
            { id: "FIS1", n: "Física 1", c: 6, a: "Básicas" },
            { id: "TC1", n: "Teoría de Circuitos 1", c: 7, a: "Eléctrica", req: ["MAT1"] },
            { id: "CAD", n: "Dibujo (CAD)", c: 5, a: "Mecánica" },
            { id: "TDM1", n: "Tecnología de Materiales", c: 6, a: "Mecánica" },
            { id: "PI1", n: "Proyecto Integrador 1", c: 10, a: "Proyecto", req: ["IME", "PROG1"] }
        ]},
        { sem: 3, materias: [
            { id: "MAT3", n: "Matemática 3", c: 6, a: "Básicas", req: ["MAT2"] },
            { id: "FIS2", n: "Física 2", c: 6, a: "Básicas", req: ["FIS1", "MAT2"] },
            { id: "TC2", n: "Teoría de Circuitos 2", c: 7, a: "Eléctrica", req: ["TC1"] },
            { id: "ME1", n: "Mecánica 1", c: 6, a: "Mecánica", req: ["FIS1"] },
            { id: "DIG1", n: "Electrónica Digital 1", c: 7, a: "Electrónica", req: ["PROG1", "TC1"] }
        ]},
        { sem: 4, materias: [
            { id: "EST", n: "Probabilidad y Estadística", c: 6, a: "Básicas", req: ["MAT2"] },
            { id: "FIS3", n: "Física 3", c: 6, a: "Básicas", req: ["FIS2"] },
            { id: "ANA1", n: "Electrónica Analógica 1", c: 7, a: "Electrónica", req: ["TC2"] },
            { id: "ME2", n: "Mecánica 2", c: 6, a: "Mecánica", req: ["ME1"] },
            { id: "PI2", n: "Proyecto Integrador 2", c: 10, a: "Proyecto", req: ["PI1"] },
            { id: "EVC1", n: "Eval. Competencias (Tec.)", c: 0, a: "Hito" }
        ]},
        { sem: 5, materias: [
            { id: "SIS1", n: "Sistemas de Control 1", c: 7, a: "Control", req: ["MAT3", "TC2"] },
            { id: "MICR", n: "Microcontroladores", c: 7, a: "Electrónica", req: ["DIG1"] },
            { id: "MET", n: "Metrología", c: 4, a: "Mecánica", req: ["FIS1"] },
            { id: "TER", n: "Termodinámica", c: 6, a: "Mecánica", req: ["FIS2", "QUI"] },
            { id: "ING2", n: "Inglés 2", c: 3, a: "Idiomas", req: ["ING1"] }
        ]},
        { sem: 6, materias: [
            { id: "SIS2", n: "Sistemas de Control 2", c: 7, a: "Control", req: ["SIS1"] },
            { id: "INST", n: "Instrumentación", c: 7, a: "Control", req: ["ANA1"] },
            { id: "MAQ", n: "Máquinas Eléctricas", c: 7, a: "Eléctrica", req: ["TC2", "FIS2"] },
            { id: "PI3", n: "Proyecto Integrador 3", c: 20, a: "Proyecto", req: ["PI2"] },
            { id: "EVC2", n: "Eval. Competencias (Final Tec.)", c: 0, a: "Hito", req: ["EVC1"] }
        ]},
        { sem: 7, materias: [
            { id: "AUT1", n: "Automatización Ind. 1", c: 8, a: "Control", req: ["SIS1", "MICR"] },
            { id: "POT", n: "Electrónica de Potencia", c: 7, a: "Electrónica", req: ["ANA1"] },
            { id: "HID", n: "Hidráulica y Neumática", c: 6, a: "Mecánica", req: ["TER"] },
            { id: "GEST", n: "Gestión de Proyectos", c: 5, a: "Gestión" },
            { id: "ING3", n: "Inglés 3", c: 3, a: "Idiomas", req: ["ING2"] }
        ]},
        { sem: 8, materias: [
            { id: "AUT2", n: "Automatización Ind. 2", c: 8, a: "Control", req: ["AUT1"] },
            { id: "ROB", n: "Robótica Industrial", c: 8, a: "Control", req: ["SIS2", "ME2"] },
            { id: "MAN", n: "Mantenimiento Industrial", c: 5, a: "Mecánica", req: ["TDM1"] },
            { id: "PI4", n: "Proyecto Integrador 4", c: 10, a: "Proyecto", req: ["PI3"] }
        ]},
        { sem: 9, materias: [
            { id: "OPT1", n: "Electiva / Optativa 1", c: 8, a: "Especialización" },
            { id: "OPT2", n: "Electiva / Optativa 2", c: 8, a: "Especialización" },
            { id: "SEG", n: "Seguridad e Higiene", c: 4, a: "Transversal" },
            { id: "ETI", n: "Ética Profesional", c: 4, a: "Transversal" },
            { id: "ING4", n: "Inglés 4", c: 3, a: "Idiomas", req: ["ING3"] }
        ]},
        { sem: 10, materias: [
            { id: "PFC", n: "Proyecto Final de Carrera", c: 40, a: "Proyecto", req: ["PI4"] },
            { id: "PAS", n: "Pasantía Profesional", c: 10, a: "Práctica" },
            { id: "EVC3", n: "Eval. Competencias (Egreso)", c: 0, a: "Hito", req: ["EVC2"] }
        ]}
    ]
};

let materiasAprobadas = new Set();
let carreraActual = "";

function renderMalla(carreraId) {
    carreraActual = carreraId;
    materiasAprobadas.clear(); // Reinicia progreso al cambiar de carrera
    dibujarInterfaz();
}

function dibujarInterfaz() {
    const container = document.getElementById('malla-container');
    if (!container) return;
    container.innerHTML = '';
    
    const plan = basesDeDatos[carreraActual];

    plan.forEach(semestre => {
        const semDiv = document.createElement('div');
        semDiv.className = 'semestre';
        semDiv.innerHTML = `<h3>Semestre ${semestre.sem}</h3>`;

        semestre.materias.forEach(mat => {
            const matDiv = document.createElement('div');
            matDiv.className = 'materia';
            matDiv.id = `mat-${mat.id}`;
            
            // Lógica de Previaturas (Bloqueo)
            let estaBloqueada = false;
            if (mat.req && mat.req.length > 0) {
                estaBloqueada = !mat.req.every(reqId => materiasAprobadas.has(reqId));
            }

            if (estaBloqueada) matDiv.classList.add('bloqueada');
            if (materiasAprobadas.has(mat.id)) matDiv.classList.add('aprobada');

            matDiv.innerHTML = `
                <span class="area-tag">${mat.a}</span>
                <span class="materia-name">${mat.n}</span>
                <div class="materia-info">
                    <span>${mat.c} Créditos</span>
                    <span>${mat.id}</span>
                </div>
            `;
            
            matDiv.addEventListener('click', () => {
                if (matDiv.classList.contains('bloqueada')) {
                    // Opcional: Podrías poner una alerta aquí tipo alert("Debes aprobar las previas primero");
                    return; 
                }

                if (materiasAprobadas.has(mat.id)) {
                    materiasAprobadas.delete(mat.id);
                    // Si desapruebas una, deberíamos reevaluar para bloquear las siguientes
                } else {
                    materiasAprobadas.add(mat.id);
                }
                actualizarEstadoGeneral();
            });

            semDiv.appendChild(matDiv);
        });
        container.appendChild(semDiv);
    });
    
    actualizarContador();
}

function actualizarEstadoGeneral() {
    // Redibuja toda la malla para que los candados se actualicen dinámicamente
    dibujarInterfaz();
}

function actualizarContador() {
    let totalCreditos = 0;
    const plan = basesDeDatos[carreraActual];
    
    plan.forEach(sem => {
        sem.materias.forEach(mat => {
            if (materiasAprobadas.has(mat.id)) {
                totalCreditos += mat.c;
            }
        });
    });
    
    const el = document.getElementById('creditos-count');
    if (el) el.innerText = totalCreditos;
}

window.onload = () => renderMalla('imec_2023');
