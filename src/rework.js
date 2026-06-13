// =======================
// REWORK — Scroll-Reveals & Aufnäher-Wand
// Progressive Enhancement: ohne JS bleibt alles sichtbar.
// =======================

// Signalisiert dem CSS, dass JS aktiv ist (versteckt [data-reveal] erst jetzt)
document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', () => {
    const reveals = document.querySelectorAll('[data-reveal]');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduceMotion || !('IntersectionObserver' in window)) {
        reveals.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    reveals.forEach((el) => observer.observe(el));
});
