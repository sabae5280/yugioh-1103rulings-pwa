(() => {
  const frames = [...document.querySelectorAll('.hero-frame')];
  if (frames.length !== 2) return;
  const hero = document.querySelector('.hero');
  const button = document.querySelector('#heroMotion');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let bag = [], last = 0, active = -1, timer, paused = false, visible = true, pending, revision = 0;
  const animations = [];
  const running = () => !paused && !document.hidden && visible && !reduced.matches;
  function next() {
    if (!bag.length) {
      bag = Array.from({length:19}, (_, i) => i + 1);
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[0] === last) [bag[0], bag[1]] = [bag[1], bag[0]];
    }
    return last = bag.shift();
  }
  function load(id) {
    const url = `./images/heroes-20261012/hero-${String(id).padStart(2,'0')}.webp`;
    return new Promise(resolve => {
      const img = new Image();
      img.onload = async () => { try { await img.decode(); } catch (_) {} resolve({id,url}); };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  }
  function show(art) {
    active = (active + 1) % 2;
    const frame = frames[active], inner = frame.firstElementChild;
    animations[active]?.cancel();
    inner.style.backgroundImage = `url("${art.url}")`;
    frame.classList.add('is-visible');
    frames[1-active].classList.remove('is-visible');
    hero.dataset.artwork = String(art.id);
    if (!reduced.matches) {
      const x = Math.random() < .5 ? -1 : 1, y = Math.random() < .5 ? -1 : 1;
      animations[active] = inner.animate([
        {transform:`scale(1.05) translate(${-x}%,${-y * .5}%)`},
        {transform:`scale(1.09) translate(${x}%,${y * .5}%)`}
      ], {duration:9000,fill:'forwards',easing:'linear'});
      if (!running()) animations[active].pause();
    }
  }
  function schedule() {
    clearTimeout(timer);
    const current = ++revision;
    if (!running()) return;
    pending ||= load(next());
    timer = setTimeout(async () => {
      const art = await pending;
      if (!running() || current !== revision) return;
      pending = null;
      if (art) show(art);
      schedule();
    },7000);
  }
  function sync() {
    animations.forEach(a => running() ? a?.play() : a?.pause());
    button.hidden = reduced.matches;
    schedule();
  }
  button.addEventListener('click', () => {
    paused = !paused;
    button.setAttribute('aria-pressed',String(paused));
    button.setAttribute('aria-label',paused ? '背景の動きと切り替えを再開' : '背景の動きと切り替えを一時停止');
    button.textContent = paused ? '▶' : 'Ⅱ';
    sync();
  });
  document.addEventListener('visibilitychange',sync);
  reduced.addEventListener('change',sync);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }).observe(hero);
  (async () => {
    const art = await load(next()) || await load(1);
    if (art) show(art);
    sync();
  })();
})();
