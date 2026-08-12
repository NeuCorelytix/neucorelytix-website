/* Multilingual system — language data lives in js/translations.js (load it first) */
window.translations = {
    en: window.NeoLang.en,
    hi: window.NeoLang.hi,
    te: window.NeoLang.te
};

let currentLang = "en";

function initLanguageSystem() {
    const dropdown = document.getElementById('langSelectorDropdown');
    const btn = document.getElementById('langBtn');
    const selectedText = document.getElementById('selectedLangText');
    const options = document.querySelectorAll('.lang-option');

    currentLang = detectUserLanguage();
    applyLanguage(currentLang);

    if (btn && dropdown) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('open');
            btn.setAttribute('aria-expanded', dropdown.classList.contains('open'));
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('open');
            btn.setAttribute('aria-expanded', 'false');
        });
    }

    options.forEach((opt) => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = opt.getAttribute('data-lang');
            if (lang && translations[lang]) {
                currentLang = lang;
                localStorage.setItem('neucorelytix_lang', lang);
                applyLanguage(lang);
                if (dropdown) dropdown.classList.remove('open');
            }
        });
    });

    function applyLanguage(lang) {
        const data = translations[lang] || translations.en;

        if (selectedText) {
            if (lang === 'hi') selectedText.textContent = 'हिंदी';
            else if (lang === 'te') selectedText.textContent = 'తెలుగు';
            else selectedText.textContent = 'English';
        }

        options.forEach((opt) => {
            if (opt.getAttribute('data-lang') === lang) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (data[key]) {
                el.innerHTML = data[key];
            }
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (data[key]) {
                el.setAttribute('placeholder', data[key]);
            }
        });

        const hiddenInput1 = document.getElementById('userLanguageHidden');
        const hiddenInput2 = document.getElementById('modalUserLanguageHidden');
        if (hiddenInput1) hiddenInput1.value = lang;
        if (hiddenInput2) hiddenInput2.value = lang;

        document.documentElement.lang = lang;
    }
}

function detectUserLanguage() {
    const saved = localStorage.getItem('neucorelytix_lang');
    if (saved && translations[saved]) return saved;

    const navLangs = navigator.languages || [navigator.language || navigator.userLanguage || 'en'];
    for (let l of navLangs) {
        if (l) {
            const code = l.toLowerCase();
            if (code.startsWith('te')) return 'te';
            if (code.startsWith('hi')) return 'hi';
        }
    }

    return 'en';
}
