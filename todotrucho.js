document.addEventListener('DOMContentLoaded', () => {

    // Redirección de Banners/Anuncios Laterales
    const sideAds = document.querySelectorAll('.side-ad');
    const operaUrl = "https://www.opera.com/es-419/computer/thanks?ni=eapgx&os=windows";

    sideAds.forEach(ad => {
        ad.addEventListener('click', (e) => {
            e.preventDefault(); // Evita scroll o acciones por defecto de enlaces #
            window.location.href = operaUrl;
        });
    });

    // ==========================================
    // GENERADOR DE SONIDOS RETRO 8-BIT
    // ==========================================
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function play8BitSound(type) {
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);

        const now = audioCtx.currentTime;

        if (type === 'dice') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);

        } else if (type === 'success') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, now);
            osc.frequency.setValueAtTime(659.25, now + 0.1);
            osc.frequency.setValueAtTime(783.99, now + 0.2);
            osc.frequency.setValueAtTime(1046.50, now + 0.3);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
            osc.start(now);
            osc.stop(now + 0.5);

        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.setValueAtTime(110, now + 0.1);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        }
    }

    // ==========================================
    // 1. LÓGICA DEL BUSCADOR (300ms)
    // ==========================================
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const loadingMsg = document.getElementById('loadingMsg');
    const cards = document.querySelectorAll('.card');

    function executeSearch() {
        const text = searchInput.value.toLowerCase().trim();

        loadingMsg.style.display = 'block';

        setTimeout(() => {
            loadingMsg.style.display = 'none';

            cards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                card.style.display = title.includes(text) ? 'flex' : 'none';
            });
        }, 300);
    }

    searchBtn.addEventListener('click', executeSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch();
    });

    // Variables de control de plan
    let currentPlan = 'Free';
    let pendingPlan = '';

    // ==========================================
    // 2. LÓGICA DEL MODAL, CAPTCHA Y PLANES PREMIUM
    // ==========================================
    const mainHeader = document.getElementById('mainHeader');
    const openPremiumBtn = document.getElementById('openPremiumBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const premiumModal = document.getElementById('premiumModal');
    const premiumCodeInput = document.getElementById('premiumCodeInput');
    const claimCodeBtn = document.getElementById('claimCodeBtn');
    const premiumFeedback = document.getElementById('premiumFeedback');
    const premiumMsg = document.getElementById('premiumMsg');
    const userPlanBadge = document.getElementById('userPlanBadge');
    const togglePopcornBtn = document.getElementById('togglePopcornBtn');

    // Elementos del CAPTCHA
    const captchaWidget = document.getElementById('captchaWidget');
    const captchaBoxContainer = document.getElementById('captchaBoxContainer');
    const captchaSquare = document.getElementById('captchaSquare');
    const captchaSpinner = document.getElementById('captchaSpinner');
    const captchaCheck = document.getElementById('captchaCheck');
    let isVerifyingCaptcha = false;

    openPremiumBtn.addEventListener('click', () => {
        premiumModal.style.display = 'flex';
    });

    closeModalBtn.addEventListener('click', () => {
        premiumModal.style.display = 'none';
        resetCaptchaUI();
    });

    window.addEventListener('click', (e) => {
        if (e.target === premiumModal) {
            premiumModal.style.display = 'none';
            resetCaptchaUI();
        }
    });

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });

    function resetCaptchaUI() {
        captchaWidget.style.display = 'none';
        captchaSpinner.style.display = 'none';
        captchaCheck.style.display = 'none';
        captchaSquare.style.borderColor = '#7f9db9';
        isVerifyingCaptcha = false;
        claimCodeBtn.disabled = false;
        premiumCodeInput.disabled = false;
    }

    // Paso A: Validar Código
    claimCodeBtn.addEventListener('click', () => {
        const code = premiumCodeInput.value.trim().toLowerCase();
        pendingPlan = '';

        if (code === 'todotruchoesential') {
            pendingPlan = 'Essential';
        } else if (code === 'todotruchogold') {
            pendingPlan = 'Gold';
        } else if (code === 'todotruchodiamond' || code === 'todotrucho67') {
            pendingPlan = 'Diamond';
        }

        if (pendingPlan !== '') {
            claimCodeBtn.disabled = true;
            premiumCodeInput.disabled = true;
            captchaWidget.style.display = 'flex';
            premiumFeedback.style.color = '#000080';
            premiumFeedback.textContent = '🔒 CODIGO CORRECTO. VERIFIQUE EL CAPTCHA.';
        } else if (code === '') {
            play8BitSound('error');
            premiumFeedback.style.color = '#ff0000';
            premiumFeedback.textContent = '⚠️ INGRESE UN CODIGO VALIDO.';
        } else {
            play8BitSound('error');
            premiumFeedback.style.color = '#ff0000';
            premiumFeedback.textContent = '❌ CODIGO INVALIDO O EXPIRADO.';
        }
    });

    // Paso B: Clic en el CAPTCHA (3 Segundos)
    captchaBoxContainer.addEventListener('click', () => {
        if (isVerifyingCaptcha || captchaCheck.style.display === 'block') return;

        isVerifyingCaptcha = true;
        captchaSpinner.style.display = 'block';

        setTimeout(() => {
            captchaSpinner.style.display = 'none';
            captchaCheck.style.display = 'block';
            isVerifyingCaptcha = false;

            setTimeout(() => {
                currentPlan = pendingPlan;
                play8BitSound('success');
                
                premiumFeedback.style.color = '#008000';
                premiumFeedback.textContent = `🎉 ¡LICENCIA ACTIVADA! PLAN ${currentPlan.toUpperCase()}.`;
                premiumMsg.textContent = `👑 ESTADO: PLAN ${currentPlan.toUpperCase()} ACTIVO`;

                userPlanBadge.style.display = 'inline-block';
                userPlanBadge.textContent = `⚡ MIEMBRO VIP PLAN ${currentPlan.toUpperCase()}`;

                if (currentPlan === 'Diamond') {
                    mainHeader.classList.add('header-diamond');
                } else {
                    mainHeader.classList.remove('header-diamond');
                }

                if (currentPlan === 'Gold' || currentPlan === 'Diamond') {
                    togglePopcornBtn.removeAttribute('disabled');
                    togglePopcornBtn.textContent = '🍿 Pochoclos Permanentes: Activar';
                } else {
                    togglePopcornBtn.setAttribute('disabled', 'true');
                    togglePopcornBtn.textContent = '🍿 Pochoclos (Solo Gold/Diamond)';
                    stopPopcorn();
                }
            }, 300);

        }, 3000); // 3 segundos
    });

    // ==========================================
    // 3. ELECCIÓN ALEATORIA DE PELÍCULAS (DADO 🎲)
    // ==========================================
    function selectRandomItem(cardsSelector, resetBtn) {
        play8BitSound('dice');

        const cards = Array.from(document.querySelectorAll(cardsSelector));
        if (cards.length === 0) return;

        cards.forEach(card => {
            card.style.display = 'none';
            card.classList.remove('highlighted');
        });

        const randomIndex = Math.floor(Math.random() * cards.length);
        const selectedCard = cards[randomIndex];

        selectedCard.style.display = 'flex';
        selectedCard.classList.add('highlighted');

        resetBtn.style.display = 'inline-flex';
    }

    function resetItems(cardsSelector, resetBtn) {
        const cards = document.querySelectorAll(cardsSelector);
        cards.forEach(card => {
            card.style.display = 'flex';
            card.classList.remove('highlighted');
        });

        resetBtn.style.display = 'none';
    }

    const randomMovieBtn = document.getElementById('randomMovieBtn');
    const resetMoviesBtn = document.getElementById('resetMoviesBtn');

    if (randomMovieBtn && resetMoviesBtn) {
        randomMovieBtn.addEventListener('click', () => {
            selectRandomItem('#peliculas .card', resetMoviesBtn);
        });

        resetMoviesBtn.addEventListener('click', () => {
            resetItems('#peliculas .card', resetMoviesBtn);
        });
    }

    // ==========================================
    // 4. MODO LLUVIA DE POCHOCLOS PERMANENTE
    // ==========================================
    const popcornContainer = document.getElementById('popcornContainer');
    let popcornInterval = null;

    function createPopcorn() {
        const popcorn = document.createElement('div');
        popcorn.classList.add('falling-popcorn');
        popcorn.textContent = '🍿';
        popcorn.style.left = Math.random() * 95 + 'vw';
        
        const duration = Math.random() * 3 + 3;
        popcorn.style.animationDuration = duration + 's';

        popcornContainer.appendChild(popcorn);

        setTimeout(() => {
            popcorn.remove();
        }, duration * 1000);
    }

    function stopPopcorn() {
        if (popcornInterval) {
            clearInterval(popcornInterval);
            popcornInterval = null;
            popcornContainer.innerHTML = '';
            togglePopcornBtn.classList.remove('active');
            togglePopcornBtn.textContent = '🍿 Pochoclos Permanentes: Activar';
        }
    }

    togglePopcornBtn.addEventListener('click', () => {
        if (currentPlan !== 'Gold' && currentPlan !== 'Diamond') {
            alert('🔒 ¡REQUERIDO PLAN GOLD O DIAMANTE!');
            return;
        }

        if (popcornInterval) {
            stopPopcorn();
        } else {
            popcornInterval = setInterval(createPopcorn, 250);
            togglePopcornBtn.classList.add('active');
            togglePopcornBtn.textContent = '🛑 DETENER POCHOCLOS';
        }
    });

});