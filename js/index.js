// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
    const splits = document.querySelectorAll('.split');

    splits.forEach(split => {
        const video = split.querySelector('.bg-video');

        split.addEventListener('mouseenter', () => {
            // Play the video and handle potential browser blocks
            video.play().catch(error => {
                console.log("Autoplay prevented: ", error);
            });
        });

        split.addEventListener('mouseleave', () => {
            // Pause and reset to start when mouse leaves
            video.pause();
            video.currentTime = 0; 
        });
    });
});

