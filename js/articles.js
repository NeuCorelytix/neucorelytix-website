/* Decision guides carousel — scroll-snap track with arrow navigation */
function initArticlesCarousel() {
    const track = document.getElementById('articlesTrack');
    const prev = document.getElementById('articlesPrev');
    const next = document.getElementById('articlesNext');

    if (!track || !prev || !next) return;

    const step = () => {
        const card = track.querySelector('.article-card');
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return card.offsetWidth + gap;
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
}
