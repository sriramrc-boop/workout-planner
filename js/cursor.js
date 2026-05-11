document.addEventListener('DOMContentLoaded', () => {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    // 1. Track Mouse Position
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // The dot follows perfectly
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    // 2. The Lag Logic (Linear Interpolation)
    function animate() {
        // The ring moves 15% of the distance to the mouse every frame
        // This creates that "smooth following" feel
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;

        ring.style.left = ringX + 'px';
        ring.style.top = ringY + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // 3. Hover Effects for Buttons/Links
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