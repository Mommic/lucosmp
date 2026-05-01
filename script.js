document.addEventListener('DOMContentLoaded', () => {

    const COOKIE_KEY = 'lucosmp_cookie_consent';

    // =============================================
    // SHARED UTILITIES
    // =============================================

    // (showToast moved to global features section for consistency)

    function saveConsent(prefs, redirect = false) {
        const consent = {
            decided: true,
            timestamp: new Date().toISOString(),
            ...prefs
        };
        localStorage.setItem(COOKIE_KEY, JSON.stringify(consent));
        
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            banner.classList.add('hiding');
            banner.addEventListener('animationend', () => {
                banner.classList.add('hidden');
                banner.classList.remove('hiding');
            }, { once: true });
        }
        
        showToast('Erfolgreich gespeichert!');
        
        if (redirect) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
    }

    // =============================================
    // COOKIE BANNER LOGIC (STARTPAGE)
    // =============================================

    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        const btnAcceptAll = document.getElementById('cookieAcceptAllBtn');
        const btnEssential = document.getElementById('cookieEssentialBtn');
        const btnSettings  = document.getElementById('cookieSettingsBtn');
        const btnSave      = document.getElementById('cookieSaveSettingsBtn');
        const checkExt     = document.getElementById('cookieExternal');
        const settingsPanel= document.getElementById('cookieSettings');

        try {
            const stored = JSON.parse(localStorage.getItem(COOKIE_KEY));
            if (!stored || !stored.decided) {
                setTimeout(() => cookieBanner.classList.remove('hidden'), 800);
            }
        } catch (e) {
            setTimeout(() => cookieBanner.classList.remove('hidden'), 800);
        }

        if (btnAcceptAll) btnAcceptAll.addEventListener('click', () => saveConsent({ necessary: true, external: true }));
        if (btnEssential) btnEssential.addEventListener('click', () => saveConsent({ necessary: true, external: false }));
        if (btnSettings)  btnSettings.addEventListener('click', () => settingsPanel.classList.toggle('hidden'));
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                const ext = checkExt ? checkExt.checked : false;
                saveConsent({ necessary: true, external: ext });
            });
        }
    }

    // =============================================
    // COOKIE MANAGEMENT PAGE (COOKIES.HTML)
    // =============================================

    const isCookiePage = window.location.pathname.includes('cookies.html') || window.location.href.includes('cookies.html');
    
    if (isCookiePage) {
        const manageExtChk = document.getElementById('manageCookieExternal');
        const btnSaveDet   = document.getElementById('saveDetailedCookies');
        const btnAcceptDet = document.getElementById('acceptAllDetailed');

        function updateUI(isActive) {
            const icon = document.getElementById('externalStatusIcon');
            const text = document.getElementById('externalStatusText');
            const card = document.getElementById('externalCookieCard');

            if (isActive) {
                if (icon) { icon.innerHTML = '<i class="fa-solid fa-check"></i>'; icon.classList.add('active'); }
                if (text) { text.innerText = 'Aktiviert'; text.style.color = '#4ade80'; }
                if (card) card.style.borderColor = 'rgba(74, 222, 128, 0.4)';
            } else {
                if (icon) { icon.innerHTML = '<i class="fa-solid fa-power-off"></i>'; icon.classList.remove('active'); }
                if (text) { text.innerText = 'Deaktiviert'; text.style.color = 'var(--text-muted)'; }
                if (card) card.style.borderColor = 'rgba(255, 255, 255, 0.08)';
            }
        }

        // Init State
        try {
            const stored = JSON.parse(localStorage.getItem(COOKIE_KEY));
            if (stored && manageExtChk) {
                manageExtChk.checked = stored.external;
                updateUI(stored.external);
            }
        } catch (e) { }

        // Handlers
        if (manageExtChk) {
            manageExtChk.addEventListener('change', (e) => updateUI(e.target.checked));
        }

        if (btnSaveDet) {
            btnSaveDet.addEventListener('click', () => {
                const ext = manageExtChk ? manageExtChk.checked : false;
                saveConsent({ necessary: true, external: ext });
            });
        }

        if (btnAcceptDet) {
            btnAcceptDet.addEventListener('click', () => {
                saveConsent({ necessary: true, external: true });
                if (manageExtChk) manageExtChk.checked = true;
                updateUI(true);
            });
        }
    }

    // Theme and Scroll features removed to simplify UI.

    // =============================================
    // UNIFIED DONATION MODAL
    // =============================================
    const donoNoticeModal = document.getElementById('donoNoticeModal');
    const openDonoBtns = document.querySelectorAll('.open-dono-modal');
    
    if (donoNoticeModal) {
        openDonoBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                donoNoticeModal.classList.remove('hidden');
            });
        });

        const closeBtn = document.getElementById('closeDonoNoticeBtn');
        if (closeBtn) closeBtn.addEventListener('click', () => donoNoticeModal.classList.add('hidden'));
        
        const confirmBtn = document.getElementById('confirmDonoBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                setTimeout(() => donoNoticeModal.classList.add('hidden'), 500);
            });
        }

        donoNoticeModal.addEventListener('click', (e) => {
            if (e.target === donoNoticeModal) donoNoticeModal.classList.add('hidden');
        });
    }

    // =============================================
    // GLOBAL UI & ANIMATIONS
    // =============================================

    // Cursor Glow
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        });
    }

    // IP Copy
    const copyIpBtn = document.getElementById('copyIpBtn');
    const serverIP = "LucoSMP.de";
    let isCopyingIP = false;
    
    if (copyIpBtn) {
        copyIpBtn.addEventListener('click', () => {
            if (isCopyingIP) return;
            isCopyingIP = true;

            const copyToClipboard = (text) => {
                if (navigator.clipboard && window.isSecureContext) {
                    return navigator.clipboard.writeText(text);
                } else {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position = "fixed";
                    textArea.style.opacity = "0";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        textArea.remove();
                        return Promise.resolve();
                    } catch (err) {
                        textArea.remove();
                        return Promise.reject(err);
                    }
                }
            };

            copyToClipboard(serverIP).then(() => {
                showToast('IP kopiert!');
                
                const origHTML = copyIpBtn.innerHTML;
                copyIpBtn.classList.add('success-pop');
                copyIpBtn.innerHTML = '<i class="fa-solid fa-check"></i> Kopiert!';
                const origBg = copyIpBtn.style.background;
                copyIpBtn.style.background = '#4ade80';
                
                setTimeout(() => {
                    copyIpBtn.classList.remove('success-pop');
                    copyIpBtn.innerHTML = origHTML;
                    copyIpBtn.style.background = origBg;
                    isCopyingIP = false;
                }, 2000);
            }).catch(() => {
                showToast('Fehler beim Kopieren.');
                isCopyingIP = false;
            });
        });
    }

    function showToast(message) {
        let toast = document.getElementById('cookieToast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cookieToast';
            toast.className = 'cookie-toast';
            document.body.appendChild(toast);
        }
        toast.innerText = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000); // Faster dismissal
    }

    // Dono Link Copy
    window.copyDonoLink = function() {
        const linkElem = document.getElementById('donoLinkText');
        if (!linkElem) return;
        navigator.clipboard.writeText(linkElem.innerText).then(() => {
            const btn = document.querySelector('.copy-small-btn');
            if (btn) {
                const orig = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-check"></i>';
                btn.style.background = '#4ade80';
                setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; }, 2000);
            }
        });
    };

    // Back to Top
    const bttContainer = document.getElementById('backToTopContainer');
    const bttBtn = document.getElementById('backToTop');
    if (bttContainer && bttBtn) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const windowHeight = window.innerHeight;
            const bodyHeight = document.body.offsetHeight;
            const footerThreshold = 150; // Distance from bottom to hide

            if (scrollPos > 400 && (scrollPos + windowHeight < bodyHeight - footerThreshold)) {
                bttContainer.classList.add('show');
            } else {
                bttContainer.classList.remove('show');
            }
        });
        bttBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
});
