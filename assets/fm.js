// Frame Medic · small helpers shared by the embeds.
const FM = (() => {
  const PLUS = '<svg viewBox="0 0 3 3"><path fill="currentColor" d="M1 0h1v1h1v1H2v1H1V2H0V1h1z"/></svg>';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ease = t => 1 - Math.pow(1 - t, 3);

  // Fires once when the frame is really on screen in the parent page (works in a cross-origin iframe).
  function onView(el, cb, thr = 0.35) {
    if (!('IntersectionObserver' in window)) { cb(); return; }
    let done = false;
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (!done && e.isIntersecting && e.intersectionRatio >= thr) { done = true; io.disconnect(); cb(); } });
    }, { threshold: [0, thr, 1] });
    io.observe(el);
  }

  function count(el, from, to, dur = 1200, dec = null) {
    const d = dec ?? (String(to).includes('.') ? String(to).split('.')[1].length : 0);
    if (reduce) { el.textContent = to.toFixed(d); return; }
    const t0 = performance.now();
    const step = now => {
      const t = Math.min(1, (now - t0) / dur);
      el.textContent = (from + (to - from) * ease(t)).toFixed(d);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function burst(host, x, y, n = 10, colors = ['#CEFF05', '#FF2E9B', '#ffffff']) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      s.className = 'burst';
      const a = Math.random() * Math.PI * 2, r = 30 + Math.random() * 60;
      s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * r + 'px'); s.style.setProperty('--dy', Math.sin(a) * r + 'px');
      s.style.color = colors[i % colors.length];
      s.innerHTML = PLUS;
      host.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }
  }

  return { onView, count, burst, PLUS, reduce, ease };
})();
