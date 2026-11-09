// Cache successful images; failed or timed-out loads remain retryable.
export function createImageLoader({ImageClass=globalThis.Image,timeoutMs=10000}={}){
 const cache=new Map();
 return function load(url){
  if(cache.has(url))return cache.get(url);
  const pending=new Promise((resolve,reject)=>{
   const image=new ImageClass();let timeout;
   const finish=(error)=>{clearTimeout(timeout);image.onload=image.onerror=null;if(error)reject(error);else resolve(image);};
   timeout=setTimeout(()=>finish(Error('Image load timed out')),timeoutMs);
   image.onload=()=>finish();image.onerror=()=>finish(Error('Image unavailable'));image.src=url;
  });
  cache.set(url,pending);pending.catch(()=>{if(cache.get(url)===pending)cache.delete(url);});return pending;
 };
}
export async function recoverArtwork(task,{message,container=message.parentElement}){
 try{return await task();}catch{
  return new Promise(resolve=>{
   const retry=document.createElement('button');retry.textContent='Retry artwork';retry.className='art-retry';message.textContent='The artwork could not load. Please retry.';container.append(retry);
   retry.onkeydown=e=>{if(e.code==='Space'||e.code==='Enter'){e.preventDefault();e.stopImmediatePropagation();if(!e.repeat)retry.click();}};
   retry.onclick=async()=>{retry.disabled=true;try{const result=await task();retry.remove();resolve(result);}catch{retry.disabled=false;}};
  });
 }
}
