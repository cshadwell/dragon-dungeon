const {createCanvas,loadImage}=require('/Users/cshadwell/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const {writeFileSync}=require('fs');const path=require('path');const root=path.resolve(__dirname,'../../..');
(async()=>{const c=createCanvas(1000,1000),x=c.getContext('2d');x.imageSmoothingEnabled=false;
const rect=(a,b,w,h,color)=>{x.fillStyle=color;x.fillRect(a,b,w,h)};
const text=(s,a,b,size=14,color='#d4c7a4',font='monospace')=>{x.fillStyle=color;x.font=`${size}px ${font}`;x.fillText(s,a,b)};
function frame(a,b,w,h){rect(a,b,w,h,'#777773');rect(a+4,b+4,w-8,h-8,'#b1afa0');rect(a+6,b+6,w-12,h-12,'#152019')}
rect(0,0,1000,1000,'#141515');text('THE ELF QUEEN’S SHRINE · DEFENCE',30,28,13);text('PRACTICE · BLOCKS 2 / 5',736,28,13,'#dfc67e');
frame(24,44,952,410);const bg=await loadImage(root+'/dist/assets/rooms/elf-shrine-v1.png'),elf=await loadImage(root+'/dist/assets/characters/approved-v2/elf/pose-001.png');
const scene=createCanvas(470,200),s=scene.getContext('2d');s.imageSmoothingEnabled=false;s.drawImage(bg,0,0,470,200);s.drawImage(elf,Math.round((470-elf.width)/2),192-elf.height);x.drawImage(scene,30,50,940,400);
rect(48,66,195,27,'#111a15e8');text('READ THE APPROACH',59,84,12,'#e6c67d');
// Same lower two-panel frame, with the left panel devoted to a square arena.
frame(24,472,466,466);frame(508,472,468,466);text('THE WARDING CIRCLE',46,501,12,'#c5b778');text('ONE SHIELD · EVERY DIRECTION',46,920,12,'#b7bda6');
const arena=createCanvas(200,200),a=arena.getContext('2d');a.imageSmoothingEnabled=false;a.fillStyle='#09110e';a.fillRect(0,0,200,200);
// Angular, pixel-stepped boundary and orbit; no smooth glow.
function ring(radius,color){a.fillStyle=color;for(let deg=0;deg<360;deg+=2){const t=deg*Math.PI/180,xx=Math.round(100+Math.cos(t)*radius),yy=Math.round(100+Math.sin(t)*radius);a.fillRect(xx,yy,1,1)}}
ring(91,'#526044');ring(89,'#273c2b');
for(let deg=0;deg<360;deg+=15){const t=deg*Math.PI/180;a.fillStyle='#a99c62';a.fillRect(Math.round(100+Math.cos(t)*91)-1,Math.round(100+Math.sin(t)*91)-1,3,3);}
for(let deg=0;deg<360;deg+=9){const t=deg*Math.PI/180;a.fillStyle='#354637';a.fillRect(Math.round(100+Math.cos(t)*28),Math.round(100+Math.sin(t)*28),1,1);}
// One single silver-green shield segment facing the incoming spell.
for(let deg=-69;deg<=-20;deg+=2){const t=deg*Math.PI/180;a.fillStyle='#b5c2af';a.fillRect(Math.round(100+Math.cos(t)*29)-1,Math.round(100+Math.sin(t)*29)-1,3,3);a.fillStyle='#5e8c65';a.fillRect(Math.round(100+Math.cos(t)*27),Math.round(100+Math.sin(t)*27),2,2);}
// Player: a small gold rune. Its form is provisional, not a new approved asset.
a.fillStyle='#806b35';a.fillRect(97,94,7,13);a.fillRect(94,97,13,7);a.fillStyle='#edcd77';a.fillRect(98,96,5,9);a.fillRect(96,98,9,5);a.fillStyle='#fff0bc';a.fillRect(99,99,3,3);
// Incoming practice wisp and short directional trail.
for(let n=0;n<4;n++){a.fillStyle=['#b4a4e6','#8474b6','#554969','#302e40'][n];a.fillRect(153+n*3,45-n*3,3,3);}
a.fillStyle='#d6caff';a.fillRect(148,47,7,5);a.fillRect(149,46,5,7);a.fillStyle='#fff0d0';a.fillRect(150,48,3,3);
// Keep logical arena square at integer 2x for matching pixel density.
x.drawImage(arena,57,510,400,400);
text('THE ELF QUEEN',532,503,12,'#c5b778');rect(532,516,420,1,'#43503b');text('“Move to meet the danger.',532,550,24,'#eee6ce','serif');text('You cannot guard every side.”',532,580,24,'#eee6ce','serif');
text('Watch the approaching wisp.',532,620,14,'#b0b8a5');text('Rotate your shield into its path.',532,644,14,'#b0b8a5');text('Release to hold your position.',532,668,14,'#b0b8a5');
rect(532,694,420,1,'#43503b');text('ROTATE YOUR SHIELD',532,722,12,'#e5c77f');
for(const [left,label]of [[532,'←  TURN LEFT'],[748,'TURN RIGHT  →']]){rect(left,740,204,59,'#a99b65');rect(left+2,742,200,55,'#2d3d2c');text(label,left+17,776,16,'#f0d38b');}
text('HOLD ← / → OR A / D · RELEASE TO HOLD',532,824,12,'#b5bca8');text('One shield. Opposite inputs cancel.',532,850,12,'#b5bca8');
rect(532,873,420,43,'#202c23');text('Pause / leave training',631,900,13,'#d4c7a4');
text('LAYOUT STUDY · STATIC EXAMPLE · CONTROLS / ART SYMBOLS / BLOCK COUNT ARE PROVISIONAL',26,970,11,'#929684');
writeFileSync(path.join(__dirname,'mockup.png'),c.toBuffer('image/png'));
})();
