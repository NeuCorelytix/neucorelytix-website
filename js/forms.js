/* Formspree + Google Sheets Submission Engine (needs i18n.js + modal.js first) */
window.GOOGLE_SHEETS_WEBHOOK_URL = window.GOOGLE_SHEETS_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbwlQeIO-Yn2bWbPGe6XOq93qBV_yvgsxQ_pCRO9T3mssDOOzqmkO0JU8iJeCqjgft2Hbw/exec";

function initFormHandlers() {
    const toast = document.getElementById('toastNotification');
    const toastTitle = document.getElementById('toastTitle');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(title, message) {
        if (!toast) return;
        if (toastTitle) toastTitle.textContent = title;
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 5000);
    }

    // Hero Form intercepts submission -> opens modal to collect name/contact/business info!
    const heroForm = document.getElementById('heroProblemForm');
    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const heroInput = document.getElementById('heroProblemInput');
            const problemText = heroInput ? heroInput.value.trim() : '';

            if (window.openProblemModal) {
                window.openProblemModal(problemText);
            }
        });
    }

    // Modal Form performs Formspree submission + Google Sheets logging
    const modalForm = document.getElementById('modalProblemForm');
    if (modalForm) {
        modalForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = modalForm.querySelector('button[type="submit"]');
            const data = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang] : {
                toast_success_title: "Problem Submitted!",
                toast_success_msg: "Thank you! We received your problem description."
            };

            if (submitBtn) submitBtn.disabled = true;

            try {
                const formData = new FormData(modalForm);
                const payload = {
                    timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                    user_name: formData.get('user_name') || formData.get('name') || '',
                    user_contact: formData.get('user_contact') || formData.get('contact') || '',
                    business_description: formData.get('business_description') || '',
                    business_website: formData.get('business_website') || '',
                    problem_description: formData.get('problem_description') || '',
                    source_page: document.title || window.location.href,
                    _subject: formData.get('_subject') || "NeuCorelytix Consultation Lead"
                };

                // 1. Post to Formspree
                const formspreePromise = fetch(modalForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' }
                });

                // 2. Post to Google Sheets if Webhook URL exists
                let sheetsPromise = Promise.resolve();
                if (window.GOOGLE_SHEETS_WEBHOOK_URL) {
                    const params = new URLSearchParams();
                    Object.keys(payload).forEach(key => params.append(key, payload[key]));

                    sheetsPromise = fetch(window.GOOGLE_SHEETS_WEBHOOK_URL, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params.toString()
                    }).catch(err => console.warn('Google Sheets webhook notice:', err));
                }

                const [response] = await Promise.all([formspreePromise, sheetsPromise]);

                if (response.ok) {
                    modalForm.reset();
                    const heroInput = document.getElementById('heroProblemInput');
                    if (heroInput) heroInput.value = '';

                    showToast(data.toast_success_title, data.toast_success_msg);

                    const modal = document.getElementById('problemModal');
                    if (modal && modal.classList.contains('active')) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                } else {
                    showToast('Submission Issue', 'There was a problem sending your message. Please try again.');
                }
            } catch (err) {
                console.error('Form submit error:', err);
                showToast('Submission Issue', 'Network error. Please check your connection and try again.');
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
}
