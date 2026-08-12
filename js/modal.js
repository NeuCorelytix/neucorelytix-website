/* Consultation modal — open/close, Escape/backdrop, exposes window.openProblemModal */
function initProblemModal() {
    const modal = document.getElementById('problemModal');
    const problemInput = document.getElementById('modalProblemText');
    const modalCard = modal ? modal.querySelector('.modal-card') : null;

    if (!modal) return;

    function openModal(prefillTitle = '') {
        // Stop any active microphone listening when modal opens!
        if (window.stopAllVoiceInput) window.stopAllVoiceInput();

        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (modalCard) modalCard.scrollTop = 0;

        if (problemInput) {
            if (prefillTitle) {
                problemInput.value = prefillTitle;
            }
            const modalBiz = document.getElementById('modalBusinessText');
            const modalName = document.getElementById('modalUserName') || document.getElementById('modalName');
            
            if (problemInput.value.trim() && modalBiz && !modalBiz.value) {
                modalBiz.focus();
            } else if (modalName && !modalName.value) {
                modalName.focus();
            } else {
                problemInput.focus();
            }
        }
    }

    // Export openModal globally so hero form can call it
    window.openProblemModal = openModal;

    function closeModal() {
        if (window.stopAllVoiceInput) window.stopAllVoiceInput();
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.open-problem-modal').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const title = btn.getAttribute('data-problem-title') || '';
            openModal(title);
        });
    });

    document.querySelectorAll('#modalClose, #modalCloseBtn, .modal-close, .modal-close-btn').forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}
