import { Semestre, SCPConfig } from './types';

export const nombresCarreras: Record<string, { titulo: string; subtitulo: string; logo?: string }> = {
  "imec_2023": { 
    titulo: "IMEC_PLAN_2023", 
    subtitulo: "INGENIERÍA_MECATRÓNICA // UTEC",
    logo: "imec_logo.jpg"
  },
  "ibio_2021": { 
    titulo: "IBIO_PLAN_2021", 
    subtitulo: "INGENIERÍA_BIOMÉDICA // UTEC",
    logo: "ibio_logo.jpg" // Placeholder o logo de IBIO si existe
  }
};

export const basesDeDatos: Record<string, Semestre[]> = {
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
      { id: "ING2", n: "Inglés 2", c: 4, a: "Idiomas", reqExamen:["ING1"] },
      { id: "PE2", n: "Programas Especiales 2", c: 2, a: "Otro", reqExamen:["PE1"] }
    ]},
    { sem: 3, materias: [
      { id: "MAT3", n: "Matemática 3", c: 8, a: "Básicas", reqCurso: ["MAT2"], reqExamen: ["MAT1"] },
      { id: "PRG2", n: "Programación 2", c: 6, a: "Informática", reqCurso: ["FMIN"], reqExamen: ["PRG1"]},
      { id: "EALG", n: "Electrónica Analógica Aplicada 1", c: 6, a: "Electrónica", reqCurso: ["TDC2", "FIS1","MAT2"], reqExamen: ["MAT1", "TDC1"] },
      { id: "SLSO", n: "Seguridad Laboral y Salud Ocupacional", c: 5, a: "General", reqExamen: ["MAT1","QMCA","INTM","COES","PRG1","TDC1"] },
      { id: "DIES", n: "Dinámica y Estática", c: 7, a: "Mecánica" ,reqCurso: ["FIS1"], reqExamen: ["INTM"]},
      { id: "EDG1", n: "Electrónica Digital 1", c: 7, a: "Electrónica", reqCurso: ["FMIN"], reqExamen: ["TDC1"] },
      { id: "ING3", n: "Inglés 3", c: 4, a: "Idiomas", reqExamen:["ING2"] },
      { id: "PE3", n: "Programas Especiales 3", c: 2, a: "Otro", reqExamen:["PE2"]}
    ]},
    { sem: 4, materias: [
      { id: "TMPR", n: "Tecnologías de Microprocesamiento", c: 7, a: "Electrónica", reqCurso: ["EDG1"], reqExamen: ["FMIN"] },
      { id: "PRG3", n: "Programación 3", c: 7, a: "Informática", reqCurso: ["PRG1","MAT1"] },
      { id: "MEM1", n: "Materiales y Elementos de Maquinas 1", c: 6, a: "Mecánica", reqCurso: ["DIES"], reqExamen: ["FMIN"] },
      { id: "FIS2", n: "Física 2", c: 7, a: "Básicas", reqExamen: ["MAT1", "FMIN","FIS1"] },
      { id: "AEIN", n: "Aplicaciones Electro Industriales", c: 6, a: "Electrónica", reqCurso: ["EALG"], reqExamen: ["TDC2", "FMIN"] },
      { id: "PIC2", n: "Proyecto Integrador de Competencias 2", c: 3, a: "Competencias", reqCurso: ["TMPR","PRG3","MEM1","AEIN"], reqExamen:["PIC1"] },
      { id: "ING4", n: "Inglés 4", c: 4, a: "Idiomas", reqExamen:["ING3"] },
      { id: "PE4", n: "Programas Especiales 4", c: 2, a: "Otro", reqExamen:["PE3"] }
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
      { id: "ING5", n: "Inglés 5", c: 4, a: "Idiomas", reqExamen:["ING4"] },
      { id: "PE5", n: "Programas Especiales 5", c: 2, a: "Otro", reqExamen:["PE4"] }
    ]},
    { sem: 6, materias: [
      { id: "EDG2", n: "Electrónica Digital 2", c: 7, a: "Electrónica", reqExamen: ["EALG","EDG1"] },
      { id: "HYNE", n: "Hidráulica y Neumática", c: 7, a: "Mecánica", reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ] },
      { id: "AUTM", n: "Automatización", c: 7, a: "Telemática", reqCurso: ["TIND", "INSC"], reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ] },
      { id: "TDCR", n: "Tecnologías de Control y Robótica", c: 7, a: "Mecatrónical", reqCurso: ["INSC"] },
      { id: "IMEL", n: "Instrumentación y Medidas Eléctricas", c: 7, a: "Electrónica", reqCurso: ["MAEL", "INSC"], reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ]  },
      { id: "PIND", n: "Procesos Industriales", c: 5, a: "Soporte", reqExamen: ["TMPR","PRG3","MEM1","FIS2","AEIN","PIC2" ] },
      { id: "PFTM", n: "Proyecto Final de Tecnólogo", c: 5, a: "Competencias", reqExamen: ["APTM"] },
      { id: "ING6", n: "Inglés 6", c: 4, a: "Idiomas", reqExamen:["ING5"] },
      { id: "PE6", n: "Programas Especiales 6", c: 2, a: "Otro" , reqExamen:["PE5"]}
    ]},
    { sem: 7, materias: [
      { id: "MAT4", n: "Matemática 4", c: 8, a: "Básicas", reqExamen: ["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
      { id: "EPOT", n: "Electrónica de Potencia", c: 7, a: "Electrónica", reqCurso: ["TDCR", "IMEL"], reqExamen: ["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"] },
      { id: "MEM2", n: "Materiales y Elementos de Maquinas 2", c: 6, a: "Mecánica", reqExamen:["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
      { id: "GPYE", n: "Gestión de Proyectos y Emprendimientos", c: 4, a: "General", reqExamen:["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"] },
      { id: "SEMB", n: "Sistemas Embebidos", c: 6, a: "Telemática" , reqCurso: ["TDCR"], reqExamen:["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
      { id: "TCYF", n: "Transferencia de Calor y Fluidos", c: 6, a: "Mecánica", reqExamen: ["MAEL","TIND","INSC","FIS3","LEGL","APTM","PFAB","PPCU"]},
      { id: "ING7", n: "Inglés 7", c: 4, a: "Idiomas", reqExamen:["ING6"] },
      { id: "PE7", n: "Programas Especiales 7", c: 2, a: "Otro", reqExamen:["PE6"]}
    ]},
    { sem: 8, materias: [
      { id: "PYES", n: "Probabilidad y Estadística", c: 5, a: "Básicas", reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"] },
      { id: "MNPI", n: "Métodos Númericos para Ingeniería", c: 7, a: "Soporte", reqCurso: ["MAT4"], reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
      { id: "PRDS", n: "Procesamiento de Señales", c: 7, a: "Telemática", reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
      { id: "MDSA", n: "Mantenimiento de Sistemas Automaizados", c: 6, a: "Mecánica", reqCurso: ["SEMB"], reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
      { id: "SCAP", n: "Sistemas de Control Aplicados ", c: 7, a: "Mecatrónica", reqCurso: ["EPOT"], reqExamen:["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"]},
      { id: "TDM2", n: "Tecnologías de Materiales 2", c: 6, a: "Mecánica", reqExamen: ["EDG2","HYNE","AUTM","TDCR","IMEL","PIND","PFTM"] },
      { id: "ING8", n: "Inglés 8", c: 4, a: "Idiomas", reqExamen:["ING7"] },
      { id: "PE8", n: "Programas Especiales 8", c: 2, a: "Otro", reqExamen:["PE7"] }
    ]},
    { sem: 9, materias: [
      { id: "DMEC", n: "Diseño Mecatónico", c: 7, a: "Mecatrónica", reqCurso: ["SCAP","MDSA"], reqExamen: ["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"] },
      { id: "RBIN", n: "Robótica Industrial ", c: 7, a: "Mecatrónica", reqCurso: ["SCAP"] , reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"]},
      { id: "MIAC", n: "Manufactura Asistida por Computador ", c: 5, a: "Soporte", reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"] },
      { id: "CPIN", n: "Costos para Ingeniería ", c: 5, a: "Soporte" , reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"]},
      { id: "OPT1", n: "Optativa 1", c: 6, a: "Optativa", reqExamen:["TCYF","MAT4","EPOT","MEM2","GPYE","SEMB"] },
      { id: "PFG1", n: "Proyecto Final de Grado 1", c: 8, a: "Competencias" , reqExamen:["PYES","MNPI","PRDS","MDSA","SCAP","TDM2"]},
      { id: "ING9", n: "Inglés 9", c: 4, a: "Idiomas", reqExamen:["ING8"] },
      { id: "PE9", n: "Programas Especiales 9", c: 2, a: "Otro", reqExamen:["PE8"] }
    ]},
    { sem: 10, materias: [
      { id: "GCAL", n: "Gestion de Calidad", c: 5, a: "Soporte" , reqExamen:["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"]},
      { id: "GIAM", n: "Gestion de Impacto Ambiental ", c: 5, a: "Soporte" , reqExamen:["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"]},
      { id: "SICF", n: "Sistemas Inteligentes y Ciberfísicos", c: 7, a: "Mecatrónica", reqExamen: ["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"] },
      { id: "OPT2", n: "Optativa 2", c: 6, a: "Optativa", reqExamen: ["TDM2","PYES","MNPI","PRDS","MDSA","SCAP"]},
      { id: "PFG2", n: "Proyecto Final de Grado 2", c: 8, a: "Competencias", reqExamen: ["TDM2","PYES","MNPI","PRDS","SCAP","MDSA","OPT1","CPIN","MIAC","PFG1"] },
      { id: "ING10", n: "Inglés 10", c: 4, a: "Idiomas", reqExamen:["ING9"] },
      { id: "PE10", n: "Programas Especiales 10", c: 2, a: "Otro", reqExamen:["PE9"] }
    ]}
  ],
    
  "ibio_2021": [
      { sem: 1, materias: [
      { id: "AAGA_IBIO", n: "Álgebra, Análisis y Geometría Analítica", c: 8, a: "Básicas" },
      { id: "MEC_IBIO", n: "Mecánica, Ondas y Calor", c: 10, a: "Básicas" },
      { id: "QGI_IBIO", n: "Química General e Inorgánicа", c: 9, a: "Básicas"},
      { id: "TIT1_IBIO", n: "Taller Inicial de Tecnologías I", c: 0, a: "",anualId: "TIT_IBIO"},
      { id: "SS_IBIO", n: "Salud & Sociedad", c: 8, a: ""},
      { id: "ING1_IBIO", n: "Inglés 1", c: 4, a: "Idiomas"},
      { id: "PE1_IBIO", n: "Programas Especiales 1", c: 2, a: "Otro"}
    ]},
    { sem: 2, materias: [
      { id: "NCEA_IBIO", n: "Números Complejos y Ecuaciones Diferenciales", c: 8, a: "Básicas", reqCurso: ["AAGA_IBIO"] },
      { id: "EMAG_IBIO", n: "Electricidad y Magnetismo", c: 10, a: "Básicas", reqCurso: ["AAGA_IBIO", "MEC_IBIO"] },
      { id: "QOB_IBIO", n: "Química Orgánica y Biológica", c: 9, a: "Básicas", reqCurso: ["QGI_IBIO"] },
      { id: "TIT2_IBIO", n: "Taller Inicial de Tecnologías II", c: 8, a: "General", anualId: "TIT_IBIO", reqCurso: ["TIT1_IBIO"] },
      { id: "AFH_IBIO", n: "Anatomía y Fisiología Humanas", c: 10, a: "", reqCurso: ["SS_IBIO", "MEC_IBIO"] },
      { id: "ING2_IBIO", n: "Inglés 2", c: 4, a: "Idiomas", reqExamen: ["ING1_IBIO"] },
      { id: "PE2_IBIO", n: "Programas Especiales 2", c: 2, a: "Otros", reqExamen: ["PE1_IBIO"] }
    ]},
    { sem: 3, materias: [
      { id: "RADI_IBIO", n: "Óptica y Radiaciones", c: 10, a: "", reqCurso: ["AAGA_IBIO", "MEC_IBIO"] },
      { id: "EANA_IBIO", n: "Electrónica Analógica", c: 10, a: "Electrónica", reqCurso: ["NCEA_IBIO", "EMAG_IBIO", "TIT1_IBIO", "TIT2_IBIO"] },
      { id: "ETEC_IBIO", n: "Electrotecnia", c: 9, a: "Electrónica", reqCurso: ["EMAG_IBIO"] },
      { id: "IHOS_IBIO", n: "Instalaciones Hospitalarias", c: 9, a: "General", reqCurso: [ "QGI_IBIO","EMAG_IBIO", "AFH_IBIO"] },
      { id: "PRG_IBIO", n: "Programación de Computadoras", c: 8, a: "Informática", reqCurso: ["AAGA_IBIO"] },
      { id: "ING3_IBIO", n: "Inglés 3", c: 4, a: "Idiomas", reqExamen: ["ING2_IBIO"] },
      { id: "PE3_IBIO", n: "Programas Especiales 3", c: 2, a: "Otros", reqExamen: ["PE2_IBIO"] }
    ]},
    { sem: 4, materias: [
      { id: "EFIS_IBIO", n: "Electrofisiología Clínica", c: 10, a: "", reqCurso: ["AFH_IBIO", "EANA_IBIO"] },
      { id: "EDIG_IBIO", n: "Electrónica Digital", c: 10, a: "Electrónica", reqCurso: ["EANA_IBIO"] },
      { id: "MMM_IBIO", n: "Mecánica, Máquinas y Materiales", c: 9, a: "Mecánica", reqCurso: ["AAGA_IBIO", "MEC_IBIO"] },
      { id: "IMED_IBIO", n: "Imágenes Médicas", c: 10, a: "General", reqCurso: ["RADI_IBIO", "AFH_IBIO"] },
      { id: "PPC_A1", n: "PPC A (Internado Rot.) I", c: 0, a: "Competencias", anualId: "PPC_A", reqCurso: ["AAGA_IBIO","MEC_IBIO","QGI_IBIO","TIT1_IBIO", "SS_IBIO","NCEA_IBIO","EMAG_IBIO","QOB_IBIO","TIT2_IBIO","AFH_IBIO", "RADI_IBIO","EANA_IBIO","ETEC_IBIO", "PRG_IBIO"], reqExamen: ["IHOS_IBIO"]},
      { id: "ING4_IBIO", n: "Inglés 4", c: 4, a: "Idiomas", reqExamen: ["ING3_IBIO"] },
      { id: "PE4_IBIO", n: "Programas Especiales 4", c: 2, a: "Otros", reqExamen: ["PE3_IBIO"] }
    ]},    
    { sem: 5, materias: [
      { id: "SERA_IBIO", n: "Seguridad Eléctrica y Radiante", c: 10, a: "General", reqCurso: ["ETEC_IBIO", "IHOS_IBIO", "EFIS_IBIO","IMED_IBIO"] },
      { id: "NEMA_IBIO", n: "Normativa sobre Equipamiento Médico", c: 8, a: "General", reqCurso: ["ETEC_IBIO", "IHOS_IBIO", "EFIS_IBIO","IMED_IBIO"] },
      { id: "TMEM_IBIO", n: "Taller Mantenimiento de Equipos Médicos", c: 10, a: "Soporte", reqCurso: ["ETEC_IBIO", "IHOS_IBIO", "EFIS_IBIO","MMM_IBIO","IMED_IBIO" ] },
      { id: "MAV1_IBIO", n: "Matemática Avanzada I", c: 9, a: "Básicas", reqCurso: ["NCEA_IBIO","PRG_IBIO"] },
      { id: "PPC_A2", n: "PPC A (Internado Rot.) II", c: 12, a: "Competencias", anualId: "PPC_A", reqCurso: ["AAGA_IBIO","MEC_IBIO","QGI_IBIO","TIT1_IBIO", "SS_IBIO","NCEA_IBIO","EMAG_IBIO","QOB_IBIO","TIT2_IBIO","AFH_IBIO", "RADI_IBIO","EANA_IBIO","ETEC_IBIO", "PRG_IBIO"], reqExamen: ["IHOS_IBIO"] },
      { id: "ING5_IBIO", n: "Inglés 5", c: 4, a: "Idiomas", reqExamen: ["ING4_IBIO"] },
      { id: "PE5_IBIO", n: "Programas Especiales 5", c: 2, a: "Otros", reqExamen: ["PE4_IBIO"] }
    ]},
    { sem: 6, materias: [
      { id: "ILC_IBIO", n: "Instrumental de Laboratorio Clínico", c: 9, a: "General", reqCurso: ["QOB_IBIO", "IHOS_IBIO"] },
      { id: "IMED2_IBIO", n: "Informática Médica", c: 8, a: "Informática", reqCurso: ["PRG_IBIO", "EFIS_IBIO","IMED_IBIO"] },
      { id: "IMC_IBIO", n: "Instrumentación Médica Complemplementaria", c: 10, a: "General", reqCurso: ["ETEC_IBIO", "IHOS_IBIO", "EFIS_IBIO","IMED_IBIO"] },
      { id: "MAV2_IBIO", n: "Matemática Avanzada II", c: 9, a: "Básicas", reqCurso: ["MAV1_IBIO"] },
      { id: "FAV_IBIO", n: "Física Avanzada", c: 8, a: "Básicas", reqCurso: ["RADI_IBIO","ETEC_IBIO"] },
      { id: "PFT_IBIO", n: "Proyecto Final Tecnólogo", c: 8, a: "Competencias", reqExamen: ["AAGA_IBIO","MEC_IBIO","QGI_IBIO","TIT1_IBIO", "SS_IBIO","NCEA_IBIO","EMAG_IBIO","QOB_IBIO","TIT2_IBIO","AFH_IBIO", "RADI_IBIO","EANA_IBIO","ETEC_IBIO", "PRG_IBIO","EFIS_IBIO","EDIG_IBIO","MMM_IBIO","IMED_IBIO","PPC_A1","SERA_IBIO","NEMA_IBIO","TMEM_IBIO","MAV1_IBIO","PPC_A2","ILC_IBIO","IMED2_IBIO","IMC_IBIO"]},
      { id: "ING6_IBIO", n: "Inglés 6", c: 4, a: "Idiomas", reqExamen: ["ING5_IBIO"] },
      { id: "PE6_IBIO", n: "Programas Especiales 6", c: 2, a: "Otros", reqExamen: ["PE5_IBIO"] }
    ]},    
    { sem: 7, materias: [
      { id: "FIP_IBIO", n: "Fisiopatología", c: 9, a: "", reqCurso: ["ILC_IBIO","IMC_IBIO"] },
      { id: "RNI_IBIO", n: "Radiaciones No-ionizantes", c: 7, a: "", reqCurso: ["MAV1_IBIO","FAV_IBIO"] },
      { id: "PDA_IBIO", n: "Programación Digital Avanzada", c: 7, a: "Informática", reqCurso: ["IMED2_IBIO","MAV1_IBIO"] },
      { id: "LEGS_IBIO", n: "Legislación para la Salud", c: 5, a: "General" , reqCurso: [ "NEMA_IBIO","ILC_IBIO","IMED2_IBIO","IMC_IBIO"]},
      { id: "ECOS_IBIO", n: "Economía para la Salud", c: 5, a: "General", reqCurso: ["TMEM_IBIO","ILC_IBIO","IMED2_IBIO","IMC_IBIO"] },
      { id: "ING7_IBIO", n: "Inglés 7", c: 4, a: "Idiomas", reqExamen: ["ING6_IBIO"] },
      { id: "PE7_IBIO", n: "Programas Especiales 7", c: 2, a: "Otros", reqExamen: ["PE6_IBIO"] }
    ]},    
    { sem: 8, materias: [
      { id: "BEST_IBIO", n: "Bioestadística", c: 7, a: "Básicas", reqCurso: ["IMED2_IBIO"] },
      { id: "SSIS_IBIO", n: "Señales y Sistemas", c: 8, a: "Electrónica", reqCurso: ["EFIS_IBIO","EDIG_IBIO","MAV2_IBIO"] },
      { id: "BMBM_IBIO", n: "Biomecánica y Biomateriales", c: 7, a: "Mecánica", reqCurso: ["AFH_IBIO", "MMM_IBIO"] },
      { id: "MINV_IBIO", n: "Metodología de la Investigación", c: 5, a: "Soporte", reqCurso: ["FAV_IBIO","FIP_IBIO"] },
      { id: "HSAM_IBIO", n: "Higiene y Seguidad en Ambientes Hospitarios", c: 5, a: "Soporte", reqCurso:["FIP_IBIO","LEGS_IBIO"] },
      { id: "ING8_IBIO", n: "Inglés 8", c: 4, a: "Idiomas", reqExamen: ["ING7_IBIO"] },
      { id: "PE8_IBIO", n: "Programas Especiales 8", c: 2, a: "Otros", reqExamen: ["PE7_IBIO"] }
    ]},
    { sem: 9, materias: [
      { id: "RT_IBIO", n: "Radioterapia", c: 7, a: "", reqCurso: ["SERA_IBIO","FAV_IBIO","FIP_IBIO"] },
      { id: "GSAL_IBIO", n: "Gestión de Sist. de Salud", c: 9, a: "General", reqCurso: ["FIP_IBIO","LEGS_IBIO", "ECOS_IBIO","BEST_IBIO"] },
      { id: "ICB_IBIO", n: "Investigación Clínica y Bioética", c: 5, a: "Soporte", reqCurso: ["MINV_IBIO","HSAM_IBIO"] },
      { id: "UCE1_IBIO", n: "UC Electiva 1", c: 4, a: "Optativa"},
      { id: "UCE2_IBIO", n: "UC Electiva 2", c: 4, a: "Optativa"},
      { id: "PPCB1", n: "PPC B", c: 6, a: "Competencias", anualId: "PPC_B", reqCurso: ["AAGA_IBIO","MEC_IBIO","QGI_IBIO","TIT1_IBIO", "SS_IBIO","NCEA_IBIO","EMAG_IBIO","QOB_IBIO","TIT2_IBIO","AFH_IBIO", "RADI_IBIO","EANA_IBIO","ETEC_IBIO", "PRG_IBIO","EFIS_IBIO","EDIG_IBIO","MMM_IBIO","IMED_IBIO","PPC_A1","SERA_IBIO","NEMA_IBIO","TMEM_IBIO","MAV1_IBIO","PPC_A2",    "ILC_IBIO","IMED2_IBIO","IMC_IBIO","MAV2_IBIO","FAV_IBIO","PFT_IBIO","FIP_IBIO","RNI_IBIO", "PDA_IBIO","LEGS_IBIO","ECOS_IBIO","BEST_IBIO","SSIS_IBIO","BMBM_IBIO","MINV_IBIO","HSAM_IBIO"]},
      { id: "ING9_IBIO", n: "Inglés 9", c: 4, a: "Idiomas", reqExamen: ["ING8_IBIO"] },
      { id: "PE9_IBIO", n: "Programas Especiales 9", c: 2, a: "Otros", reqExamen: ["PE8_IBIO"] }   
    ]},
    { sem: 10, materias: [
      { id: "TELE_IBIO", n: "Telesalud y Telemedicina", c: 8, a: "Telematica", reqCurso: ["GSAL_IBIO"]  },
      { id: "UCE3_IBIO", n: "UC Electiva 3", c: 4, a: "Optativa"},
      { id: "UCE4_IBIO", n: "UC Electiva 4", c: 4, a: "Optativa"},
      { id: "PFTI", n: "Proyecto Final Ingeniero", c: 8, a: "Competencias", anualId: "PFTI", reqExamen: ["AAGA_IBIO","MEC_IBIO","QGI_IBIO","TIT1_IBIO", "SS_IBIO","NCEA_IBIO","EMAG_IBIO","QOB_IBIO","TIT2_IBIO","AFH_IBIO", "RADI_IBIO","EANA_IBIO","ETEC_IBIO", "PRG_IBIO","EFIS_IBIO","EDIG_IBIO","MMM_IBIO","IMED_IBIO","PPC_A1","SERA_IBIO","NEMA_IBIO","TMEM_IBIO","MAV1_IBIO","PPC_A2",    "ILC_IBIO","IMED2_IBIO","IMC_IBIO","MAV2_IBIO","FAV_IBIO","PFT_IBIO","FIP_IBIO","RNI_IBIO", "PDA_IBIO","LEGS_IBIO","ECOS_IBIO","BEST_IBIO","SSIS_IBIO","BMBM_IBIO","MINV_IBIO","HSAM_IBIO","TELE_IBIO","UCE1_IBIO","UCE2_IBIO","UCE3_IBIO","UCE4_IBIO"]  },
      { id: "ING10_IBIO", n: "Inglés 10", c: 4, a: "Idiomas", reqExamen: ["ING9_IBIO"] },
      { id: "PE10_IBIO", n: "Programas Especiales 10", c: 2, a: "Otros", reqExamen: ["PE9_IBIO"] }
    ]}
    ]
};

export const configuracionSCP: Record<string, SCPConfig> = {
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
