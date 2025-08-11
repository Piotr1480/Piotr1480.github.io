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
    overlay.classList.add('show');
    mainModal.showModal();
    mainModal.setAttribute(`tabindex`, '-1'); // Ustawienie tabindex dla focus trap
    mainModal.focus(); // Ustaw focus na modal
}

// Ukrycie modala cookie z animacją
function hideCookieModal() {
    if (!mainModal) return;

    const overlay = mainModal.querySelector('.cookie-modal-overlay');
    overlay.classList.remove('show', 'fade-out');
    mainModal.close();
    mainModal.classList.add('hidden');
}

// Pokazanie modala ustawień
function showCookieSettings(openedFromLink = false) {
    if (!mainModal || !settingsModal) return;

    // Zarządzaj przyciskami w zależności od źródła uruchomienia
    manageModalButtons(openedFromLink);

    // Pokaż modal ustawień
    settingsModal.classList.remove('hidden');
    const settingsOverlay = settingsModal.querySelector('.cookie-modal-overlay');

    // Ukryj główny modal tylko jeśli nie został uruchomiony z linku
    if (!openedFromLink && typeof mainModal !== 'undefined' && mainModal) {
        const mainOverlay = mainModal.querySelector('.cookie-modal-overlay');
        if (mainOverlay) {
            mainOverlay.classList.remove('show');
        }
        mainModal.close();
        mainModal.classList.add('hidden');
    } else if (openedFromLink) {
        // Jeśli modal otwarty z linku, zablokuj przewijanie
        toggleBodyScroll(true);
    }

    // Załaduj zapisane ustawienia
    if (typeof loadSavedSettings === 'function') {
        loadSavedSettings();
    }

    if (settingsOverlay) {
        settingsOverlay.classList.add('show');
    }
    settingsModal.showModal();
    settingsModal.setAttribute('tabindex', '-1');
    settingsModal.focus();
}

// Ukrycie modala ustawień
function hideCookieSettings() {
    const settingsModal = document.getElementById('cookieSettingsModal');
    if (!settingsModal) return;

    const settingsOverlay = settingsModal.querySelector('.cookie-modal-overlay');
    if (settingsOverlay) {
        settingsOverlay.classList.remove('show', 'fade-out');
    }
    settingsModal.close();
    settingsModal.classList.add('hidden');

    // Usuń tabindex i przywróć normalny focus
    settingsModal.removeAttribute('tabindex');

    // Wyczyść focus i przywróć normalne zachowanie
    document.body.focus();
    document.body.blur();

    // Odblokuj przewijanie strony
    toggleBodyScroll(false);
}

// Powrót do głównego modala
function backToMainModal() {
    hideCookieSettings(); // zamyka modal ustawień
    showCookieModal();    // otwiera główny modal
}

document.addEventListener('DOMContentLoaded', () => {
    const settingsLink = document.getElementById('cookie-settings-link');
    if (settingsLink) {
        settingsLink.addEventListener('click', (e) => {
            e.preventDefault(); // zapobiega przeładowaniu strony
            showCookieSettings(true); // uruchamia modal
        });
    }
});

// Funkcja do zarządzania przyciskami w oknie modalnym
function manageModalButtons(isOpenedFromLink) {
    const settingsModal = document.getElementById('cookieSettingsModal');
    if (!settingsModal) return;

    // Znajdź istniejące przyciski w modalu ustawień
    const backButton = settingsModal.querySelector('.btn-back');
    const closeButton = settingsModal.querySelector('.btn-close');

    if (isOpenedFromLink) {
        // Modal uruchomiony przez link - ukryj przycisk "Wstecz", pokaż przycisk "Wyjdź"
        if (backButton) {
            backButton.style.display = 'none';
        }
        if (closeButton) {
            closeButton.style.display = 'inline-block';
        }
    } else {
        // Modal uruchomiony przez inne okno modalne - pokaż przycisk "Wstecz", ukryj przycisk "Wyjdź"
        if (backButton) {
            backButton.style.display = 'inline-block';
        }
        if (closeButton) {
            closeButton.style.display = 'none';
        }
    }
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

function debugHoverIssue() {
    console.log('=== DEBUGGING HOVER ISSUE ===');
    console.log('Body overflow:', document.body.style.overflow);
    console.log('Body pointer-events:', document.body.style.pointerEvents);
    console.log('Active element:', document.activeElement);
    console.log('Body classes:', document.body.className);

    // Sprawdź czy są niewidoczne overlaye
    const allModals = document.querySelectorAll('dialog, .modal, [role="dialog"]');
    allModals.forEach((modal, index) => {
        console.log(`Modal ${index}:`, {
            id: modal.id,
            open: modal.hasAttribute('open'),
            display: getComputedStyle(modal).display,
            zIndex: getComputedStyle(modal).zIndex
        });
    });
}

