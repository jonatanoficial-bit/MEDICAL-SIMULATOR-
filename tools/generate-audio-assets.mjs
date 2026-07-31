import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sampleRate=16000;

function createWave({duration,frequencies,gain=0.18,noise=0,attack=0.02,release=0.08}){
  const frames=Math.max(1,Math.round(duration*sampleRate));
  const data=Buffer.alloc(frames*2);
  let seed=0x6d2b79f5;
  for(let index=0;index<frames;index++){
    const time=index/sampleRate;
    const attackGain=Math.min(1,time/Math.max(.001,attack));
    const releaseGain=Math.min(1,(duration-time)/Math.max(.001,release));
    const envelope=Math.max(0,Math.min(attackGain,releaseGain));
    let value=0;
    for(const frequency of frequencies)value+=Math.sin(2*Math.PI*frequency*time)/frequencies.length;
    seed=(seed*1664525+1013904223)>>>0;
    value+=(((seed/0xffffffff)*2)-1)*noise;
    data.writeInt16LE(Math.round(Math.max(-1,Math.min(1,value*gain*envelope))*32767),index*2);
  }
  const header=Buffer.alloc(44);
  header.write('RIFF',0);header.writeUInt32LE(36+data.length,4);header.write('WAVE',8);
  header.write('fmt ',12);header.writeUInt32LE(16,16);header.writeUInt16LE(1,20);header.writeUInt16LE(1,22);
  header.writeUInt32LE(sampleRate,24);header.writeUInt32LE(sampleRate*2,28);header.writeUInt16LE(2,32);header.writeUInt16LE(16,34);
  header.write('data',36);header.writeUInt32LE(data.length,40);
  return Buffer.concat([header,data]);
}

const assets={
  'assets/audio/sfx/ui-tap.wav':{duration:.09,frequencies:[720,960],gain:.2,release:.06},
  'assets/audio/sfx/ui-ok.wav':{duration:.24,frequencies:[520,780,1040],gain:.18,release:.12},
  'assets/audio/sfx/ui-warn.wav':{duration:.32,frequencies:[220,330],gain:.22,release:.16},
  'assets/audio/sfx/ui-nav.wav':{duration:.14,frequencies:[420,630],gain:.16,release:.08},
  'assets/audio/sfx/ui-level.wav':{duration:.42,frequencies:[440,660,880],gain:.19,release:.2},
  'assets/audio/sfx/clinical-confirm.wav':{duration:.28,frequencies:[360,540,720],gain:.17,release:.15},
  'assets/audio/ambient/hospital-lobby.wav':{duration:4,frequencies:[82,123,164],gain:.035,noise:.035,attack:.6,release:.6},
  'assets/audio/ambient/clinical-room.wav':{duration:4,frequencies:[96,144,192],gain:.03,noise:.025,attack:.6,release:.6},
  'assets/audio/ambient/emergency-bay.wav':{duration:4,frequencies:[110,165,220],gain:.04,noise:.03,attack:.5,release:.5}
};

for(const [relative,options] of Object.entries(assets)){
  const target=path.join(root,relative);
  fs.mkdirSync(path.dirname(target),{recursive:true});
  fs.writeFileSync(target,createWave(options));
}

console.log(JSON.stringify({ok:true,assets:Object.keys(assets).length,sampleRate},null,2));
