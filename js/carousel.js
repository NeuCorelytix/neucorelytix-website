/* Problem-card carousel: prev/next, dots, responsive count, hover-paused autoplay */
function initProblemCarousel() {
    const track = document.getElementById('problemCarouselTrack');
    const prevBtn = document.getElementById('problemCarouselPrev');
    const nextBtn = document.getElementById('problemCarouselNext');
    const dotsContainer = document.getElementById('problemCarouselDots');

    if (!track || !prevBtn || !nextBtn) return;

    const cards = track.querySelectorAll('.problem-card');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.dot') : [];
    let currentIndex = 0;

    function getVisibleCount() {
        if (window.innerWidth < 640) return 1;
        if (window.innerWidth < 992) return 2;
        return 3;
    }

    function updateCarousel() {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(0, cards.length - visibleCount);
        if (currentIndex > maxIndex) currentIndex = 0;
        if (currentIndex < 0) currentIndex = maxIndex;

        const firstCard = cards[0];
        if (!firstCard) return;
        const cardWidth = firstCard.offsetWidth + 24; // width + gap
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // ponytail: kept as translateX + currentIndex; scroll-snap would need touching wrap + mobile dots
    function advance(dir) {
        const visibleCount = getVisibleCount();
        const maxIndex = Math.max(0, cards.length - visibleCount);
        currentIndex = (currentIndex + dir + maxIndex + 1) % (maxIndex + 1);
        updateCarousel();
    }

    nextBtn.addEventListener('click', () => advance(1));
    prevBtn.addEventListener('click', () => advance(-1));

    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            currentIndex = idx;
            updateCarousel();
        });
    });

    // Auto-loop every 5 seconds, paused while hovering
    let autoInterval;
    const startAuto = () => {
        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => advance(1), 5000);
    };
    startAuto();
    track.addEventListener('mouseenter', () => clearInterval(autoInterval));
    track.addEventListener('mouseleave', startAuto);

    window.addEventListener('resize', updateCarousel);
    updateCarousel();
}
