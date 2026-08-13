/* Multilingual system — language data lives in js/translations.js (load it first) */
window.translations = {
    en: window.NeoLang.en,
    hi: window.NeoLang.hi,
    te: window.NeoLang.te
};

let currentLang = "en";

function initLanguageSystem() {
    currentLang = detectUserLanguage();
    applyLanguage(currentLang);

    function applyLanguage(lang) {
        const data = translations[lang] || translations.en;

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
