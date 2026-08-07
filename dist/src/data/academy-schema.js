const nonEmpty=value=>typeof value==='string'&&value.trim().length>0;
const locales=['pt-BR','en','es'];

export function validateAcademy(academy){
  const errors=[];const warnings=[];
  if(!academy||typeof academy!=='object')return{ok:false,errors:['Academia ausente.'],warnings};
  if(Number(academy.schemaVersion)!==1)errors.push('Schema da Academia incompatível.');
  if(!Array.isArray(academy.modules)||academy.modules.length!==9)errors.push('A Academia deve possuir exatamente 9 módulos.');
  if(!academy.policy?.disclaimer)errors.push('Aviso educacional da Academia ausente.');
  for(const locale of locales)if(!nonEmpty(academy.policy?.disclaimer?.[locale]))errors.push(`Aviso educacional ausente em ${locale}.`);
  const ids=new Set();
  for(const item of academy.modules||[]){
    if(!nonEmpty(item?.id)){errors.push('Módulo sem ID.');continue;}
    if(ids.has(item.id))errors.push(`Módulo duplicado: ${item.id}.`);ids.add(item.id);
    if(!Array.isArray(item.sourceIds)||!item.sourceIds.length)warnings.push(`Módulo ${item.id} sem fontes vinculadas.`);
    if(item.publishable!==false)errors.push(`Módulo ${item.id} não pode ser publicável nesta fase.`);
    for(const locale of locales){
      const content=item.locales?.[locale];
      if(!content){errors.push(`Módulo ${item.id} sem conteúdo ${locale}.`);continue;}
      if(!nonEmpty(content.title)||!nonEmpty(content.summary))errors.push(`Título/resumo inválido em ${item.id}/${locale}.`);
      if(!Array.isArray(content.objectives)||content.objectives.length<2)errors.push(`Objetivos insuficientes em ${item.id}/${locale}.`);
      if(!Array.isArray(content.lessons)||content.lessons.length!==3)errors.push(`Módulo ${item.id}/${locale} deve ter 3 lições.`);
      for(const lesson of content.lessons||[]){
        if(!nonEmpty(lesson.id)||!nonEmpty(lesson.title)||!nonEmpty(lesson.summary))errors.push(`Lição inválida em ${item.id}/${locale}.`);
        if(!Array.isArray(lesson.body)||lesson.body.length<2||!lesson.body.every(nonEmpty))errors.push(`Corpo de lição inválido em ${item.id}/${locale}/${lesson.id||'sem-id'}.`);
      }
      const checkpoint=content.checkpoint;
      if(!nonEmpty(checkpoint?.question)||!Array.isArray(checkpoint?.options)||checkpoint.options.length!==4)errors.push(`Checkpoint inválido em ${item.id}/${locale}.`);
      if(!Number.isInteger(checkpoint?.correctIndex)||checkpoint.correctIndex<0||checkpoint.correctIndex>3)errors.push(`Resposta de checkpoint inválida em ${item.id}/${locale}.`);
      if(!nonEmpty(checkpoint?.explanation))errors.push(`Explicação de checkpoint ausente em ${item.id}/${locale}.`);
      if(item.id==='guided-reasoning'){
        if(!Array.isArray(content.guidedCase?.steps)||content.guidedCase.steps.length!==5)errors.push(`Caso guiado incompleto em ${locale}.`);
      }
    }
  }
  const orders=(academy.modules||[]).map(x=>Number(x.order)).sort((a,b)=>a-b);
  if(orders.join(',')!=='1,2,3,4,5,6,7,8,9')errors.push('Ordem dos módulos deve ser 1 a 9.');
  for(const item of academy.modules||[])for(const prerequisite of item.prerequisites||[])if(!ids.has(prerequisite))errors.push(`Pré-requisito inexistente em ${item.id}: ${prerequisite}.`);
  for(const locale of locales){
    const pretest=academy.pretest?.[locale];
    if(!pretest||!Array.isArray(pretest.questions)||pretest.questions.length!==5)errors.push(`Pré-teste inválido em ${locale}.`);
  }
  return{ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
