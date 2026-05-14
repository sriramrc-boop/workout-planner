document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        // Triggering at 10% ensures it stays visible until almost gone
        threshold: 0.1, 
        rootMargin: "0px 0px -100px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                // This ensures the "exit" is smooth by removing the class 
                // only when the element has significantly left the viewport
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});