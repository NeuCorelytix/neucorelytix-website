/* Bootstrap — run after all feature modules load */
document.addEventListener('DOMContentLoaded', () => {
    initLanguageSystem();
    initStickyHeader();
    initMobileNav();
    initHeroVoiceInput();
    initProblemModal();
    initFormHandlers();
    initProblemCarousel();
    initEasierTabs();
});
