const basesDeDatos = {
    "imec_2023": [
        { sem: 1, materias: [
            { id: "MAT1", n: "Matemática 1", c: 6, a: "Básicas" },
            { id: "QUI", n: "Química", c: 6, a: "Básicas" }, // ¡Aquí está!
            { id: "PROG1", n: "Programación 1", c: 8, a: "Informática" },
            { id: "IME", n: "Introd. a la Mecatrónica", c: 4, a: "Mecánica" },
            { id: "COE", n: "Comun. Oral y Escrita", c: 4, a: "Transversal" },
            { id: "ING1", n: "Inglés 1", c: 3, a: "Idiomas" }
        ]},
        { sem: 2, materias: [
            { id: "MAT2", n: "Matemática 2", c: 6, a: "Básicas" },
            { id: "FIS1", n: "Física 1", c: 6, a: "Básicas" },
            { id: "TC1", n: "Teoría de Circuitos 1", c: 7, a: "Eléctrica" },
            { id: "CAD", n: "Dibujo (CAD)", c: 5, a: "Mecánica" },
            { id: "PI1", n: "Proyecto Integrador 1", c: 10, a: "Proyecto" }
        ]},
        { sem: 3, materias: [
            { id: "MAT3", n: "Matemática 3", c: 6, a: "Básicas" },
            { id: "FIS2", n: "Física 2", c: 6, a: "Básicas" },
            { id: "TC2", n: "Teoría de Circuitos 2", c: 7, a: "Eléctrica" },
            { id: "ME1", n: "Mecánica 1", c: 6, a: "Mecánica" },
            { id: "DIG1", n: "Electrónica Digital 1", c: 7, a: "Electrónica" }
        ]},
        { sem: 4, materias: [
            { id: "EST", n: "Probabilidad y Estadística", c: 6, a: "Básicas" },
            { id: "FIS3", n: "Física 3", c: 6, a: "Básicas" },
            { id: "ANA1", n: "Electrónica Analógica 1", c: 7, a: "Electrónica" },
            { id: "ME2", n: "Mecánica 2", c: 6, a: "Mecánica" },
            { id: "PI2", n: "Proyecto Integrador 2", c: 10, a: "Proyecto" },
            { id: "EVC1", n: "Eval. Competencias (Tec.)", c: 0, a: "Hito" }
        ]},
        { sem: 5, materias: [
            { id: "SIS1", n: "Sistemas de Control 1", c: 7, a: "Control" },
            { id: "MICR", n: "Microcontroladores", c: 7, a: "Electrónica" },
            { id: "MET", n: "Metrología", c: 4, a: "Mecánica" },
            { id: "TER", n: "Termodinámica", c: 6, a: "Mecánica" },
            { id: "ING2", n: "Inglés 2", c: 3, a: "Idiomas" }
        ]},
        { sem: 6, materias: [
            { id: "SIS2", n: "Sistemas de Control 2", c: 7, a: "Control" },
            { id: "INST", n: "Instrumentación", c: 7, a: "Control" },
            { id: "MAQ", n: "Máquinas Eléctricas", c: 7, a: "Eléctrica" },
            { id: "PI3", n: "Proyecto Integrador 3", c: 20, a: "Proyecto" },
            { id: "EVC2", n: "Eval. Competencias (Final Tec.)", c: 0, a: "Hito" }
        ]},
        { sem: 7, materias: [
            { id: "AUT1", n: "Automatización Ind. 1", c: 8, a: "Control" },
            { id: "POT", n: "Electrónica de Potencia", c: 7, a: "Electrónica" },
            { id: "HID", n: "Hidráulica y Neumática", c: 6, a: "Mecánica" },
            { id: "GEST", n: "Gestión de Proyectos", c: 5, a: "Gestión" },
            { id: "ING3", n: "Inglés 3", c: 3, a: "Idiomas" }
        ]},
        { sem: 8, materias: [
            { id: "AUT2", n: "Automatización Ind. 2", c: 8, a: "Control" },
            { id: "ROB", n: "Robótica Industrial", c: 8, a: "Control" },
            { id: "MAN", n: "Mantenimiento Industrial", c: 5, a: "Mecánica" },
            { id: "PI4", n: "Proyecto Integrador 4", c: 10, a: "Proyecto" }
        ]},
        { sem: 9, materias: [
            { id: "OPT1", n: "Electiva / Optativa 1", c: 8, a: "Especialización" },
            { id: "OPT2", n: "Electiva / Optativa 2", c: 8, a: "Especialización" },
            { id: "SEG", n: "Seguridad e Higiene", c: 4, a: "Transversal" },
            { id: "ETI", n: "Ética Profesional", c: 4, a: "Transversal" },
            { id: "ING4", n: "Inglés 4", c: 3, a: "Idiomas" }
        ]},
        { sem: 10, materias: [
            { id: "PFC", n: "Proyecto Final de Carrera", c: 40, a: "Proyecto" },
            { id: "PAS", n: "Pasantía Profesional", c: 10, a: "Práctica" },
            { id: "EVC3", n: "Eval. Competencias (Egreso)", c: 0, a: "Hito" }
        ]}
    ]
};

let creditosAcumulados = 0;

function renderMalla(carreraId) {
    const container = document.getElementById('malla-container');
    if (!container) return;
    container.innerHTML = '';
    creditosAcumulados = 0;
    actualizarContador();

    const plan = basesDeDatos[carreraId];

    plan.forEach(semestre => {
        const semDiv = document.createElement('div');
        semDiv.className = 'semestre';
        semDiv.innerHTML = `<h3>Semestre ${semestre.sem}</h3>`;

        semestre.materias.forEach(mat => {
            const matDiv = document.createElement('div');
            matDiv.className = 'materia';
            matDiv.innerHTML = `
                <span class="area-tag">${mat.a}</span>
                <span class="materia-name">${mat.n}</span>
                <div class="materia-info">
                    <span>${mat.c} Créditos</span>
                    <span>${mat.id}</span>
                </div>
            `;
            
            matDiv.addEventListener('click', () => {
                matDiv.classList.toggle('aprobada');
                creditosAcumulados += matDiv.classList.contains('aprobada') ? mat.c : -mat.c;
                actualizarContador();
            });

            semDiv.appendChild(matDiv);
        });
        container.appendChild(semDiv);
    });
}

function actualizarContador() {
    const el = document.getElementById('creditos-count');
    if (el) el.innerText = creditosAcumulados;
}

window.onload = () => renderMalla('imec_2023');
