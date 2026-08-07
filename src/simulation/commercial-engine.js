const clamp=(value,min=0,max=100)=>Math.min(max,Math.max(min,Math.round(Number(value)||0)));

const l=(pt,en,es)=>Object.freeze({'pt-BR':pt,en,es});

export const PATIENT_VARIANTS=Object.freeze({
  'hipertensao-1':[
    {patient:'Marcos Vinícius',age:34,sex:'Masculino',profession:'Analista de Sistemas',context:l('Rotina sedentária e receio de perder produtividade.','Sedentary routine and fear of losing productivity.','Rutina sedentaria y temor a perder productividad.'),trust:58,stress:48},
    {patient:'Joana Batista',age:47,sex:'Feminino',profession:'Motorista de aplicativo',context:l('Turnos irregulares, pouco sono e dificuldade para acompanhar a pressão.','Irregular shifts, little sleep, and difficulty monitoring blood pressure.','Turnos irregulares, poco sueño y dificultad para controlar la presión.'),trust:52,stress:62},
    {patient:'Paulo Henrique',age:39,sex:'Masculino',profession:'Cozinheiro',context:l('Histórico familiar importante e consumo elevado de sódio no trabalho.','Relevant family history and high sodium exposure at work.','Antecedentes familiares relevantes y alta exposición al sodio en el trabajo.'),trust:64,stress:44},
    {patient:'Aline Moreira',age:31,sex:'Feminino',profession:'Arquiteta',context:l('Ansiedade com os sintomas e dúvidas sobre atividade física.','Anxiety about symptoms and questions about physical activity.','Ansiedad por los síntomas y dudas sobre actividad física.'),trust:46,stress:70}
  ],
  'cefaleia-tensional':[
    {patient:'Patrícia Gomes',age:29,sex:'Feminino',profession:'Professora',context:l('Sobrecarga de trabalho, sono fragmentado e receio de doença neurológica.','Work overload, fragmented sleep, and fear of neurological disease.','Sobrecarga laboral, sueño fragmentado y temor a enfermedad neurológica.'),trust:60,stress:66},
    {patient:'Diego Nascimento',age:26,sex:'Masculino',profession:'Designer',context:l('Longos períodos diante de telas e automedicação ocasional.','Long periods in front of screens and occasional self-medication.','Largos periodos frente a pantallas y automedicación ocasional.'),trust:54,stress:56},
    {patient:'Marta Ribeiro',age:51,sex:'Feminino',profession:'Comerciante',context:l('Cuida de um familiar e minimiza os próprios sintomas.','Cares for a relative and minimizes her own symptoms.','Cuida a un familiar y minimiza sus propios síntomas.'),trust:68,stress:58},
    {patient:'Samuel Costa',age:33,sex:'Masculino',profession:'Músico',context:l('Rotina noturna, hidratação irregular e preocupação com medicamentos.','Night routine, irregular hydration, and concern about medication.','Rutina nocturna, hidratación irregular y preocupación por medicamentos.'),trust:49,stress:63}
  ],
  'angina-estavel':[
    {patient:'Ricardo Andrade',age:56,sex:'Masculino',profession:'Motorista',context:l('Evita contar à família e teme perder o trabalho.','Avoids telling his family and fears losing his job.','Evita contarlo a su familia y teme perder el trabajo.'),trust:50,stress:68},
    {patient:'Helena Duarte',age:62,sex:'Feminino',profession:'Aposentada',context:l('Mora sozinha e tem dificuldade de diferenciar esforço seguro de risco.','Lives alone and struggles to distinguish safe exertion from risk.','Vive sola y le cuesta distinguir esfuerzo seguro de riesgo.'),trust:65,stress:57},
    {patient:'Osvaldo Menezes',age:59,sex:'Masculino',profession:'Empresário',context:l('Questiona cada exame e deseja uma solução imediata.','Questions every test and wants an immediate solution.','Cuestiona cada prueba y desea una solución inmediata.'),trust:42,stress:52},
    {patient:'Neide Alves',age:54,sex:'Feminino',profession:'Costureira',context:l('Cuida dos netos e adiou avaliação por falta de tempo.','Cares for grandchildren and delayed assessment due to lack of time.','Cuida de sus nietos y retrasó la evaluación por falta de tiempo.'),trust:57,stress:73}
  ],
  'itu-nao-complicada':[
    {patient:'Vanessa Oliveira',age:38,sex:'Feminino',profession:'Gerente',context:l('Rotina intensa e dúvida sobre como reconhecer sinais de complicação.','Intense routine and uncertainty about warning signs of complications.','Rutina intensa y dudas para reconocer signos de complicación.'),trust:62,stress:46},
    {patient:'Luana Martins',age:24,sex:'Feminino',profession:'Estudante',context:l('Tem vergonha de discutir sintomas urinários e possível gestação.','Feels embarrassed discussing urinary symptoms and possible pregnancy.','Siente vergüenza al hablar de síntomas urinarios y posible embarazo.'),trust:44,stress:69},
    {patient:'Renata Farias',age:45,sex:'Feminino',profession:'Enfermeira administrativa',context:l('Teve episódios prévios e espera repetir uma conduta antiga.','Had prior episodes and expects to repeat an old plan.','Tuvo episodios previos y espera repetir un plan antiguo.'),trust:59,stress:40},
    {patient:'Carla Dias',age:33,sex:'Feminino',profession:'Vendedora',context:l('Acesso limitado a retorno e preocupação com custo.','Limited access to follow-up and concern about cost.','Acceso limitado al control y preocupación por el costo.'),trust:55,stress:61}
  ],
  'refluxo-gastroesofagico':[
    {patient:'Carlos Eduardo',age:42,sex:'Masculino',profession:'Comerciante',context:l('Refeições tardias e receio de que a dor seja cardíaca.','Late meals and fear that the pain is cardiac.','Comidas tardías y temor de que el dolor sea cardíaco.'),trust:58,stress:54},
    {patient:'Sônia Freire',age:50,sex:'Feminino',profession:'Cabeleireira',context:l('Sintomas noturnos, uso frequente de café e sono prejudicado.','Night symptoms, frequent coffee intake, and impaired sleep.','Síntomas nocturnos, consumo frecuente de café y sueño alterado.'),trust:66,stress:49},
    {patient:'Bruno Tavares',age:36,sex:'Masculino',profession:'Publicitário',context:l('Procura solução rápida e resiste a mudanças de rotina.','Seeks a quick fix and resists routine changes.','Busca una solución rápida y se resiste a cambiar su rutina.'),trust:43,stress:45},
    {patient:'Edna Queiroz',age:58,sex:'Feminino',profession:'Bibliotecária',context:l('Relata sintomas com precisão, mas teme exames invasivos.','Reports symptoms precisely but fears invasive tests.','Describe los síntomas con precisión, pero teme pruebas invasivas.'),trust:70,stress:60}
  ],
  'dermatite-atopica':[
    {patient:'Ana Clara',age:21,sex:'Feminino',profession:'Estudante',context:l('Prurido prejudica o sono e a autoestima.','Itching impairs sleep and self-esteem.','El prurito afecta el sueño y la autoestima.'),trust:56,stress:64},
    {patient:'Fábio Lemos',age:28,sex:'Masculino',profession:'Barbeiro',context:l('Contato frequente com produtos e preocupação com afastamento.','Frequent product exposure and concern about time off work.','Exposición frecuente a productos y preocupación por ausentarse.'),trust:51,stress:53},
    {patient:'Mirela Santos',age:35,sex:'Feminino',profession:'Fotógrafa',context:l('Testou vários produtos e está frustrada com recorrências.','Tried several products and is frustrated by recurrences.','Probó varios productos y está frustrada por las recurrencias.'),trust:41,stress:67},
    {patient:'Gabriel Souza',age:19,sex:'Masculino',profession:'Atleta amador',context:l('Suor e rotina esportiva dificultam o controle diário.','Sweat and sports routine make daily control difficult.','El sudor y la rutina deportiva dificultan el control diario.'),trust:63,stress:42}
  ]
});

