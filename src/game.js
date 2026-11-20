const SUITS = ['♠','♥','♦','♣'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const red = suit => suit === '♥' || suit === '♦';
const cardName = c => c ? c.rank + c.suit : '—';
function deck() {
  return SUITS.flatMap(suit => RANKS.map((rank, i) => ({
    id: suit + rank, suit, rank, value: i + 1, faceUp: false
  })));
}
function shuffle(cards) {
  const a = [...cards];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function newGame() {
  const cards = shuffle(deck());
  let at = 0;
  const tableau = Array.from({length:7}, (_, col) => {
    const pile = cards.slice(at, at + col + 1); at += col + 1;
    pile.forEach((c, i) => c.faceUp = i === pile.length - 1);
    return pile;
  });
  return { stock: cards.slice(at), waste: [], foundations: [[],[],[],[]], tableau, moves: 0, won: false };
}
function canStack(card, target) {
  if (!target.length) return card.rank === 'K';
  const top = target[target.length - 1];
  return top.faceUp && red(card.suit) !== red(top.suit) && card.value === top.value - 1;
}
function clone(g) { return JSON.parse(JSON.stringify(g)); }
function move(g, from, to) {
  const n = clone(g);
  let card;
  if (from.type === 'waste') card = n.waste[n.waste.length - 1];
  else if (from.type === 'tableau') card = n.tableau[from.index][from.index2];
  else if (from.type === 'foundation') card = n.foundations[from.index][n.foundations[from.index].length - 1];
  if (!card) return null;
  if (to.type === 'tableau') {
    const pile = n.tableau[to.index];
    if (from.type === 'tableau' && from.index === to.index) return null;
    if (!canStack(card, pile)) return null;
    let moving;
    if (from.type === 'waste') moving = [n.waste.pop()];
    else if (from.type === 'tableau') moving = n.tableau[from.index].splice(from.index2);
    else moving = [n.foundations[from.index].pop()];
    n.tableau[to.index].push(...moving);
    if (from.type === 'tableau') reveal(n.tableau[from.index]);
  } else if (to.type === 'foundation') {
    const pile = n.foundations[to.index];
    if (from.type === 'tableau' && from.index2 !== n.tableau[from.index].length - 1) return null;
    if (from.type === 'foundation') return null;
    if (pile.length === 0 ? card.rank !== 'A' : (pile[pile.length-1].suit !== card.suit || card.value !== pile[pile.length-1].value + 1)) return null;
    if (from.type === 'waste') n.waste.pop();
    else { n.tableau[from.index].pop(); reveal(n.tableau[from.index]); }
    n.foundations[to.index].push(card);
  } else return null;
  n.moves++;
  n.won = n.foundations.every(p => p.length === 13);
  return n;
}
function reveal(pile) {
  if (pile.length && !pile[pile.length - 1].faceUp) pile[pile.length - 1].faceUp = true;
}
function draw(g) {
  const n = clone(g);
  if (n.stock.length) {
    const c = n.stock.pop(); c.faceUp = true; n.waste.push(c);
  } else if (n.waste.length) {
    n.stock = n.waste.reverse().map(c => ({...c, faceUp:false}));
    n.waste = [];
  } else return null;
  n.moves++;
  return n;
}
function counts(g) {
  const all = [...g.stock, ...g.waste, ...g.foundations.flat(), ...g.tableau.flat()];
  const open = all.filter(c => c.faceUp);
  const hidden = all.filter(c => !c.faceUp);
  return { openCount: open.length, hiddenCount: hidden.length,
    openCards: open.map(cardName), hiddenCards: hidden.map(cardName) };
}
window.SolitaireGame = { newGame, move, draw, counts, cardName, red };
