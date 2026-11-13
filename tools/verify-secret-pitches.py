"""Recheck recorded fundamentals against the audited spectral bands; no file writes.
The recordings contain strong overtones: this deliberately measures the lower
fundamental band, not the largest FFT peak. Runtime tuning uses recorded samples.
"""
import wave,struct,math,cmath,json
from pathlib import Path
from pathlib import Path

def fft(a):
 n=len(a);j=0
 for i in range(1,n):
  bit=n>>1
  while j&bit:j^=bit;bit>>=1
  j^=bit
  if i<j:a[i],a[j]=a[j],a[i]
 length=2
 while length<=n:
  wlen=cmath.exp(-2j*math.pi/length)
  for i in range(0,n,length):
   w=1
   for j in range(i,i+length//2):
    u=a[j];v=a[j+length//2]*w;a[j]=u+v;a[j+length//2]=u-v;w*=wlen
  length*=2
 return a

root=Path(__file__).resolve().parents[1]
rows=json.loads((root/"art-review/2026-11-12/secret-piano/pitch-verification.json").read_text())
for row in rows:
 p=root/"dist/assets/secret/piano"/(row["id"]+".wav")
 with wave.open(str(p),"rb") as w:
  rate=w.getframerate();ch=w.getnchannels();assert w.getsampwidth()==2;w.setpos(int(rate*.08));raw=w.readframes(32768)
 vals=struct.unpack("<"+"h"*(len(raw)//2),raw)
 x=[sum(vals[i:i+ch])/ch for i in range(0,len(vals),ch*4)][:8192];n=len(x)
 a=fft([v*(.5-.5*math.cos(2*math.pi*i/(n-1))) for i,v in enumerate(x)]);amps=[abs(z) for z in a[:n//2]]
 expected=440*2**((row["recordedMidi"]-69)/12)
 lo=math.ceil(expected*.975*n/(rate/4));hi=math.floor(expected*1.025*n/(rate/4))
 k=max(range(lo,hi+1),key=lambda i:amps[i])
 alpha,beta,gamma=[math.log(max(1e-10,amps[j])) for j in [k-1,k,k+1]]
 delta=.5*(alpha-gamma)/(alpha-2*beta+gamma);hz=(k+delta)*rate/4/n
 assert abs(1200*math.log2(hz/row["measuredHz"]))<3,(p.name,hz,row["measuredHz"])
 target=440*2**((row["midi"]-69)/12)
 assert abs(1200*math.log2(hz*row['rate']/target))<3
 print(f"{p.name}: {hz:.3f} Hz -> {row['pitch']} ({hz*row['rate']:.3f} Hz)")
print("Verified all 25 sampled pitches and playback rates.")