export const CAREER_EVENTS=Object.freeze([
  {id:'full-house',icon:'🏥',title:l('Hospital em capacidade máxima','Hospital at full capacity','Hospital a capacidad máxima'),description:l('A eficiência ganha importância, mas decisões inseguras continuam penalizadas.','Efficiency matters more, but unsafe decisions remain penalized.','La eficiencia importa más, pero las decisiones inseguras siguen penalizadas.'),metric:'efficiency'},
  {id:'patient-safety',icon:'🛡️',title:l('Semana da segurança do paciente','Patient safety week','Semana de seguridad del paciente'),description:l('Reconciliação, identificação e comunicação segura recebem destaque.','Reconciliation, identification, and safe communication take priority.','La conciliación, identificación y comunicación segura son prioritarias.'),metric:'ethics'},
  {id:'community',icon:'🤝',title:l('Mutirão comunitário','Community outreach','Jornada comunitaria'),description:l('Empatia e acesso ao cuidado afetam a reputação do hospital.','Empathy and access to care affect hospital reputation.','La empatía y el acceso a la atención afectan la reputación del hospital.'),metric:'empathy'},
  {id:'teaching-rounds',icon:'🎓',title:l('Visita de ensino','Teaching rounds','Ronda docente'),description:l('Casos bem documentados aumentam a relação com a mentoria.','Well-documented cases strengthen the mentoring relationship.','Los casos bien documentados fortalecen la relación con la mentoría.'),metric:'competence'},
  {id:'night-shift',icon:'🌙',title:l('Sequência de plantões noturnos','Night shift rotation','Rotación de guardias nocturnas'),description:l('O estresse sobe mais rápido; pausas e consistência protegem o desempenho.','Stress rises faster; pacing and consistency protect performance.','El estrés aumenta más rápido; el ritmo y la constancia protegen el rendimiento.'),metric:'resilience'},
  {id:'quality-review',icon:'📊',title:l('Revisão de qualidade','Quality review','Revisión de calidad'),description:l('Exames excessivos e incidentes têm maior impacto na avaliação.','Excess tests and incidents have greater impact on the review.','Las pruebas excesivas y los incidentes tienen mayor impacto en la evaluación.'),metric:'efficiency'}
]);

