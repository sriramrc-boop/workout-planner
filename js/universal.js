document.addEventListener("DOMContentLoaded", () => {
    // 1. Page Transition Logic
    const links = document.querySelectorAll("a");
    links.forEach(link => {
        link.addEventListener("click", (e) => {
            const target = link.getAttribute("href");
            // Ignore if it's the current page or a purely internal link
            if (target === "#" || target.startsWith("http") || link.id === "active") return;
            
            e.preventDefault();
            document.body.classList.add("fade-out");
            setTimeout(() => {
                window.location.href = target;
            }, 450); // Matches CSS animation duration
        });
    });

    // 2. Scroll Reveal Logic (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-scroll');
            }
        });
    });

    const hiddenElements = document.querySelectorAll('.hidden-scroll');
    hiddenElements.forEach((el) => observer.observe(el));
});

function expandLogo(){
    
}