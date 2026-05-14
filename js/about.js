document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
         threshold: 0.1, 
        rootMargin: "0px 0px -100px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                  entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        observer.observe(el);
    });
});