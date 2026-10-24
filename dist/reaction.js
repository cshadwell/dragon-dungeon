// Pure timing rules, separate from browser scheduling and durable game state.
export function createAttempt(guard, now, {practice=false, slow=false, random=Math.random}={}) {
  return {guard,phase:'windup',last:now,snortAt:now+1100+random()*1200,deadline:null,window:practice?1400:slow?1150:700,done:false};
}
export function tick(a, now) {
  if(a.done)return 'done';
  // A suspended tab or a stalled frame must never cause unavoidable damage.
  if(now-a.last>300){a.done=true;return 'paused';}
  a.last=now;
  if(a.phase==='windup' && now>=a.snortAt){a.phase='snort';a.deadline=now+a.window;return 'snort';}
  if(a.phase==='snort' && now>a.deadline){a.done=true;return 'late';}
  return null;
}
export function respond(a, guard, now){
  if(a.done)return null;
  a.done=true;
  if(a.phase==='windup')return 'early';
  if(now>a.deadline)return 'late';
  return guard===a.guard?'block':'wrong';
}
