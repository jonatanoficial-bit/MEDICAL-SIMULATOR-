export function createDefaultState({buildVersion='2.0.0'}={}){
  return {
    meta:{saveSchema:18,buildVersion,contentMode:'fallback',updatedAt:null,lastHealthyAt:null,recoveryCount:0},
    locale:'pt-BR',screen:'setup',difficulty:'student',drawer:false,sound:true,audio:{enabled:true,ambient:true,sfx:true,master:.72,ambientVolume:.20,sfxVolume:.58},presentation:{quality:'auto',reduceVisualEffects:false},beta:{localTelemetry:false,includeDiagnostics:true,includeSaveSummary:true,testerAlias:'',checklist:{},devices:{},lastAudit:null,reports:[]},accessibility:{contrast:'standard',textSize:'medium',reduceMotion:false,focusMode:true,descriptions:true},selectedSpec:'clinica-medica',currentCase:0,score:null,
    ui:{shiftTab:'summary',recordTab:'overview',resultsOpen:false,closureReview:false,compactProfile:true,academyView:'catalog',academyModuleId:null,academyLessonIndex:0,academyQuizFeedback:null,emergencyTab:'summary',outpatientTab:'summary',careerTab:'overview',betaTab:'status'},pwa:{installDismissed:false,lastInstallResult:null},
    timeline:[],prontuario:{history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]},vitalTrend:[],
    actions:{questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]},
    assessment:{interview:[],physicalExam:[],redFlags:[],communication:0,lastFinding:null},
    therapeutics:{caseId:null,reconciliation:{checks:{identity:false,allergies:false,currentMedications:false,renalHepatic:false,pregnancy:false,indicationRoute:false},confirmed:false,confirmedAt:null},examOrders:[],administrations:[],incidents:[],procedureAttempts:[],lastProcessedMinute:0},
    emergency:{scenarioId:null,session:null,completed:[],xpClaimed:[]},
    outpatient:{programId:null,session:null,completed:[],xpClaimed:[]},
    branching:{session:null,completed:[],xpClaimed:[]},
    commercial:{activeCaseId:null,variantIndex:0,trust:55,stress:45,rapport:0,lastReaction:'neutral',encountersByCase:{},world:{week:1,season:1,competence:50,ethics:55,empathy:50,efficiency:50,resilience:55,hospitalReputation:50,stress:20,mentorId:'dra-livia',mentorBond:10,legacyPoints:0,journal:[],unlockedSpecializations:[]}},
    career:{stageId:'intern',day:1,rotationId:'triage',examSession:null,examResults:{},examRewardsClaimed:[],claimedMissions:[],attendanceDates:[],activityLog:[],competencies:{},streak:0,lastActivityDate:null,totalActivities:0},
    academy:{pretest:{current:0,answers:[],correct:0,completed:false,score:null},completedLessons:{},passedModules:{},attempts:{},xpClaimed:[],guided:{current:0,answers:[],correct:0,completed:false,score:null},startedAt:null,lastActivity:null},
    player:{name:'Dr. Rafael Santos',short:'Dr. Rafael',avatar:1,country:'BR',audience:'student',preferredMode:'career',onboardingComplete:false,level:1,xp:0,credits:2450,reputation:'Boa',patients:0,correct:88,highScoreCases:0,learnedModules:0,title:'Interno',rank:1248,streak:0},
    simulation:{minutes:720,criticality:0,physiology:null},encounter:null,popup:null,
    unlocks:{specialties:['clinica-medica']},missions:{claimed:[]},completed:[]
  };
}
