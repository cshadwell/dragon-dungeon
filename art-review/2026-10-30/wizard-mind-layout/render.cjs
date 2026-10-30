const {createCanvas,loadImage}=require('/Users/cshadwell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const fs=require('fs'),path=require('path'),root=path.resolve(__dirname,'../../..');
(async()=>{
const c=createCanvas(1000,820),x=c.getContext('2d');x.imageSmoothingEnabled=false;
function rect(a,b,w,h,col){x.fillStyle=col;x.fillRect(a,b,w,h)}
function text(t,a,b,size=14,col='#d2c6a6',font='monospace'){x.fillStyle=col;x.font=font==='bold monospace'?`bold ${size}px monospace`:`${size}px ${font}`;x.fillText(t,a,b)}
function frame(a,b,w,h){rect(a,b,w,h,'#777773');rect(a+4,b+4,w-8,h-8,'#b1afa0');rect(a+6,b+6,w-12,h-12,'#152019')}
rect(0,0,1000,820,'#141515');text('THE WIZARD’S STUDY · MIND',26,28,14);text('PRACTICE · IGNORE THE DISTRACTION',647,28,13,'#e4ca83');
frame(24,44,952,412);
const s=createCanvas(470,200),g=s.getContext('2d');g.imageSmoothingEnabled=false;
const bg=await loadImage(root+'/dist/assets/rooms/wizard-study-v1.png'),wiz=await loadImage(root+'/dist/assets/characters/approved-v2/wizard/pose-001.png');
g.drawImage(bg,0,0,470,200);const wx=Math.round((470-wiz.width)/2),wy=192-wiz.height;g.drawImage(wiz,wx,wy);
// Independent pixel spell burst centered on the staff gem. Original PNG stays exact.
// Opaque core covers the entire blue gem; stepped rays extend beyond the staff.
const cx=wx+20,cy=wy+22;
function spellRect(dx,dy,w,h,col){g.fillStyle=col;g.fillRect(cx+dx,cy+dy,w,h)}
spellRect(-8,-10,16,20,'#8f1f24');spellRect(-10,-7,20,14,'#8f1f24');
spellRect(-3,-16,6,32,'#cc3038');spellRect(-16,-3,32,6,'#cc3038');
spellRect(-11,-11,5,5,'#ed4449');spellRect(7,-11,5,5,'#ed4449');
spellRect(-11,7,5,5,'#ed4449');spellRect(7,7,5,5,'#ed4449');
spellRect(-6,-9,12,18,'#ed4449');spellRect(-9,-6,18,12,'#ed4449');
spellRect(-5,-6,10,12,'#ff6867');spellRect(-6,-4,12,8,'#ff6867');
spellRect(-2,-4,4,8,'#ffa29a');
spellRect(-18,-10,2,2,'#ed4449');spellRect(15,-13,2,2,'#ff6867');
spellRect(16,9,2,2,'#ed4449');spellRect(-13,14,2,2,'#ff6867');
x.drawImage(s,30,50,940,400);
frame(24,476,354,300);frame(396,476,580,300);
text('THE WIZARD',45,506,13,'#d5bd78');rect(45,519,311,1,'#48513c');
text('“Trust what you observe.',45,552,21,'#eee7d1','serif');text('The words may wear',45,581,21,'#eee7d1','serif');text('a deceiving color.”',45,610,21,'#eee7d1','serif');
text('Match the gem to the WORD.',45,648,13);text('Ignore the ink’s color.',45,671,13);
rect(45,706,144,43,'#2b382d');text('Pause',93,733,13);rect(201,706,155,43,'#263027');text('Return to maze',213,733,12);
text('CHOOSE THE SPELL’S WRITTEN NAME',417,506,13,'#e4ca83');text('2.1 s',897,506,12,'#efe4bc');
rect(417,519,538,7,'#313b2d');rect(417,519,377,7,'#c7a65b');
for(const [a,b,label,col]of [[417,544,'BLUE','#f0bf4f'],[694,544,'RED','#6b9eff'],[417,648,'PURPLE','#6acb7d'],[694,648,'GREEN','#c39bea']]){
rect(a,b,261,85,'#727a60');rect(a+2,b+2,257,81,'#243329');x.font='bold 42px monospace';const tw=x.measureText(label).width;text(label,a+(261-tw)/2,b+57,42,col,'bold monospace');}
text('READ THE WORD · CHOICES SHUFFLE AFTER EACH SPELL',417,757,11,'#b7bea8');
text('STATIC LAYOUT PROPOSAL · EXAMPLE ANSWER: RED · NO GAMEPLAY IMPLEMENTED',26,803,11,'#929684');
fs.writeFileSync(path.join(__dirname,'mockup.png'),c.toBuffer('image/png'));
})();
