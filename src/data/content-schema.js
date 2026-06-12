import {validateGovernance} from './clinical-governance.js';
import {validateAcademy} from './academy-schema.js';
const nonEmptyString=value=>typeof value==='string' && value.trim().length>0;
const stringArray=value=>Array.isArray(value) && value.every(nonEmptyString);

export function validateGameContent(content){
  const errors=[];
  const warnings=[];
  if(!content || typeof content!=='object') return {ok:false,errors:['Conteúdo ausente.'],warnings};
  const cases=content.cases;
  const gameplay=content.gameplay||{};
  const queue=content.queue||{};
  const specialties=(content.specialties||{}).specialties;
  const missions=(content.missions||{}).missions;
  const responses=content.responses||{};
  const governance=content.governance||null;
  const academy=content.academy||null;
  if(!Array.isArray(cases)||!cases.length) errors.push('Nenhum caso clínico válido foi fornecido.');
  if(!stringArray(gameplay.exams)) errors.push('Lista de exames inválida.');
  if(!stringArray(gameplay.procedures)) errors.push('Lista de procedimentos inválida.');
  if(!stringArray(gameplay.hypotheses)) errors.push('Lista de hipóteses inválida.');
  if(!stringArray(gameplay.conducts)) errors.push('Lista de condutas inválida.');
  if(!stringArray(gameplay.directedQuestions)) errors.push('Lista de perguntas inválida.');
  if(!stringArray(queue.patients)) errors.push('Fila de pacientes inválida.');
  if(!Array.isArray(specialties)||!specialties.length) errors.push('Especialidades inválidas.');
  if(!Array.isArray(missions)) errors.push('Missões inválidas.');
  if(!responses.examResults||!responses.questionResults||!responses.procedureResults) errors.push('Banco de respostas clínicas incompleto.');
  const governanceValidation=validateGovernance(governance,Array.isArray(cases)?cases:[]);
  if(!governanceValidation.ok)errors.push(...governanceValidation.errors);
  warnings.push(...governanceValidation.warnings);
  const academyValidation=validateAcademy(academy);
  if(!academyValidation.ok)errors.push(...academyValidation.errors);
  warnings.push(...academyValidation.warnings);

  const ids=new Set();
  const safeSpecialties=Array.isArray(specialties)?specialties:[];
  const safeCases=Array.isArray(cases)?cases:[];
  const specialtyIds=new Set(safeSpecialties.filter(item=>item&&typeof item==='object').map(item=>item.id));
  for(const item of safeCases){
    if(!item||typeof item!=='object'){errors.push('Caso clínico com formato inválido.');continue;}
    const required=['id','specialty','patient','sex','profession','complaint','diagnosis'];
    for(const field of required) if(!nonEmptyString(item[field])) errors.push(`Caso sem campo obrigatório: ${field}.`);
    if(ids.has(item.id)) errors.push(`ID de caso duplicado: ${item.id}.`); else ids.add(item.id);
    if(!specialtyIds.has(item.specialty)) errors.push(`Caso ${item.id} aponta para especialidade inexistente: ${item.specialty}.`);
    if(!Number.isFinite(Number(item.age))) errors.push(`Idade inválida no caso ${item.id}.`);
    if(!Array.isArray(item.vitals)||!item.vitals.length) errors.push(`Sinais vitais ausentes no caso ${item.id}.`);
    for(const key of ['correctQuestions','correctExams','correctProcedures','idealConduct']) if(!stringArray(item[key])) errors.push(`${key} inválido no caso ${item.id}.`);
    if(!gameplay.hypotheses?.includes(item.diagnosis)) warnings.push(`Diagnóstico não aparece no catálogo de hipóteses: ${item.diagnosis}.`);
    for(const exam of item.correctExams||[]) if(!gameplay.exams?.includes(exam)) errors.push(`Exame desconhecido em ${item.id}: ${exam}.`);
    for(const procedure of item.correctProcedures||[]) if(!gameplay.procedures?.includes(procedure)) errors.push(`Procedimento desconhecido em ${item.id}: ${procedure}.`);
    for(const conduct of item.idealConduct||[]) if(!gameplay.conducts?.includes(conduct)) errors.push(`Conduta desconhecida em ${item.id}: ${conduct}.`);
  }
  return {ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
