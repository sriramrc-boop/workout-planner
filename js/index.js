function animateCount(el, target, duration) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
        start += step;
        if (start >= target) { el.textContent = target; clearInterval(timer); }
        else el.textContent = start;
    }, 16);
}

const banner = document.getElementById('streak-banner');
let animated = false;
const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
        animated = true;
        animateCount(document.getElementById('streak-count'), 7, 800);
        animateCount(document.getElementById('workout-count'), 42, 1000);
        animateCount(document.getElementById('personal-bests'), 5, 700);
    }
}, { threshold: 0.4 });
observer.observe(banner);

const steps = document.querySelectorAll('.step');
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: 0.2 });
steps.forEach(s => revealObserver.observe(s));