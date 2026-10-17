(() => {
  // lights
  const root = document.documentElement, lights = document.getElementById('lights'), label = document.getElementById('lightsLabel');
  const setDark = d => { root.classList.toggle('dark', d); label.textContent = d ? 'Lights on' : 'Lights off'; lights.setAttribute('aria-pressed', d); };
  let dark = root.classList.contains('dark');
  setDark(dark);
  lights.addEventListener('click', () => { dark = !dark; setDark(dark); try { localStorage.setItem('desk-dark', dark ? '1' : '0'); } catch (e) {} });

  // time in Pune
  const t = document.getElementById('time');
  const tick = () => { t.textContent = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }).format(new Date()).toLowerCase(); };
  tick(); setInterval(tick, 20000);

  // the knight
  const hero = document.getElementById('top'), board = document.getElementById('board'), knight = document.getElementById('knight'), cue = document.getElementById('cue');
  for (let i = 0; i < 64; i++) board.appendChild(document.createElement('i'));
  const touch = matchMedia('(hover: none)').matches;
  if (touch) cue.textContent = 'Tap a square and the knight finds its way there.';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pos = [5, 1], moving = false, queue = [], lastHop = 0, moved = false; // [col,row], row 0 at top
  const MOVES = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
  const key = ([c, r]) => c * 8 + r;

  function place() {
    const r = hero.getBoundingClientRect(), cw = r.width / 8, ch = r.height / 8;
    knight.style.transform = `translate(${(pos[0] + .5) * cw}px, ${(pos[1] + .5) * ch}px)`;
  }
  function path(from, to) { // BFS over knight moves
    if (key(from) === key(to)) return [];
    const prev = new Map([[key(from), null]]), q = [from];
    while (q.length) {
      const cur = q.shift();
      for (const [dc, dr] of MOVES) {
        const n = [cur[0] + dc, cur[1] + dr];
        if (n[0] < 0 || n[0] > 7 || n[1] < 0 || n[1] > 7 || prev.has(key(n))) continue;
        prev.set(key(n), cur);
        if (key(n) === key(to)) {
          const out = [n]; let p = cur;
          while (p && key(p) !== key(from)) { out.unshift(p); p = prev.get(key(p)); }
          return out;
        }
        q.push(n);
      }
    }
    return [];
  }
  function hopTo(sq) {
    pos = sq; place();
    if (!reduce) { knight.classList.remove('hop'); void knight.offsetWidth; knight.classList.add('hop'); }
    if (!moved && !touch) { moved = true; cue.textContent = 'Click a square and it takes the shortest route.'; }
  }
  function drain() {
    if (!queue.length) { moving = false; return; }
    moving = true; hopTo(queue.shift()); setTimeout(drain, reduce ? 0 : 380);
  }
  function squareAt(x, y) {
    const r = hero.getBoundingClientRect();
    const clamp = v => Math.min(7, Math.max(0, Math.floor(v)));
    return [clamp((x - r.left) / r.width * 8), clamp((y - r.top) / r.height * 8)];
  }
  hero.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse' || moving) return;
    const now = performance.now(); if (now - lastHop < 420) return;
    const p = path(pos, squareAt(e.clientX, e.clientY)); if (!p.length) return;
    lastHop = now; hopTo(p[0]);
  });
  hero.addEventListener('click', e => {
    if (e.target.closest('a,button')) return;
    queue = path(pos, squareAt(e.clientX, e.clientY)); if (!moving) drain();
  });
  addEventListener('resize', place);
  place();
  requestAnimationFrame(() => knight.classList.add('ready'));
})();
