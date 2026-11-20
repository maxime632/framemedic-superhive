// Frame Medic widgets: small helpers shared by the embeds in the Superhive page.
const W = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => 1 - Math.pow(1 - t, 3);
  const wait = ms => new Promise(r => setTimeout(r, reduce ? 0 : ms));
  // calls cb(true/false) as the frame comes on and goes off screen in the parent page (works cross-origin)
  function view(el, cb, thr = 0.35) {
    if (!('IntersectionObserver' in window)) { cb(true); return; }
    new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting && e.intersectionRatio >= thr)), {threshold: [0, thr, 1]}).observe(el);
  }
  function count(el, from, to, dur = 1200, dec = 1, suf = '') {
    if (reduce) { el.textContent = to.toFixed(dec) + suf; return; }
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = (from + (to - from) * ease(t)).toFixed(dec) + suf;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const PLUS = '<svg viewBox="0 0 3 3" aria-hidden="true"><path fill="currentColor" d="M1 0h1v1h1v1H2v1H1V2H0V1h1z"/></svg>';
  return {reduce, ease, wait, view, count, PLUS};
})();