export const CAREER_MENTORS=Object.freeze([
  {id:'dra-livia',avatar:4,name:'Dra. Lívia Monteiro',role:l('Preceptora de Clínica','Clinical mentor','Mentora clínica'),focus:'competence'},
  {id:'dr-caio',avatar:5,name:'Dr. Caio Nunes',role:l('Coordenador de Emergência','Emergency coordinator','Coordinador de urgencias'),focus:'resilience'},
  {id:'dra-amanda',avatar:3,name:'Dra. Amanda Reis',role:l('Líder de Segurança e Qualidade','Safety and quality lead','Líder de seguridad y calidad'),focus:'ethics'}
]);

export const SPECIALIZATION_PATHS=Object.freeze([
  {id:'clinical-reasoning',icon:'🧠',title:l('Raciocínio Clínico','Clinical Reasoning','Razonamiento clínico'),metric:'competence',goal:70},
  {id:'patient-centered',icon:'🤝',title:l('Cuidado Centrado na Pessoa','Person-Centered Care','Atención centrada en la persona'),metric:'empathy',goal:70},
  {id:'patient-safety',icon:'🛡️',title:l('Segurança do Paciente','Patient Safety','Seguridad del paciente'),metric:'ethics',goal:74},
  {id:'critical-response',icon:'⚡',title:l('Resposta Crítica','Critical Response','Respuesta crítica'),metric:'resilience',goal:72}
]);

export function localizeCommercial(value,locale='pt-BR'){
  if(value&&typeof value==='object')return value[locale]||value['pt-BR']||value.en||Object.values(value)[0]||'';
  return value??'';
}

export function createCommercialState(current={}){
  const base={
    activeCaseId:null,variantIndex:0,trust:55,stress:45,rapport:0,lastReaction:'neutral',encountersByCase:{},
    world:{week:1,season:1,competence:50,ethics:55,empathy:50,efficiency:50,resilience:55,hospitalReputation:50,stress:20,mentorId:'dra-livia',mentorBond:10,legacyPoints:0,journal:[],unlockedSpecializations:[]}
  };
  const result={...base,...(current||{}),world:{...base.world,...(current?.world||{})}};
  result.encountersByCase={...(current?.encountersByCase||{})};
  result.world.journal=Array.isArray(result.world.journal)?result.world.journal.slice(-30):[];
  result.world.unlockedSpecializations=Array.isArray(result.world.unlockedSpecializations)?result.world.unlockedSpecializations:[];
  return result;
}

export function variantCountForCase(caseId){return PATIENT_VARIANTS[caseId]?.length||1;}
export function totalCoreVariants(caseIds=[]){return caseIds.reduce((sum,id)=>sum+variantCountForCase(id),0);}

export function patientVariantForCase(baseCase,commercialState,locale='pt-BR'){
  if(!baseCase)return baseCase;
  const profiles=PATIENT_VARIANTS[baseCase.id]||[];
  if(!profiles.length)return {...baseCase,variantId:`${baseCase.id}-base`,patientContext:''};
  const index=Math.abs(Number(commercialState?.variantIndex)||0)%profiles.length;
  const profile=profiles[index];
  return {...baseCase,...profile,context:undefined,patientContext:localizeCommercial(profile.context,locale),variantId:`${baseCase.id}-v${index+1}`,variantNumber:index+1,variantTotal:profiles.length};
}

export function preparePatientEncounter(commercialState,baseCase){
  const state=createCommercialState(commercialState);
  if(!baseCase)return state;
  const count=Number(state.encountersByCase[baseCase.id]||0);
  const profiles=PATIENT_VARIANTS[baseCase.id]||[];
  const index=profiles.length?count%profiles.length:0;
  const profile=profiles[index]||{};
  state.activeCaseId=baseCase.id;
  state.variantIndex=index;
  state.trust=clamp(profile.trust??55);
  state.stress=clamp(profile.stress??45);
  state.rapport=0;
  state.lastReaction='neutral';
  return state;
}

