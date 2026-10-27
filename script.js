// ============================================================
// PAC-MAN — Complete Game
// ============================================================

const TILE = 20;
const COLS = 28;
const ROWS = 31;
const canvas = document.getElementById('gameCanvas');
canvas.width  = COLS * TILE;
canvas.height = ROWS * TILE;
const ctx = canvas.getContext('2d');

// --- Directions ---
const NONE  = {x:0,y:0};
const LEFT  = {x:-1,y:0};
const RIGHT = {x:1,y:0};
const UP    = {x:0,y:-1};
const DOWN  = {x:0,y:1};
const DIRS  = [UP,LEFT,DOWN,RIGHT];
function sameDir(a,b){return a.x===b.x&&a.y===b.y;}
function oppositeDir(a,b){return a.x===-b.x&&a.y===-b.y;}

// --- Tile types ---
const W=1, D=0, P=2, DOOR=3, E=4;

// --- Classic Pac-Man maze 28×31 ---
const MAP=[
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,2,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,2,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
[1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
[1,1,1,1,1,1,0,1,1,1,1,1,4,1,1,4,1,1,1,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,1,1,1,4,1,1,4,1,1,1,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,1,1,1,3,3,1,1,1,4,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,1,4,4,4,4,4,4,1,4,1,1,0,1,1,1,1,1,1],
[4,4,4,4,4,4,0,4,4,4,1,4,4,4,4,4,4,1,4,4,4,0,4,4,4,4,4,4],
[1,1,1,1,1,1,0,1,1,4,1,4,4,4,4,4,4,1,4,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1],
[1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
[1,2,0,0,1,1,0,0,0,0,0,0,0,4,4,0,0,0,0,0,0,0,1,1,0,0,2,1],
[1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
[1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
[1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// ============================================================
// GAME STATE
// ============================================================
let maze, totalDots, dotsLeft;
let score=0, highScore=+localStorage.getItem('pacHS')||0, lives, level;
let gameMode='single'; // 'single'|'multi'
let phase='title';     // 'title'|'ready'|'playing'|'dying'|'levelclear'|'gameover'|'multiwin'
let phaseTimer=0, frameCnt=0;

// Scatter / Chase timing (frames)
let modeIdx, modeTimer;
const MODE_DUR=[420,1200,420,1200,300,1200,300,Infinity];
function ghostAIMode(){return modeIdx%2===0?'scatter':'chase';}
function advanceMode(){
  if(modeIdx<MODE_DUR.length-1){modeIdx++;modeTimer=MODE_DUR[modeIdx];}
}

// ============================================================
// MAZE HELPERS
// ============================================================
function initMaze(){
  maze=MAP.map(r=>r.slice());
  totalDots=0; dotsLeft=0;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++)
    if(maze[r][c]===D||maze[r][c]===P){totalDots++;dotsLeft++;}
}
function tileAt(c,r){
  if(r<0||r>=ROWS) return W;
  if(c<0||c>=COLS) return r===14?E:W;
  return maze[r][c];
}
function walkable(c,r,passDoor){
  const t=tileAt(c,r);
  if(t===W)return false;
  if(t===DOOR&&!passDoor)return false;
  return true;
}

// Pre-rendered maze image
let mazeImg;
function cacheMaze(){
  const cv=document.createElement('canvas');
  cv.width=COLS*TILE; cv.height=ROWS*TILE;
  const mc=cv.getContext('2d');
  mc.strokeStyle='#2121DE'; mc.lineWidth=2;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(maze[r][c]!==W) continue;
    const x=c*TILE,y=r*TILE;
    if(tileAt(c,r-1)!==W){mc.beginPath();mc.moveTo(x,y);mc.lineTo(x+TILE,y);mc.stroke();}
    if(tileAt(c,r+1)!==W){mc.beginPath();mc.moveTo(x,y+TILE);mc.lineTo(x+TILE,y+TILE);mc.stroke();}
    if(tileAt(c-1,r)!==W){mc.beginPath();mc.moveTo(x,y);mc.lineTo(x,y+TILE);mc.stroke();}
    if(tileAt(c+1,r)!==W){mc.beginPath();mc.moveTo(x+TILE,y);mc.lineTo(x+TILE,y+TILE);mc.stroke();}
  }
  // Ghost house door
  mc.strokeStyle='#FFB8FF'; mc.lineWidth=3;
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(maze[r][c]===DOOR){
      mc.beginPath(); mc.moveTo(c*TILE,r*TILE+TILE/2); mc.lineTo(c*TILE+TILE,r*TILE+TILE/2); mc.stroke();
    }
  }
  mazeImg=cv;
}

// ============================================================
// PAC-MAN
// ============================================================
let pac={};
function resetPac(){
  pac={x:14*TILE,y:23*TILE,dir:NONE,nextDir:NONE,speed:2,alive:true,mouth:0,mouthD:1};
}

let pacPending=NONE;

function movePac(){
  if(!pac.alive)return;
  const col=Math.round(pac.x/TILE), row=Math.round(pac.y/TILE);
  const aligned=(pac.x%TILE===0)&&(pac.y%TILE===0);

  if(aligned){
    // Try pending direction
    if(!sameDir(pacPending,NONE)&&walkable(col+pacPending.x,row+pacPending.y,false)){
      pac.dir=pacPending;
    }
    // Wall check current dir
    if(!walkable(col+pac.dir.x,row+pac.dir.y,false)){
      pac.dir=NONE;
    }
  }
  pac.x+=pac.dir.x*pac.speed;
  pac.y+=pac.dir.y*pac.speed;

  // Tunnel wrap
  if(pac.x<=-TILE) pac.x=(COLS-1)*TILE;
  else if(pac.x>=COLS*TILE) pac.x=0;

  // Eat dots
  const ec=Math.round(pac.x/TILE), er=Math.round(pac.y/TILE);
  if(ec>=0&&ec<COLS&&er>=0&&er<ROWS){
    if(maze[er][ec]===D){maze[er][ec]=E;dotsLeft--;score+=10;updateHUD();}
    else if(maze[er][ec]===P){maze[er][ec]=E;dotsLeft--;score+=50;activatePower();updateHUD();}
  }

  // Mouth animation
  pac.mouth+=0.07*pac.mouthD;
  if(pac.mouth>0.3)pac.mouthD=-1;
  if(pac.mouth<0)pac.mouthD=1;
}

// ============================================================
// GHOSTS
// ============================================================
const G_COL=['#FF0000','#FFB8FF','#00FFFF','#FFB852'];
const G_STATE={HOUSE:'h',LEAVING:'l',ACTIVE:'a',FRIGHT:'f',EATEN:'e'};

let ghosts=[];
let ghostCombo=0;
let frightTimer=0;
const FRIGHT_DUR=360; // 6 sec

function createGhost(i){
  const sc=[[14,11],[13,14],[11,14],[15,14]];
  const et=[0,150,350,550];
  return{
    i,color:G_COL[i],
    x:sc[i][0]*TILE, y:sc[i][1]*TILE,
    dir:i===0?LEFT:UP, nextDir:NONE,
    speed:2,
    state:i===0?G_STATE.ACTIVE:G_STATE.HOUSE,
    exitTimer:et[i],
    p2:false, // player-controlled in multi
  };
}
function resetGhosts(){
  ghosts=[0,1,2,3].map(createGhost);
  frightTimer=0; ghostCombo=0;
  if(gameMode==='multi'){
    ghosts[0].p2=true;
    // Start Blinky at same position but player-controlled
  }
}

let ghostP2Pending=NONE;

// --- Power pellet ---
function activatePower(){
  frightTimer=FRIGHT_DUR; ghostCombo=0;
  ghosts.forEach(g=>{
    if(g.state===G_STATE.ACTIVE&&!g.p2){
      g.state=G_STATE.FRIGHT;
      g.dir={x:-g.dir.x,y:-g.dir.y}; // reverse on fright
    }
  });
}
function tickFright(){
  if(frightTimer>0){
    frightTimer--;
    if(frightTimer<=0){
      ghosts.forEach(g=>{if(g.state===G_STATE.FRIGHT)g.state=G_STATE.ACTIVE;});
    }
  }
}

// --- Ghost movement ---
function moveGhost(g){
  if(g.state===G_STATE.HOUSE){
    // Bob up/down
    g.y=(14*TILE)+Math.sin(frameCnt*0.08+g.i*1.5)*6;
    g.exitTimer--;
    if(g.exitTimer<=0) g.state=G_STATE.LEAVING;
    return;
  }
  if(g.state===G_STATE.LEAVING){
    // Move to col 13/14, then up to row 11
    const tx=13*TILE, ty=11*TILE;
    if(Math.abs(g.x-tx)>2){ g.x+=(g.x<tx?2:-2); return; }
    g.x=tx;
    if(g.y>ty){ g.y-=2; return; }
    g.y=ty;
    g.state=G_STATE.ACTIVE; g.dir=LEFT;
    return;
  }
  if(g.state===G_STATE.EATEN){
    // Move toward house entrance (13,12)
    const tx=13*TILE, ty=14*TILE;
    const col=Math.round(g.x/TILE), row=Math.round(g.y/TILE);
    // Use AI to navigate to door area, then drop in
    if(Math.abs(col-13)<=1 && Math.abs(row-12)<=1){
      // Near door, move into house
      if(Math.abs(g.x-tx)>2){g.x+=(g.x<tx?3:-3);return;}
      g.x=tx;
      if(g.y<ty){g.y+=3;return;}
      g.y=ty;
      g.state=G_STATE.LEAVING; g.exitTimer=60;
      return;
    }
    // Navigate with AI toward door
    moveGhostAI(g,{col:13,row:12},true);
    return;
  }

  // ACTIVE or FRIGHT
  if(g.p2){
    moveGhostP2(g);
  } else {
    const target=getGhostTarget(g);
    moveGhostAI(g,target,false);
  }
}

function moveGhostP2(g){
  const col=Math.round(g.x/TILE), row=Math.round(g.y/TILE);
  const aligned=(g.x%TILE===0)&&(g.y%TILE===0);
  if(aligned){
    if(!sameDir(ghostP2Pending,NONE)){
      const nc=col+ghostP2Pending.x, nr=row+ghostP2Pending.y;
      if(walkable(nc,nr,false)) g.dir=ghostP2Pending;
    }
    const nc2=col+g.dir.x, nr2=row+g.dir.y;
    if(!walkable(nc2,nr2,false)) g.dir=NONE;
  }
  g.x+=g.dir.x*g.speed;
  g.y+=g.dir.y*g.speed;
  if(g.x<=-TILE)g.x=(COLS-1)*TILE;
  else if(g.x>=COLS*TILE)g.x=0;
}

function moveGhostAI(g,target,passDoor){
  const col=Math.round(g.x/TILE), row=Math.round(g.y/TILE);
  const aligned=(g.x%TILE===0)&&(g.y%TILE===0);
  const spd=g.state===G_STATE.FRIGHT?1:g.state===G_STATE.EATEN?4:g.speed;

  if(aligned){
    if(g.state===G_STATE.FRIGHT){
      // Random direction (no reverse)
      const valid=DIRS.filter(d=>{
        if(oppositeDir(d,g.dir))return false;
        return walkable(col+d.x,row+d.y,false);
      });
      g.dir=valid.length?valid[Math.floor(Math.random()*valid.length)]:g.dir;
    } else {
      // Best direction toward target
      let best=null, bestDist=Infinity;
      for(const d of DIRS){
        if(oppositeDir(d,g.dir))continue;
        const nc=col+d.x, nr=row+d.y;
        if(!walkable(nc,nr,passDoor))continue;
        const dist=Math.hypot(nc-target.col,nr-target.row);
        if(dist<bestDist){bestDist=dist;best=d;}
      }
      if(best) g.dir=best;
      else {
        // Stuck? Allow reverse
        for(const d of DIRS){
          const nc=col+d.x, nr=row+d.y;
          if(walkable(nc,nr,passDoor)){g.dir=d;break;}
        }
      }
    }
  }
  g.x+=g.dir.x*spd;
  g.y+=g.dir.y*spd;
  if(g.x<=-TILE)g.x=(COLS-1)*TILE;
  else if(g.x>=COLS*TILE)g.x=0;
}

// --- Ghost targets ---
const SCATTER_T=[{col:25,row:0},{col:2,row:0},{col:27,row:ROWS-1},{col:0,row:ROWS-1}];
function getGhostTarget(g){
  if(g.state===G_STATE.FRIGHT) return SCATTER_T[g.i]; // not used but required
  const mode=ghostAIMode();
  if(mode==='scatter') return SCATTER_T[g.i];

  const pc=Math.round(pac.x/TILE), pr=Math.round(pac.y/TILE);
  switch(g.i){
    case 0: return {col:pc,row:pr};
    case 1: return {col:pc+pac.dir.x*4,row:pr+pac.dir.y*4};
    case 2:{
      const b=ghosts[0];
      const bc=Math.round(b.x/TILE),br=Math.round(b.y/TILE);
      const ax=pc+pac.dir.x*2, ay=pr+pac.dir.y*2;
      return{col:ax*2-bc,row:ay*2-br};
    }
    case 3:{
      const d=Math.hypot(pc-Math.round(g.x/TILE),pr-Math.round(g.y/TILE));
      return d>8?{col:pc,row:pr}:SCATTER_T[3];
    }
  }
  return{col:pc,row:pr};
}

// ============================================================
// COLLISION
// ============================================================
function checkCollisions(){
  for(const g of ghosts){
    if(g.state===G_STATE.HOUSE||g.state===G_STATE.LEAVING)continue;
    const dist=Math.hypot(pac.x-g.x,pac.y-g.y);
    if(dist<TILE*0.8){
      if(g.state===G_STATE.FRIGHT){
        // Eat ghost
        g.state=G_STATE.EATEN;
        ghostCombo++;
        score+=200*ghostCombo;
        updateHUD();
      } else if(g.state===G_STATE.EATEN){
        // No collision with eaten ghost
      } else {
        // Pac dies
        pacDie();
        return;
      }
    }
  }
}
function pacDie(){
  pac.alive=false;
  phase='dying';
  phaseTimer=90;
}

// ============================================================
// INPUT
// ============================================================
window.addEventListener('keydown',e=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();

  if(phase==='gameover'||phase==='multiwin'){
    if(e.key==='Enter'){restartGame();return;}
  }

  if(gameMode==='single'){
    switch(e.key){
      case'w':case'W':case'ArrowUp':   pacPending=UP;break;
      case's':case'S':case'ArrowDown': pacPending=DOWN;break;
      case'a':case'A':case'ArrowLeft': pacPending=LEFT;break;
      case'd':case'D':case'ArrowRight':pacPending=RIGHT;break;
    }
  } else {
    // Multi: WASD=pac, Arrows=ghost
    switch(e.key){
      case'w':case'W':pacPending=UP;break;
      case's':case'S':pacPending=DOWN;break;
      case'a':case'A':pacPending=LEFT;break;
      case'd':case'D':pacPending=RIGHT;break;
      case'ArrowUp':   ghostP2Pending=UP;break;
      case'ArrowDown': ghostP2Pending=DOWN;break;
      case'ArrowLeft': ghostP2Pending=LEFT;break;
      case'ArrowRight':ghostP2Pending=RIGHT;break;
    }
  }
});

// ============================================================
// DRAWING
// ============================================================
function drawMaze(){
  ctx.drawImage(mazeImg,0,0);
  // Draw dots & power pellets (not cached because they get eaten)
  for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++){
    if(maze[r][c]===D){
      ctx.fillStyle='#FFB8AE';
      ctx.beginPath();ctx.arc(c*TILE+TILE/2,r*TILE+TILE/2,2,0,Math.PI*2);ctx.fill();
    } else if(maze[r][c]===P){
      if(Math.floor(frameCnt/12)%2===0){
        ctx.fillStyle='#FFB8AE';
        ctx.beginPath();ctx.arc(c*TILE+TILE/2,r*TILE+TILE/2,6,0,Math.PI*2);ctx.fill();
      }
    }
  }
}

function drawPac(){
  if(!pac.alive&&phase!=='dying')return;
  const px=pac.x+TILE/2, py=pac.y+TILE/2, r=TILE/2-1;
  let angle=0;
  if(sameDir(pac.dir,LEFT))angle=Math.PI;
  else if(sameDir(pac.dir,UP))angle=-Math.PI/2;
  else if(sameDir(pac.dir,DOWN))angle=Math.PI/2;

  const m=sameDir(pac.dir,NONE)?0.12:Math.abs(pac.mouth);

  ctx.save();
  ctx.translate(px,py);
  ctx.rotate(angle);
  ctx.fillStyle='#FFD700';
  ctx.beginPath();
  ctx.moveTo(0,0);
  ctx.arc(0,0,r,m*Math.PI,(2-m)*Math.PI);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawGhostBody(gx,gy,color){
  const cx=gx+TILE/2, cy=gy+TILE/2-1;
  const r=TILE/2-1;
  ctx.fillStyle=color;
  ctx.beginPath();
  ctx.arc(cx,cy,r,Math.PI,0);
  // Sides down to bottom
  ctx.lineTo(cx+r,gy+TILE);
  // Wavy bottom
  const w=r*2, segs=3, segW=w/segs;
  for(let i=segs;i>=0;i--){
    const sx=cx-r+i*segW;
    const sy=gy+TILE-(i%2===0?0:4);
    ctx.lineTo(sx,sy);
  }
  ctx.closePath();
  ctx.fill();
}
function drawGhostEyes(gx,gy,dir){
  const offsets=[[TILE*0.3,TILE*0.35],[TILE*0.65,TILE*0.35]];
  let dx=0,dy=0;
  if(sameDir(dir,LEFT))dx=-2;
  if(sameDir(dir,RIGHT))dx=2;
  if(sameDir(dir,UP))dy=-2;
  if(sameDir(dir,DOWN))dy=2;
  offsets.forEach(([ox,oy])=>{
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.ellipse(gx+ox,gy+oy,3.5,4.5,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#00f';
    ctx.beginPath();ctx.ellipse(gx+ox+dx,gy+oy+dy,2,2.5,0,0,Math.PI*2);ctx.fill();
  });
}

function drawGhost(g){
  if(g.state===G_STATE.EATEN){
    drawGhostEyes(g.x,g.y,g.dir);
    return;
  }
  let color=g.color;
  if(g.state===G_STATE.FRIGHT){
    color=(frightTimer<120&&Math.floor(frameCnt/8)%2===0)?'#fff':'#2121DE';
  }
  drawGhostBody(g.x,g.y,color);
  if(g.state===G_STATE.FRIGHT){
    // Scared face
    ctx.fillStyle='#fff';
    ctx.beginPath();ctx.arc(g.x+TILE*0.33,g.y+TILE*0.35,2,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.arc(g.x+TILE*0.67,g.y+TILE*0.35,2,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#fff';ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(g.x+4,g.y+TILE*0.55);
    for(let i=0;i<5;i++) ctx.lineTo(g.x+4+i*3,g.y+TILE*(i%2===0?0.55:0.65));
    ctx.stroke();
  } else {
    drawGhostEyes(g.x,g.y,g.dir);
  }
}

function drawLivesHUD(){
  const el=document.getElementById('lives');
  el.innerHTML='';
  for(let i=0;i<lives-1;i++){
    const c=document.createElement('canvas');c.width=20;c.height=20;
    const x=c.getContext('2d');
    x.fillStyle='#FFD700';x.beginPath();x.moveTo(10,10);
    x.arc(10,10,8,0.2*Math.PI,1.8*Math.PI);x.closePath();x.fill();
    el.appendChild(c);
  }
}

function drawText(text,y,color,size){
  ctx.font=(size||18)+'px "Press Start 2P",monospace';
  ctx.textAlign='center';
  ctx.fillStyle=color||'#FFD700';
  ctx.fillText(text,canvas.width/2,y);
}

function drawDyingAnim(){
  const progress=1-phaseTimer/90;
  const px=pac.x+TILE/2,py=pac.y+TILE/2,r=TILE/2-1;
  const open=progress*Math.PI;
  ctx.fillStyle='#FFD700';
  ctx.beginPath();ctx.moveTo(px,py);
  ctx.arc(px,py,r,Math.PI/2+open,Math.PI/2+Math.PI*2-open);
  ctx.closePath();ctx.fill();
}

function updateHUD(){
  if(score>highScore){highScore=score;localStorage.setItem('pacHS',highScore);}
  document.getElementById('score1up').textContent=String(score).padStart(6,' ');
  document.getElementById('highScore').textContent=String(highScore).padStart(6,' ');
  drawLivesHUD();
}

// ============================================================
// GAME FLOW
// ============================================================
function startLevel(){
  initMaze(); cacheMaze();
  resetPac(); resetGhosts();
  pacPending=NONE; ghostP2Pending=NONE;
  modeIdx=0; modeTimer=MODE_DUR[0];
  phase='ready'; phaseTimer=150;
  updateHUD();
}

function afterDeath(){
  lives--;
  updateHUD();
  if(lives<=0){
    phase='gameover'; phaseTimer=0;
  } else {
    resetPac(); resetGhosts();
    pacPending=NONE; ghostP2Pending=NONE;
    phase='ready'; phaseTimer=120;
  }
}

function nextLevel(){
  level++;
  ghosts.forEach(g=>g.speed=Math.min(2+level*0.15,4));
  startLevel();
}

function restartGame(){
  score=0; lives=3; level=1;
  startLevel();
}

// ============================================================
// MAIN LOOP
// ============================================================
function gameLoop(){
  frameCnt++;
  ctx.fillStyle='#000';ctx.fillRect(0,0,canvas.width,canvas.height);

  drawMaze();

  switch(phase){
    case'ready':
      ghosts.forEach(drawGhost);
      drawPac();
      drawText('READY!',canvas.height/2+6,'#FFD700',20);
      phaseTimer--;
      if(phaseTimer<=0)phase='playing';
      break;

    case'playing':
      // Scatter/chase timer
      modeTimer--;
      if(modeTimer<=0)advanceMode();

      tickFright();
      movePac();
      ghosts.forEach(moveGhost);
      checkCollisions();

      if(dotsLeft<=0){
        if(gameMode==='multi'){
          phase='multiwin'; phaseTimer=0;
        } else {
          phase='levelclear'; phaseTimer=120;
        }
      }

      ghosts.forEach(drawGhost);
      drawPac();

      if(gameMode==='multi'){
        // Show P2 info
        drawText('P1:WASD  P2:ARROWS',ROWS*TILE-4,'#888',7);
      }
      break;

    case'dying':
      ghosts.forEach(drawGhost);
      drawDyingAnim();
      phaseTimer--;
      if(phaseTimer<=0)afterDeath();
      break;

    case'levelclear':
      drawPac();
      // Flash maze
      if(Math.floor(frameCnt/10)%2===0) ctx.drawImage(mazeImg,0,0);
      drawText('LEVEL '+(level+1),canvas.height/2-10,'#00FFFF',18);
      drawText('GET READY!',canvas.height/2+20,'#fff',12);
      phaseTimer--;
      if(phaseTimer<=0)nextLevel();
      break;

    case'gameover':
      ghosts.forEach(drawGhost);
      drawText('GAME OVER',canvas.height/2,'#FF0000',22);
      drawText('PRESS ENTER',canvas.height/2+30,'#fff',10);
      break;

    case'multiwin':
      drawPac();
      drawText('PAC-MAN WINS!',canvas.height/2-10,'#FFD700',18);
      drawText('PRESS ENTER',canvas.height/2+25,'#fff',10);
      break;
  }

  requestAnimationFrame(gameLoop);
}

// ============================================================
// MODE SELECT UI
// ============================================================
document.getElementById('btnSingle').addEventListener('click',()=>{
  gameMode='single';
  document.getElementById('p2label').textContent='';
  document.getElementById('score2up').textContent='';
  beginGame();
});
document.getElementById('btnMulti').addEventListener('click',()=>{
  gameMode='multi';
  document.getElementById('p2label').textContent='2UP';
  document.getElementById('score2up').textContent='GHOST';
  document.getElementById('multiControls').textContent='P1 WASD: PAC-MAN  |  P2 ARROWS: GHOST';
  beginGame();
});

function beginGame(){
  document.getElementById('modeScreen').style.display='none';
  document.getElementById('gameWrapper').style.display='flex';
  score=0; lives=3; level=1;
  startLevel();
  requestAnimationFrame(gameLoop);
}
