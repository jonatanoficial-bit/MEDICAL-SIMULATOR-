import {FALLBACK_GOVERNANCE} from './fallback-governance.js';
import {FALLBACK_ACADEMY} from './fallback-academy.js';
import {FALLBACK_PHYSIOLOGY} from './fallback-physiology.js';
import {FALLBACK_ASSESSMENT} from './fallback-assessment.js';
import {FALLBACK_THERAPEUTICS} from './fallback-therapeutics.js';
import {FALLBACK_EMERGENCY} from './fallback-emergency.js';
import {FALLBACK_OUTPATIENT} from './fallback-outpatient.js';
import {FALLBACK_BRANCHING} from './fallback-branching.js';
// Fallback anti-quebra gerado a partir dos mesmos dados externos da build.
const FALLBACK_CONTENT = {
  "cases": [
    {
      "id": "hipertensao-1",
      "specialty": "clinica-medica",
      "patient": "Marcos Vinícius",
      "age": 34,
      "sex": "Masculino",
      "profession": "Analista de Sistemas",
      "complaint": "cefaleia frequente, cansaço e aperto no peito às vezes",
      "vitals": [
        [
          "PA",
          "128/82",
          "mmHg"
        ],
        [
          "FC",
          "88",
          "bpm"
        ],
        [
          "FR",
          "18",
          "irpm"
        ],
        [
          "TEMP.",
          "36,7",
          "°C"
        ],
        [
          "SpO₂",
          "98",
          "%"
        ]
      ],
      "correctQuestions": [
        "tempo dos sintomas",
        "histórico familiar",
        "dor em esforço"
      ],
      "correctExams": [
        "Eletrocardiograma (ECG)",
        "Perfil lipídico",
        "Glicemia de jejum"
      ],
      "correctProcedures": [
        "Aferir sinais vitais",
        "Exame físico geral",
        "Ausculta cardíaca"
      ],
      "diagnosis": "Hipertensão Arterial Estágio 1",
      "idealConduct": [
        "orientar estilo de vida",
        "monitorar pressão",
        "retorno ambulatorial"
      ],
      "xp": 160
    },
    {
      "id": "cefaleia-tensional",
      "specialty": "clinica-medica",
      "patient": "Patrícia Gomes",
      "age": 29,
      "sex": "Feminino",
      "profession": "Professora",
      "complaint": "dor de cabeça em aperto no fim do dia, sem febre e sem vômitos",
      "vitals": [
        [
          "PA",
          "118/76",
          "mmHg"
        ],
        [
          "FC",
          "78",
          "bpm"
        ],
        [
          "FR",
          "16",
          "irpm"
        ],
        [
          "TEMP.",
          "36,5",
          "°C"
        ],
        [
          "SpO₂",
          "99",
          "%"
        ]
      ],
      "correctQuestions": [
        "tempo dos sintomas",
        "estresse e sono",
        "sinais de alarme"
      ],
      "correctExams": [
        "Hemograma completo"
      ],
      "correctProcedures": [
        "Aferir sinais vitais",
        "Exame físico geral",
        "Avaliação neurológica"
      ],
      "diagnosis": "Cefaleia tensional",
      "idealConduct": [
        "analgesia simples",
        "higiene do sono"
      ],
      "xp": 130
    },
    {
      "id": "angina-estavel",
      "specialty": "cardiologia",
      "patient": "Ricardo Andrade",
      "age": 56,
      "sex": "Masculino",
      "profession": "Motorista",
      "complaint": "aperto no peito aos esforços que melhora ao repousar",
      "vitals": [
        [
          "PA",
          "142/88",
          "mmHg"
        ],
        [
          "FC",
          "92",
          "bpm"
        ],
        [
          "FR",
          "19",
          "irpm"
        ],
        [
          "TEMP.",
          "36,6",
          "°C"
        ],
        [
          "SpO₂",
          "97",
          "%"
        ]
      ],
      "correctQuestions": [
        "dor em esforço",
        "irradiação da dor",
        "fatores de risco"
      ],
      "correctExams": [
        "Eletrocardiograma (ECG)",
        "Troponina",
        "Perfil lipídico"
      ],
      "correctProcedures": [
        "Aferir sinais vitais",
        "Ausculta cardíaca",
        "Solicitar acesso venoso"
      ],
      "diagnosis": "Angina estável",
      "idealConduct": [
        "ECG seriado",
        "estratificação de risco",
        "encaminhar cardiologia"
      ],
      "xp": 190
    },
    {
      "id": "itu-nao-complicada",
      "specialty": "clinica-medica",
      "patient": "Vanessa Oliveira",
      "age": 38,
      "sex": "Feminino",
      "profession": "Gerente",
      "complaint": "ardência para urinar, aumento da frequência urinária e desconforto baixo ventre",
      "vitals": [
        [
          "PA",
          "116/74",
          "mmHg"
        ],
        [
          "FC",
          "84",
          "bpm"
        ],
        [
          "FR",
          "17",
          "irpm"
        ],
        [
          "TEMP.",
          "37,2",
          "°C"
        ],
        [
          "SpO₂",
          "99",
          "%"
        ]
      ],
      "correctQuestions": [
        "dor lombar",
        "febre recente",
        "gestação"
      ],
      "correctExams": [
        "Urina tipo 1",
        "Urocultura"
      ],
      "correctProcedures": [
        "Aferir sinais vitais",
        "Palpação abdominal"
      ],
      "diagnosis": "ITU não complicada",
      "idealConduct": [
        "antibioticoterapia guiada",
        "hidratação"
      ],
      "xp": 145
    },
    {
      "id": "refluxo-gastroesofagico",
      "specialty": "clinica-medica",
      "patient": "Carlos Eduardo",
      "age": 42,
      "sex": "Masculino",
      "profession": "Comerciante",
      "complaint": "queimação retroesternal após refeições, gosto amargo na boca e piora ao deitar",
      "vitals": [
        [
          "PA",
          "122/80",
          "mmHg"
        ],
        [
          "FC",
          "82",
          "bpm"
        ],
        [
          "FR",
          "17",
          "irpm"
        ],
        [
          "TEMP.",
          "36,6",
          "°C"
        ],
        [
          "SpO₂",
          "98",
          "%"
        ]
      ],
      "correctQuestions": [
        "tempo dos sintomas",
        "gatilhos alimentares",
        "sinais de alarme"
      ],
      "correctExams": [
        "Teste terapêutico IBP",
        "Endoscopia digestiva alta"
      ],
      "correctProcedures": [
        "Aferir sinais vitais",
        "Exame físico geral",
        "Palpação abdominal"
      ],
      "diagnosis": "Refluxo gastroesofágico",
      "idealConduct": [
        "inibidor de bomba de prótons",
        "evitar gatilhos alimentares",
        "retorno ambulatorial"
      ],
      "xp": 150
    },
    {
      "id": "dermatite-atopica",
      "specialty": "dermatologia",
      "patient": "Ana Clara",
      "age": 21,
      "sex": "Feminino",
      "profession": "Estudante",
      "complaint": "coceira recorrente com placas avermelhadas em dobras dos braços e pescoço",
      "vitals": [
        [
          "PA",
          "110/72",
          "mmHg"
        ],
        [
          "FC",
          "76",
          "bpm"
        ],
        [
          "FR",
          "16",
          "irpm"
        ],
        [
          "TEMP.",
          "36,4",
          "°C"
        ],
        [
          "SpO₂",
          "99",
          "%"
        ]
      ],
      "correctQuestions": [
        "tempo dos sintomas",
        "alergias e gatilhos",
        "uso de produtos na pele"
      ],
      "correctExams": [
        "Dermatoscopia",
        "Hemograma completo"
      ],
      "correctProcedures": [
        "Exame físico geral",
        "Avaliação dermatológica",
        "Orientação terapêutica"
      ],
      "diagnosis": "Dermatite atópica",
      "idealConduct": [
        "hidratação da pele",
        "corticoide tópico leve",
        "retorno ambulatorial"
      ],
      "xp": 140
    }
  ],
  "gameplay": {
    "exams": [
      "Hemograma completo",
      "Eletrocardiograma (ECG)",
      "Raio-X de tórax",
      "Glicemia de jejum",
      "Perfil lipídico",
      "Troponina",
      "Ureia e Creatinina",
      "TSH",
      "Urina tipo 1",
      "Urocultura",
      "Endoscopia digestiva alta",
      "Teste terapêutico IBP",
      "Dermatoscopia"
    ],
    "procedures": [
      "Aferir sinais vitais",
      "Exame físico geral",
      "Ausculta cardíaca",
      "Ausculta pulmonar",
      "Palpação abdominal",
      "Avaliação neurológica",
      "Solicitar acesso venoso",
      "Orientação terapêutica",
      "Avaliação dermatológica"
    ],
    "hypotheses": [
      "Hipertensão Arterial Estágio 1",
      "Angina estável",
      "Ansiedade",
      "Refluxo gastroesofágico",
      "Cefaleia tensional",
      "ITU não complicada",
      "Dermatite atópica"
    ],
    "conducts": [
      "orientar estilo de vida",
      "monitorar pressão",
      "retorno ambulatorial",
      "analgesia simples",
      "higiene do sono",
      "ECG seriado",
      "estratificação de risco",
      "antibioticoterapia guiada",
      "hidratação",
      "encaminhar cardiologia",
      "inibidor de bomba de prótons",
      "evitar gatilhos alimentares",
      "hidratação da pele",
      "corticoide tópico leve"
    ],
    "directedQuestions": [
      "tempo dos sintomas",
      "histórico familiar",
      "dor em esforço",
      "estresse e sono",
      "sinais de alarme",
      "irradiação da dor",
      "fatores de risco",
      "dor lombar",
      "febre recente",
      "gestação",
      "gatilhos alimentares",
      "alergias e gatilhos",
      "uso de produtos na pele"
    ],
    "schemaVersion": 1
  },
  "queue": {
    "patients": [
      "Carlos Eduardo",
      "Maria Aparecida",
      "João Victor",
      "Fernanda Lima",
      "Luís Fernando",
      "Ana Clara",
      "Marcos Vinícius",
      "Patrícia Gomes",
      "Gabriel Alves",
      "Beatriz Souza",
      "Rafael Moreira",
      "Juliana Costa",
      "Thiago Martins",
      "Ricardo Andrade",
      "Vanessa Oliveira",
      "Mateus Lima",
      "Camila Ferreira",
      "Daniel Rios",
      "Isabela Nunes",
      "André Souza"
    ],
    "schemaVersion": 1
  },
  "specialties": {
    "specialties": [
      {
        "id": "clinica-medica",
        "name": "Clínica Médica",
        "description": "Avalie, diagnostique e trate condições clínicas diversas.",
        "icon": "⚕",
        "declaredCaseCount": 14,
        "background": 9,
        "unlockLevel": 1
      },
      {
        "id": "urgencia",
        "name": "Urgência e Emergência",
        "description": "Atenda casos críticos e tome decisões que salvam vidas.",
        "icon": "✚",
        "declaredCaseCount": 15,
        "background": 8,
        "unlockLevel": 2
      },
      {
        "id": "cardiologia",
        "name": "Cardiologia",
        "description": "Avalie e trate doenças do coração e sistema circulatório.",
        "icon": "❤️",
        "declaredCaseCount": 12,
        "background": 4,
        "unlockLevel": 3
      },
      {
        "id": "pediatria",
        "name": "Pediatria",
        "description": "Cuide da saúde das crianças e adolescentes.",
        "icon": "👶",
        "declaredCaseCount": 9,
        "background": 11,
        "unlockLevel": 4
      },
      {
        "id": "dermatologia",
        "name": "Dermatologia",
        "description": "Diagnostique e trate condições da pele, cabelos e unhas.",
        "icon": "🧴",
        "declaredCaseCount": 10,
        "background": 5,
        "unlockLevel": 5
      },
      {
        "id": "urologia",
        "name": "Urologia",
        "description": "Cuide da saúde do sistema urinário e reprodutor.",
        "icon": "🩺",
        "declaredCaseCount": 8,
        "background": 6,
        "unlockLevel": 6
      },
      {
        "id": "ginecologia",
        "name": "Ginecologia",
        "description": "Acompanhe a saúde da mulher em todas as fases.",
        "icon": "♀",
        "declaredCaseCount": 10,
        "background": 7,
        "unlockLevel": 6
      },
      {
        "id": "ambulatorio",
        "name": "Ambulatório",
        "description": "Atendimento geral e acompanhamento de rotina.",
        "icon": "🏥",
        "declaredCaseCount": 9,
        "background": 10,
        "unlockLevel": 1
      },
      {
        "id": "outras",
        "name": "Outras Especialidades",
        "description": "Acesso futuro a novas áreas e especialidades.",
        "icon": "+",
        "declaredCaseCount": 0,
        "background": 3,
        "unlockLevel": 99
      }
    ],
    "schemaVersion": 1
  },
  "missions": {
    "missions": [
      {
        "id": "daily-3-patients",
        "type": "Diária",
        "title": "Atender 3 pacientes",
        "metric": "patients",
        "goal": 3,
        "rewardXp": 120,
        "rewardCredits": 80
      },
      {
        "id": "daily-accuracy",
        "type": "Diária",
        "title": "Fechar 2 casos com score acima de 80",
        "metric": "highScoreCases",
        "goal": 2,
        "rewardXp": 160,
        "rewardCredits": 100
      },
      {
        "id": "weekly-study",
        "type": "Semanal",
        "title": "Concluir 3 módulos de aprendizagem",
        "metric": "learnedModules",
        "goal": 3,
        "rewardXp": 300,
        "rewardCredits": 200
      },
      {
        "id": "career-streak-3",
        "type": "Carreira",
        "title": "Manter sequência de 3 bons atendimentos",
        "metric": "streak",
        "goal": 3,
        "rewardXp": 260,
        "rewardCredits": 180
      },
      {
        "id": "retention-6-patients",
        "type": "Carreira",
        "title": "Atender 6 pacientes na carreira",
        "metric": "patients",
        "goal": 6,
        "rewardXp": 280,
        "rewardCredits": 210
      },
      {
        "id": "safe-streak-5",
        "type": "Especial",
        "title": "Sequência segura de 5 bons atendimentos",
        "metric": "streak",
        "goal": 5,
        "rewardXp": 420,
        "rewardCredits": 300
      }
    ],
    "schemaVersion": 1
  },
  "responses": {
    "examResults": {
      "hipertensao-1": {
        "Eletrocardiograma (ECG)": "ECG: ritmo sinusal, sem supra de ST, sinais discretos de sobrecarga ventricular esquerda. Resultado compatível com investigação cardiovascular inicial, sem emergência no momento.",
        "Perfil lipídico": "Perfil lipídico: LDL 154 mg/dL, HDL 39 mg/dL, triglicerídeos 186 mg/dL. Risco cardiovascular aumentado.",
        "Glicemia de jejum": "Glicemia de jejum: 103 mg/dL. Limítrofe, sugere orientar estilo de vida e acompanhar.",
        "Hemograma completo": "Hemograma: sem anemia, leucócitos normais, plaquetas normais. Não explica diretamente a queixa."
      },
      "cefaleia-tensional": {
        "Hemograma completo": "Hemograma completo: dentro da normalidade. Sem sinais laboratoriais de infecção ou anemia.",
        "Eletrocardiograma (ECG)": "ECG: ritmo sinusal, sem alterações isquêmicas. Baixa contribuição para a queixa atual.",
        "TSH": "TSH: 2,1 mUI/L. Função tireoidiana preservada."
      },
      "angina-estavel": {
        "Eletrocardiograma (ECG)": "ECG: alterações inespecíficas de repolarização em parede lateral. Não há supra de ST. Requer correlação com clínica.",
        "Troponina": "Troponina: negativa na primeira dosagem. Não exclui completamente risco; considerar seriado conforme protocolo.",
        "Perfil lipídico": "Perfil lipídico: LDL 172 mg/dL, HDL 34 mg/dL. Perfil de alto risco cardiovascular.",
        "Raio-X de tórax": "Raio-X: sem congestão pulmonar ou alargamento mediastinal. Exame pouco decisivo para o caso."
      },
      "itu-nao-complicada": {
        "Urina tipo 1": "Urina tipo 1: leucócitos aumentados, nitrito positivo e bacteriúria. Resultado favorece ITU baixa.",
        "Urocultura": "Urocultura: coleta indicada; resultado definitivo ficaria disponível posteriormente. Ajuda a guiar antibiótico se falha terapêutica.",
        "Hemograma completo": "Hemograma: leucócitos discretamente elevados. Achado inespecífico, mas compatível com processo infeccioso leve."
      },
      "refluxo-gastroesofagico": {
        "Teste terapêutico IBP": "Teste terapêutico com IBP: indicado quando não há sinais de alarme. Resposta clínica esperada ajuda a confirmar DRGE.",
        "Endoscopia digestiva alta": "Endoscopia: indicada se houver sinais de alarme, idade de risco ou refratariedade. No caso atual não é primeiro passo obrigatório.",
        "Hemograma completo": "Hemograma: sem anemia. Reduz preocupação imediata com sangramento digestivo."
      },
      "dermatite-atopica": {
        "Dermatoscopia": "Dermatoscopia: padrão inflamatório inespecífico, sem sinais suspeitos de lesão maligna. Achado compatível com dermatite.",
        "Hemograma completo": "Hemograma: sem eosinofilia importante. Não muda conduta inicial."
      }
    },
    "questionResults": {
      "hipertensao-1": {
        "tempo dos sintomas": "Paciente relata sintomas há cerca de 3 meses, piores em semanas de maior estresse e sedentarismo.",
        "histórico familiar": "Pai hipertenso e avô com infarto antes dos 60 anos. Há risco cardiovascular familiar relevante.",
        "dor em esforço": "Aperto no peito aparece em esforço moderado e melhora com repouso, sem síncope.",
        "estresse e sono": "Sono irregular e rotina sedentária; relata muito café e pouca atividade física."
      },
      "cefaleia-tensional": {
        "tempo dos sintomas": "Dor recorrente há 6 semanas, em aperto bilateral, principalmente no fim do dia.",
        "estresse e sono": "Relata estresse profissional, sono de baixa qualidade e tensão cervical.",
        "sinais de alarme": "Nega febre, rigidez de nuca, déficit neurológico, pior cefaleia da vida ou vômitos em jato."
      },
      "angina-estavel": {
        "dor em esforço": "Dor surge ao subir escadas ou caminhar rápido e melhora em poucos minutos com repouso.",
        "irradiação da dor": "Às vezes irradia para braço esquerdo e mandíbula, associada a suor frio leve.",
        "fatores de risco": "Tabagista prévio, dislipidemia, pai com infarto e sedentarismo importante."
      },
      "itu-nao-complicada": {
        "dor lombar": "Nega dor lombar intensa. Refere apenas desconforto suprapúbico.",
        "febre recente": "Nega febre alta ou calafrios, reduzindo suspeita de pielonefrite.",
        "gestação": "Nega gestação atual. Última menstruação regular."
      },
      "refluxo-gastroesofagico": {
        "tempo dos sintomas": "Sintomas há 4 meses, principalmente após refeições volumosas e à noite.",
        "gatilhos alimentares": "Piora com café, frituras, refrigerante e quando deita logo após comer.",
        "sinais de alarme": "Nega perda de peso, disfagia progressiva, vômitos persistentes ou sangramento digestivo."
      },
      "dermatite-atopica": {
        "tempo dos sintomas": "Crises desde a adolescência, com piora em clima seco e períodos de estresse.",
        "alergias e gatilhos": "Relata rinite alérgica e piora com sabonetes perfumados.",
        "uso de produtos na pele": "Usa hidratante de forma irregular e já aplicou pomadas sem orientação."
      }
    },
    "procedureResults": {
      "Aferir sinais vitais": "Sinais vitais conferidos e registrados no painel. Sem instabilidade imediata, mas devem ser interpretados junto da queixa.",
      "Exame físico geral": "Paciente em bom estado geral, consciente, orientado, corado, hidratado e sem sinais de sofrimento agudo.",
      "Ausculta cardíaca": "Ausculta cardíaca: bulhas rítmicas, normofonéticas, sem sopros evidentes nesta avaliação inicial.",
      "Ausculta pulmonar": "Ausculta pulmonar: murmúrio vesicular presente bilateralmente, sem ruídos adventícios.",
      "Palpação abdominal": "Abdome flácido. Dor leve em hipogástrio quando aplicável, sem sinais de irritação peritoneal.",
      "Avaliação neurológica": "Exame neurológico sumário sem déficits focais. Pupilas isocóricas e força preservada.",
      "Solicitar acesso venoso": "Acesso venoso periférico solicitado e preparado. Ação útil em cenário de maior risco ou necessidade de medicação EV.",
      "Orientação terapêutica": "Paciente recebeu orientação inicial clara, com checagem de compreensão e sinais de alarme para retorno."
    },
    "schemaVersion": 1
  },
  "emergency": FALLBACK_EMERGENCY,
  "outpatient": FALLBACK_OUTPATIENT
};

FALLBACK_CONTENT.branching=FALLBACK_BRANCHING;
export function getFallbackContent(){
  const content=structuredCloneSafe(FALLBACK_CONTENT);
  content.governance=structuredCloneSafe(FALLBACK_GOVERNANCE);
  content.academy=structuredCloneSafe(FALLBACK_ACADEMY);
  content.physiology=structuredCloneSafe(FALLBACK_PHYSIOLOGY);
  content.assessment=structuredCloneSafe(FALLBACK_ASSESSMENT);
  content.therapeutics=structuredCloneSafe(FALLBACK_THERAPEUTICS);
  content.emergency=structuredCloneSafe(FALLBACK_EMERGENCY);
  content.outpatient=structuredCloneSafe(FALLBACK_OUTPATIENT);
  return content;
}

function structuredCloneSafe(value){
  if(typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