export function registerPatientInteraction(commercialState,{kind='neutral',priority='routine',positive=true}={}){
  const state=createCommercialState(commercialState);
  const deltas={interview:[positive?3:-2,-2],physicalExam:[positive?2:-2,positive?-1:2],exams:[positive?1:-2,positive?0:2],hypotheses:[0,0],conduct:[positive?3:-4,positive?-2:4],communication:[5,-4],reassess:[2,-3],excess:[-4,4]};
  const [trustDelta,stressDelta]=deltas[kind]||[positive?1:-1,positive?-1:1];
  const multiplier=priority==='essential'?1.5:1;
  state.trust=clamp(state.trust+trustDelta*multiplier);
  state.stress=clamp(state.stress+stressDelta*multiplier);
  state.rapport=clamp(state.rapport+(positive?2:-1),-20,20);
  state.lastReaction=state.trust>=75?'engaged':state.stress>=75?'anxious':state.trust<40?'guarded':'neutral';
  return state;
}

export function patientCenteredBonus(commercialState){
  const state=createCommercialState(commercialState);
  return Math.round(Math.max(-4,Math.min(5,(state.trust-55)/6+(state.rapport/8))));
}

export function careerEventForWeek(week=1){return CAREER_EVENTS[(Math.max(1,Number(week)||1)-1)%CAREER_EVENTS.length];}

export function completeCareerEncounter(commercialState,{caseId,score=0,trust=50,incidents=0,excessTests=0,elapsedMinutes=0,communication=0}={}){
  const state=createCommercialState(commercialState);const world=state.world;
  const before={competence:world.competence,ethics:world.ethics,empathy:world.empathy,efficiency:world.efficiency,resilience:world.resilience,hospitalReputation:world.hospitalReputation,stress:world.stress,mentorBond:world.mentorBond};
  const safe=incidents===0;const efficient=excessTests===0&&elapsedMinutes<=90;const excellent=score>=85;
  world.competence=clamp(world.competence+(score>=80?2:score<60?-2:1));
  world.ethics=clamp(world.ethics+(safe?1:-5));
  world.empathy=clamp(world.empathy+(trust>=70?2:trust<45?-2:communication>=60?1:0));
  world.efficiency=clamp(world.efficiency+(efficient?2:excessTests>1?-3:-1));
  world.resilience=clamp(world.resilience+(excellent?1:score<60?-2:0));
  world.stress=clamp(world.stress+(elapsedMinutes>120?5:score<60?4:2));
  world.hospitalReputation=clamp(world.hospitalReputation+(excellent&&safe?2:incidents?-4:score>=70?1:-1));
  world.mentorBond=clamp(world.mentorBond+(score>=75?2:0)+(communication>=70?1:0));
  world.legacyPoints=Math.max(0,Math.round(world.legacyPoints+(excellent?3:score>=70?1:0)));
  const totalEncounters=Object.values(state.encountersByCase).reduce((sum,value)=>sum+Number(value||0),0)+1;
  world.week=Math.max(1,Math.floor(totalEncounters/3)+1);world.season=Math.max(1,Math.floor((world.week-1)/8)+1);
  state.encountersByCase[caseId]=Number(state.encountersByCase[caseId]||0)+1;
  for(const path of SPECIALIZATION_PATHS)if(world[path.metric]>=path.goal&&!world.unlockedSpecializations.includes(path.id))world.unlockedSpecializations.push(path.id);
  const delta=Object.fromEntries(Object.keys(before).map(key=>[key,world[key]-before[key]]));
  const entry={id:`case-${Date.now()}`,type:'case',caseId,score,trust,week:world.week,eventId:careerEventForWeek(world.week).id,delta:{...delta},at:new Date().toISOString()};
  world.journal.push(entry);world.journal=world.journal.slice(-30);
  return {state,delta,entry};
}

export function recoverCareerStress(commercialState,amount=8){
  const state=createCommercialState(commercialState);state.world.stress=clamp(state.world.stress-Math.max(1,Number(amount)||8));state.world.resilience=clamp(state.world.resilience+1);state.world.journal.push({id:`rest-${Date.now()}`,type:'recovery',week:state.world.week,at:new Date().toISOString()});state.world.journal=state.world.journal.slice(-30);return state;
}

export function commercialSummary(commercialState){
  const state=createCommercialState(commercialState),world=state.world;
  return {world,event:careerEventForWeek(world.week),mentor:CAREER_MENTORS.find(item=>item.id===world.mentorId)||CAREER_MENTORS[0],specializations:SPECIALIZATION_PATHS.map(item=>({...item,unlocked:world.unlockedSpecializations.includes(item.id),value:world[item.metric]}))};
}
