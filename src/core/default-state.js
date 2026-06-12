export function createDefaultState({buildVersion='0.18.0'}={}){
  return {
    meta:{saveSchema:9,buildVersion,contentMode:'fallback',updatedAt:null,lastHealthyAt:null,recoveryCount:0},
    locale:'pt-BR',screen:'setup',drawer:false,sound:true,accessibility:{contrast:'standard',textSize:'medium',reduceMotion:false,focusMode:true,descriptions:true},selectedSpec:'clinica-medica',currentCase:0,score:null,
    ui:{shiftTab:'summary',recordTab:'overview',resultsOpen:false,closureReview:false,compactProfile:true,academyView:'catalog',academyModuleId:null,academyLessonIndex:0,academyQuizFeedback:null},pwa:{installDismissed:false,lastInstallResult:null},
    timeline:[],prontuario:{history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]},vitalTrend:[],
    actions:{questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]},
    academy:{pretest:{current:0,answers:[],correct:0,completed:false,score:null},completedLessons:{},passedModules:{},attempts:{},xpClaimed:[],guided:{current:0,answers:[],correct:0,completed:false,score:null},startedAt:null,lastActivity:null},
    player:{name:'Dr. Rafael Santos',short:'Dr. Rafael',avatar:1,level:1,xp:0,credits:2450,reputation:'Boa',patients:0,correct:88,highScoreCases:0,learnedModules:0,title:'Interno',rank:1248,streak:0},
    simulation:{minutes:720,criticality:0},encounter:null,popup:null,
    unlocks:{specialties:['clinica-medica']},missions:{claimed:[]},completed:[]
  };
}
