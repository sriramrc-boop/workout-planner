document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function animate() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    const interactables = document.querySelectorAll('button, a, .menu-toggle, .split');
    
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            ring.classList.add('active');
            dot.classList.add('hidden');
        });
        el.addEventListener('mouseleave', () => {
            ring.classList.remove('active');
            dot.classList.remove('hidden');
        });
    });
});