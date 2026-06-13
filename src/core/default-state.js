export function createDefaultState({buildVersion='0.24.0'}={}){
  return {
    meta:{saveSchema:15,buildVersion,contentMode:'fallback',updatedAt:null,lastHealthyAt:null,recoveryCount:0},
    locale:'pt-BR',screen:'setup',difficulty:'student',drawer:false,sound:true,accessibility:{contrast:'standard',textSize:'medium',reduceMotion:false,focusMode:true,descriptions:true},selectedSpec:'clinica-medica',currentCase:0,score:null,
    ui:{shiftTab:'summary',recordTab:'overview',resultsOpen:false,closureReview:false,compactProfile:true,academyView:'catalog',academyModuleId:null,academyLessonIndex:0,academyQuizFeedback:null,emergencyTab:'summary',outpatientTab:'summary'},pwa:{installDismissed:false,lastInstallResult:null},
    timeline:[],prontuario:{history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]},vitalTrend:[],
    actions:{questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]},
    assessment:{interview:[],physicalExam:[],redFlags:[],communication:0,lastFinding:null},
    therapeutics:{caseId:null,reconciliation:{checks:{identity:false,allergies:false,currentMedications:false,renalHepatic:false,pregnancy:false,indicationRoute:false},confirmed:false,confirmedAt:null},examOrders:[],administrations:[],incidents:[],procedureAttempts:[],lastProcessedMinute:0},
    emergency:{scenarioId:null,session:null,completed:[],xpClaimed:[]},
    outpatient:{programId:null,session:null,completed:[],xpClaimed:[]},
    branching:{session:null,completed:[],xpClaimed:[]},
    academy:{pretest:{current:0,answers:[],correct:0,completed:false,score:null},completedLessons:{},passedModules:{},attempts:{},xpClaimed:[],guided:{current:0,answers:[],correct:0,completed:false,score:null},startedAt:null,lastActivity:null},
    player:{name:'Dr. Rafael Santos',short:'Dr. Rafael',avatar:1,level:1,xp:0,credits:2450,reputation:'Boa',patients:0,correct:88,highScoreCases:0,learnedModules:0,title:'Interno',rank:1248,streak:0},
    simulation:{minutes:720,criticality:0,physiology:null},encounter:null,popup:null,
    unlocks:{specialties:['clinica-medica']},missions:{claimed:[]},completed:[]
  };
}
