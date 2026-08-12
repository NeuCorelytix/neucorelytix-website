/* Speech-to-text dictation for inputs and textareas (needs i18n.js first) */
window.activeVoiceRecognitions = window.activeVoiceRecognitions || [];

window.stopAllVoiceInput = function() {
    if (window.activeVoiceRecognitions && window.activeVoiceRecognitions.length) {
        window.activeVoiceRecognitions.forEach(recObj => {
            try {
                if (recObj.rec) recObj.rec.stop();
                if (recObj.btn) recObj.btn.classList.remove('recording');
                if (recObj.status) recObj.status.classList.remove('active');
            } catch (err) {}
        });
        window.activeVoiceRecognitions = [];
    }
};

function initHeroVoiceInput() {
    setupVoiceInput('heroVoiceBtn', 'heroProblemInput', 'heroVoiceStatus');
    setupVoiceInput('modalVoiceBtn', 'modalProblemText', 'modalVoiceStatus');
    setupVoiceInput('modalBusinessVoiceBtn', 'modalBusinessText', 'modalBusinessVoiceStatus');

    // Automatically stop voice dictation whenever any form SUBMIT occurs or send button is clicked
    document.querySelectorAll('button[type="submit"], .btn-hero-send').forEach(el => {
        el.addEventListener('click', () => {
            window.stopAllVoiceInput();
        });
    });

    document.querySelectorAll('form').forEach(f => {
        f.addEventListener('submit', () => {
            window.stopAllVoiceInput();
        });
    });
}

function setupVoiceInput(btnId, inputId, statusId) {
    const btn = document.getElementById(btnId);
    const input = document.getElementById(inputId);
    const status = document.getElementById(statusId);
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!btn || !input || !SR) { if (btn) btn.style.display = 'none'; return; }

    let rec = null, listening = false, base = '';

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (listening) {
            window.stopAllVoiceInput();
            return;
        }

        try {
            // Stop any other active voice recording first
            window.stopAllVoiceInput();

            rec = new SR();
            rec.continuous = rec.interimResults = true;
            rec.lang = (typeof translations !== 'undefined' && translations[currentLang]) ? translations[currentLang].speech_lang || 'en-IN' : 'en-IN';
            base = input.value ? input.value + ' ' : '';

            const recState = { rec, btn, status };
            window.activeVoiceRecognitions.push(recState);

            rec.onstart = () => { 
                listening = true; 
                btn.classList.add('recording'); 
                status?.classList.add('active'); 
            };
            rec.onend = () => { 
                listening = false; 
                btn.classList.remove('recording'); 
                status?.classList.remove('active'); 
                const idx = window.activeVoiceRecognitions.indexOf(recState);
                if (idx > -1) window.activeVoiceRecognitions.splice(idx, 1);
            };
            rec.onresult = ev => {
                let final = '', interim = '';
                for (let i = ev.resultIndex; i < ev.results.length; ++i) {
                    const t = ev.results[i][0].transcript;
                    ev.results[i].isFinal ? final += t : interim += t;
                }
                input.value = base + (final ? (base += final + ' ', final) : interim);
            };
            rec.onerror = ev => { 
                console.warn('Speech error:', ev.error); 
                rec.onend(); 
            };
            rec.start();
        } catch (err) { 
            console.error('Speech start failed:', err); 
        }
    });
}