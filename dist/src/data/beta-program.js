export const BETA_PROGRAM=Object.freeze({
  schemaVersion:1,
  version:'2.0.0',
  channel:'closed-beta',
  localOnly:true,
  telemetryDefault:false,
  maxLocalSessions:25,
  categories:['runtime','usability','mobile-scroll','accessibility','pwa-offline','audio-visual','clinical-simulation','translation','performance','other'],
  severities:['suggestion','minor','major','critical'],
  deviceMatrix:[
    {id:'android-chrome',label:'Android • Chrome',required:true,status:'pending'},
    {id:'android-samsung',label:'Android • Samsung Internet',required:true,status:'pending'},
    {id:'iphone-safari',label:'iPhone • Safari',required:true,status:'pending'},
    {id:'ipad-safari',label:'iPad • Safari',required:false,status:'pending'},
    {id:'windows-chrome',label:'Windows • Chrome',required:true,status:'pending'},
    {id:'windows-edge',label:'Windows • Edge',required:true,status:'pending'}
  ],
  checklist:[
    {id:'boot',label:'O jogo abriu sem tela branca.'},
    {id:'scroll',label:'Foi possível subir e descer com o dedo normalmente.'},
    {id:'save',label:'O progresso permaneceu após fechar e abrir.'},
    {id:'clinical',label:'Um caso clínico pôde ser iniciado e encerrado.'},
    {id:'emergency',label:'Um cenário de emergência abriu corretamente.'},
    {id:'outpatient',label:'O seguimento ambulatorial abriu corretamente.'},
    {id:'language',label:'A troca entre PT-BR, EN e ES funcionou.'},
    {id:'accessibility',label:'Texto grande/alto contraste não cortaram controles.'},
    {id:'offline',label:'A PWA abriu offline após instalação.'},
    {id:'audio',label:'Áudio e ambiente respeitaram os controles.'}
  ]
});
