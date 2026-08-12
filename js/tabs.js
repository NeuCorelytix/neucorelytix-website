/* "What can we make easier?" tab switcher */
function initEasierTabs() {
    const tabsNav = document.getElementById('easierTabsNav');
    const panelsContainer = document.getElementById('easierTabPanels');

    if (!tabsNav || !panelsContainer) return;

    const tabBtns = tabsNav.querySelectorAll('.easier-tab-btn');
    const panels = panelsContainer.querySelectorAll('.easier-panel');

    tabBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.toggle('active', b === btn));
            panels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
        });
    });
}
