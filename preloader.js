/**
 * Mini Punjab Restaurant - Premium Preloader Script
 * Handles the 1-2-3 countdown, Boom effect, and Welcome message.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Show preloader only once per session
    if (sessionStorage.getItem('preloader_shown')) return;
    sessionStorage.setItem('preloader_shown', 'true');

    // Check if preloader element already exists
    if (document.getElementById('preloader')) return;

    // Create Preloader Elements
    const preloader = document.createElement('div');
    preloader.id = 'preloader';
    preloader.className = 'preloader';

    preloader.innerHTML = `
        <div class="preloader-bg-flash" id="flash"></div>
        <div class="preloader-content">
            <span id="countdown">1</span>
            <div id="welcome-line" class="welcome-line">Let's Welcome at Mini Punjab Restaurant.</div>
        </div>
        <div id="boom-ring" class="boom-ring"></div>
    `;

    document.body.prepend(preloader);
    document.body.style.overflow = 'hidden'; // Prevent scroll

    const countdownEl = document.getElementById('countdown');
    const welcomeLine = document.getElementById('welcome-line');
    const boomRing = document.getElementById('boom-ring');
    const flash = document.getElementById('flash');

    let currentCount = 1;
    const maxCount = 3;

    // Initial animation for '1'
    countdownEl.classList.add('animate');

    // Countdown Logic
    const interval = setInterval(() => {
        currentCount++;

        if (currentCount <= maxCount) {
            // Remove/Add class to re-trigger animation
            countdownEl.classList.remove('animate');
            void countdownEl.offsetWidth; // Force reflow
            countdownEl.textContent = currentCount;
            countdownEl.classList.add('animate');
        } else {
            clearInterval(interval);
            triggerBoomEffect();
        }
    }, 1000);

    function triggerBoomEffect() {
        // Hide countdown
        countdownEl.style.display = 'none';

        // Flash screen
        flash.style.animation = 'flashEffect 0.5s ease-out forwards';

        // Boom ring animation
        boomRing.style.animation = 'boomRingEffect 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards';

        // Show welcome message
        setTimeout(() => {
            welcomeLine.style.opacity = '1';
            welcomeLine.style.animation = 'welcomeReveal 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';

            // Fade out preloader after delay
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                document.body.style.overflow = ''; // Restore scroll

                // Remove from DOM after transition
                setTimeout(() => {
                    preloader.remove();
                }, 1000);
            }, 3000); // Wait 3 seconds to let the message be read
        }, 300);
    }
});
