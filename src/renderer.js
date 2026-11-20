const G = window.SolitaireGame;
let game = G.newGame();
let snapshots = [];
let selected = null;
let patterns = [];
const $ = id => document.getElementById(id);
const cardHtml = (c, extra='') => c ? '<div class="card '+(G.red(c.suit)?'red ':'')+(c.faceUp?'':'face-down ')+extra+'" data-card="'+c.id+'">'+(c.faceUp?G.cardName(c):'')+'</div>' : '';
function render() {
  $('stats').textContent = 'Langkah: '+game.moves;
  $('status').textContent = game.won ? 'Menang! Pola telah disimpan.' : 'Pilih kartu, lalu pilih tujuan yang valid.';
  $('stock').className = 'pile '+(game.stock.length?'back':'placeholder');
  $('stock').textContent = game.stock.length ? '' : '↶';
  $('waste').innerHTML = game.waste.length ? cardHtml(game.waste[game.waste.length-1]) : '<div class="pile placeholder">♧</div>';
  $('foundations').innerHTML = game.foundations.map((p,i)=>'<div class="pile placeholder" data-foundation="'+i+'">'+(p.length?cardHtml(p[p.length-1]):['♠','♥','♦','♣'][i])+'</div>').join('');
  $('tableau').innerHTML = game.tableau.map((p,i)=>'<div class="column" data-column="'+i+'">'+p.map((c,j)=>'<div style="top:'+(j*25)+'px" class="'+(c.faceUp?'':'card face-down')+'" data-col="'+i+'" data-index="'+j+'">'+(c.faceUp?'<div class="card '+(G.red(c.suit)?'red':'')+(selected&&selected.type==='tableau'&&selected.index===i&&selected.index2===j?' selected':'')+'">'+G.cardName(c)+'</div>':'')+'</div>').join('')+'</div>').join('');
  const ct=G.counts(game);
  $('patternInfo').innerHTML='<div class="pattern-meta">Kartu terbuka: <b>'+ct.openCount+'</b> · Kartu tertutup: <b>'+ct.hiddenCount+'</b><br>Terbuka: '+ct.openCards.join(', ')+'<br>Tertutup: '+ct.hiddenCards.join(', ')+'</div>';
  if(game.won) saveCurrent('completed');
}
function saveCurrent(status) {
  if(game._saved) return;
  game._saved=true;
  const c=G.counts(game);
  window.recorder.savePattern({id:crypto.randomUUID(),status,createdAt:new Date().toISOString(),moves:game.moves,...c,finalState:game});
}
function selectOrMove(from) {
  if(selected) {
    const next=G.move(game,selected,from);
    if(next){snapshots.push(game);game=next;selected=null;render();return;}
  }
  selected=from; render();
}
$('stock').addEventListener('click',()=>{snapshots.push(game);game=G.draw(game)||game;selected=null;render();});
$('waste').addEventListener('click',()=>{if(game.waste.length)selectOrMove({type:'waste'});});
$('tableau').addEventListener('click',e=>{
 const card=e.target.closest('[data-col]'); if(!card)return;
 const col=Number(card.dataset.col),idx=Number(card.dataset.index);
 const pile=game.tableau[col]; if(!pile[idx].faceUp)return;
 selectOrMove({type:'tableau',index:col,index2:idx});
});
$('foundations').addEventListener('click',e=>{
 const f=e.target.closest('[data-foundation]');if(!f)return;
 if(selected){const next=G.move(game,selected,{type:'foundation',index:Number(f.dataset.foundation)});if(next){snapshots.push(game);game=next;selected=null;render();}}
});
$('newGame').onclick=()=>{if(!game.won&&game.moves>0)saveCurrent('unfinished');snapshots=[];game=G.newGame();selected=null;render();};
$('undo').onclick=()=>{if(snapshots.length){game=snapshots.pop();selected=null;render();}};
$('hint').onclick=()=>{$('status').textContent='Petunjuk: pindahkan kartu terbuka ke kartu berwarna berlawanan dengan nilai satu lebih tinggi; As ke fondasi.';};
$('historyBtn').onclick=showHistory;$('closeHistory').onclick=()=>$('history').classList.add('hidden');
async function showHistory(){patterns=await window.recorder.listPatterns();$('history').classList.remove('hidden');$('patternsList').innerHTML=patterns.length?patterns.map(p=>'<div class="pattern-row"><div><strong>'+(p.status==='completed'?'Menang':'Belum selesai')+' · '+new Date(p.createdAt).toLocaleString('id-ID')+'</strong><small>'+p.moves+' langkah · '+p.openCount+' terbuka · '+p.hiddenCount+' tertutup</small></div><button class="secondary" data-delete="'+p.id+'">Hapus</button></div>').join(''):'<div class="empty">Belum ada pola yang tersimpan.</div>';}
$('patternsList').addEventListener('click',async e=>{const id=e.target.dataset.delete;if(id){await window.recorder.deletePattern(id);showHistory();}});
window.addEventListener('beforeunload',()=>{if(!game.won&&game.moves>0)saveCurrent('unfinished');});
render();
