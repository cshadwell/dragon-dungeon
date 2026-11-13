import {SECRET_ENTRANCE,canEnterSecret} from './secret-passage-model.js?v=ff7edfdc3c95';
import {EYE_PIXELS,EYE_WIDTH,EYE_HEIGHT,EYE_UV} from './secret-eye-pixels.js?v=ff7edfdc3c95';
export function eyePixel(mx,my,side,step,u,v){
 const e=SECRET_ENTRANCE,r=EYE_UV;if(mx!==e.wallX||my!==e.wallY||side!==e.side||step!==e.step||u<r.x||u>=r.x+r.width||v<r.y||v>=r.y+r.height)return null;
 const i=(Math.floor((v-r.y)/r.height*EYE_HEIGHT)*EYE_WIDTH+Math.floor((u-r.x)/r.width*EYE_WIDTH))*4;
 return EYE_PIXELS[i+3]?EYE_PIXELS.slice(i,i+3):null;
}
export function eyeScreenBounds(state,w=256,h=216){
 if(!canEnterSecret(state))return null;
 // East-facing wall is half a cell ahead. Same projection as corridorPixels.
 const dist=.5,wallH=h/dist,r=EYE_UV;
 return {x:w/2+(r.x/128-.5)/(.7*dist)*w/2,y:(h-wallH)/2+r.y/128*wallH,width:r.width/128/(.7*dist)*w/2,height:r.height/128*wallH};
}
export function updateSecretEye(host,state,pose,onEnter){
 let button=host.querySelector('.secret-eye-hit');const b=!pose&&onEnter&&eyeScreenBounds(state);
 if(!b){button?.remove();return;}
 if(!button){button=document.createElement('button');button.className='secret-eye-hit';button.type='button';button.setAttribute('aria-label','Examine the eye marking');host.append(button);}
 button.onclick=onEnter;
 const place=()=>{const scale=Math.min(host.clientWidth/256,host.clientHeight/216);const x=(host.clientWidth-256*scale)/2+(b.x+b.width/2)*scale,y=(host.clientHeight-216*scale)/2+(b.y+b.height/2)*scale;Object.assign(button.style,{left:x+'px',top:y+'px',width:Math.max(44,b.width*scale)+'px',height:Math.max(44,b.height*scale)+'px'});};
 host.secretEyePlace=place;place();if(!host.secretEyeResize){host.secretEyeResize=new ResizeObserver(()=>{host.secretEyePlace?.();});host.secretEyeResize.observe(host);}
}
