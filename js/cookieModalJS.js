// Klucz do przechowywania zgody w localStorage
const COOKIE_CONSENT_KEY = 'cookieConsent';
const COOKIE_ANALYTICS_KEY = 'cookieAnalytics';
const mainModal = document.getElementById('cookieModal');
const settingsModal = document.getElementById('cookieSettingsModal');

// Sprawdzenie czy użytkownik już wyraził zgodę
function hasAnyConsent() {
    return localStorage.getItem(COOKIE_CONSENT_KEY) !== null;
}

function hasAnalyticsConsent() {
    return localStorage.getItem(COOKIE_ANALYTICS_KEY) === 'true';
}

// Pokazanie głównego modala cookie
function showCookieModal() {
    if (!mainModal) return;

    mainModal.classList.remove('hidden');
    const overlay = mainModal.querySelector('.cookie-modal-overlay');
    setTimeout(() => {
        overlay.classList.add('show');
        mainModal.showModal();
        mainModal.setAttribute(`tabindex`, '-1'); // Ustawienie tabindex dla focus trap
        mainModal.focus(); // Ustaw focus na modal
    }, 100); // Krótkie opóźnienie po załadowaniu strony
}

// Ukrycie modala cookie z animacją
function hideCookieModal() {
    if (!mainModal) return;

    const overlay = mainModal.querySelector('.cookie-modal-overlay');
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.classList.remove('show', 'fade-out');
        mainModal.close();
        mainModal.classList.add('hidden');
    }, 100);
}

// Pokazanie modala ustawień
function showCookieSettings() {
    if (!mainModal || !settingsModal) return;

    // Ukryj główny modal
    const mainOverlay = mainModal.querySelector('.cookie-modal-overlay');
    mainOverlay.classList.remove('show');

    // Pokaż modal ustawień
    settingsModal.classList.remove('hidden');
    const settingsOverlay = settingsModal.querySelector('.cookie-modal-overlay');

    // Załaduj zapisane ustawienia
    loadSavedSettings();

    setTimeout(() => {
        settingsOverlay.classList.add('show');
        settingsModal.showModal();
        settingsModal.setAttribute('tabindex', '-1');
        settingsModal.focus();
    }, 100);
}

// Ukrycie modala ustawień
function hideCookieSettings() {
    if (!settingsModal) return;

    const overlay = settingsModal.querySelector('.cookie-modal-overlay');
    overlay.classList.add('fade-out');
    setTimeout(() => {
        overlay.classList.remove('show', 'fade-out');
        settingsModal.close();
        settingsModal.classList.add('hidden');
    }, 100);
}

// Powrót do głównego modala
function backToMainModal() {
    hideCookieSettings();
    setTimeout(() => {
        showCookieModal();
    }, 100);
}

// Załadowanie zapisanych ustawień z domyślną wartością true dla Analytics
function loadSavedSettings() {
    const analyticsToggle = document.getElementById('analyticsToggle');
    if (!analyticsToggle) return;

    // Jeśli użytkownik wcześniej zapisał ustawienia, użyj ich
    if (localStorage.getItem(COOKIE_ANALYTICS_KEY) !== null) {
        analyticsToggle.checked = localStorage.getItem(COOKIE_ANALYTICS_KEY) === 'true';
    } else {
        // Jeśli nie ma zapisanych ustawień, ustaw domyślnie na true
        analyticsToggle.checked = true;
    }
}

// Przełączanie Analytics
function toggleAnalytics(checkbox) {
    console.log('Analytics toggled:', checkbox.checked);
}

// Zapisanie ustawień cookie
function saveCookieSettings() {
    const analyticsToggle = document.getElementById('analyticsToggle');
    if (!analyticsToggle) return;

    const analyticsEnabled = analyticsToggle.checked;

    // Zapisz ustawienia
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_ANALYTICS_KEY, analyticsEnabled.toString());

    // Włącz GA jeśli użytkownik się zgodził
    if (analyticsEnabled) {
        enableGoogleAnalytics();
        trackCookieAccepted();
    }

    console.log('Ustawienia zapisane:', {
        analytics: analyticsEnabled
    });

    hideCookieSettings();
    toggleBodyScroll(false);
}

// Akceptacja cookies - przycisk "Przejdź do strony"
function acceptCookies() {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    localStorage.setItem(COOKIE_ANALYTICS_KEY, 'true');

    hideCookieModal();
    toggleBodyScroll(false);

    // Włączenie Google Analytics
    enableGoogleAnalytics();
    trackCookieAccepted();

    console.log('Wszystkie cookie zaakceptowane');
}

// Reset zgody (do testowania)
function resetCookieConsent() {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    localStorage.removeItem(COOKIE_ANALYTICS_KEY);
    location.reload();
}

// Blokowanie scrolla gdy modal jest aktywny
function toggleBodyScroll(disable) {
    if (disable) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Google Analytics
function enableGoogleAnalytics() {
    // Sprawdź czy gtag już nie jest załadowane
    if (typeof gtag !== 'undefined') {
        console.log('Google Analytics już załadowane');
        return;
    }

    console.log('Ładowanie Google Analytics...');

    // Dodaj Global Site Tag (gtag.js)
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=G-CMNR20S6J1';
    script.onload = function() {
        console.log('Skrypt Google Analytics załadowany');
    };
    script.onerror = function() {
        console.error('Błąd ładowania skryptu Google Analytics');
    };
    document.head.appendChild(script);

    // Inicjalizuj gtag
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;

    gtag('js', new Date());
    gtag('config', 'G-CMNR20S6J1', {
        'send_page_view': true,
        'page_title': document.title,
        'page_location': window.location.href,
        'page_referrer': document.referrer,
        'anonymize_ip': false
    });

}

// Funkcja pomocnicza do wysyłania custom eventów (GA4)
function trackEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, parameters);
        console.log('Event tracked:', eventName, parameters);
    } else {
        console.warn('Google Analytics nie jest załadowane - nie można śledzić eventu');
    }
}

function trackCookieAccepted() {
    trackEvent('cookie_consent', {
        'consent_type': 'accepted',
        'page_location': window.location.href,
        'page_title': document.title
    });
}

// Inicjalizacja systemu cookie consent
function initializeCookieConsent() {
    console.log('Inicjalizacja systemu cookie consent...');

    // Jeśli użytkownik ma już zgodę na Analytics, załaduj GA
    if (hasAnalyticsConsent()) {
        console.log('Znaleziono zgodę na Analytics - ładowanie GA...');
        enableGoogleAnalytics();
    }

    // Pokaż modal tylko jeśli nie ma żadnej zgody i modal istnieje na stronie
    if (!hasAnyConsent() && mainModal) {
        console.log('Brak zgody - pokazuję modal');
        showCookieModal();
        toggleBodyScroll(true);
    }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    initializeCookieConsent();
});

// Obsługa klawisza ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        if (settingsModal.hasAttribute('open')) {
            backToMainModal();
        } else if (mainModal.hasAttribute('open')) {
            // Opcjonalnie można zamknąć modal klawiszem ESC
            // hideCookieModal();
        }
    }
});

// Funkcja do sprawdzania statusu (debugging)
function checkGoogleAnalyticsStatus() {
    console.log('=== STATUS GOOGLE ANALYTICS ===');
    console.log('Zgoda na cookies:', hasAnyConsent());
    console.log('Zgoda na Analytics:', hasAnalyticsConsent());
    console.log('gtag załadowane:', typeof gtag !== 'undefined');
    console.log('dataLayer elementy:', window.dataLayer ? window.dataLayer.length : 'brak dataLayer');
    console.log('Aktualna strona:', window.location.href);
}

