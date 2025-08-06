// Ten plik automatycznie ładuje Google Analytics jeśli użytkownik wyraził zgodę

(function() {
    'use strict';

    // Klucze localStorage (identyczne jak w głównym pliku)
    const COOKIE_ANALYTICS_KEY = 'cookieAnalytics';

    // Funkcja sprawdzająca zgodę na Analytics
    function hasAnalyticsConsent() {
        return localStorage.getItem(COOKIE_ANALYTICS_KEY) === 'true';
    }

    // Funkcja ładująca Google Analytics
    function loadGoogleAnalytics() {
        // Sprawdź czy gtag już nie jest załadowane (unikaj podwójnego ładowania)
        if (typeof window.gtag !== 'undefined') {
            console.log('Google Analytics już załadowane na tej stronie');
            return;
        }

        console.log('Ładowanie Google Analytics na stronie:', window.location.href);

        // Dodaj skrypt gtag.js
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-CMNR20S6J1';

        script.onload = function() {
            console.log('Google Analytics skrypt załadowany pomyślnie');

            // Inicjalizuj gtag po załadowaniu skryptu
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            window.gtag = gtag;

            gtag('js', new Date());
            gtag('config', 'G-CMNR20S6J1', {
                'send_page_view': true,
                'page_title': document.title,
                'page_location': window.location.href,
                'page_referrer': document.referrer,
                'anonymize_ip': false, // Zmień na true jeśli potrzebujesz anonimizacji IP
                'cookie_flags': 'SameSite=None;Secure' // Opcjonalnie dla HTTPS
            });

            console.log('Google Analytics skonfigurowane dla strony:', document.title);
        };

        script.onerror = function() {
            console.error('Błąd podczas ładowania Google Analytics');
        };

        // Dodaj skrypt do head
        document.head.appendChild(script);
    }

    // Funkcja pomocnicza do śledzenia eventów (dostępna globalnie)
    window.trackAnalyticsEvent = function(eventName, parameters = {}) {
        if (hasAnalyticsConsent() && typeof window.gtag !== 'undefined') {
            window.gtag('event', eventName, parameters);
            console.log('Analytics event tracked:', eventName, parameters);
        } else {
            console.warn('Analytics event nie został wysłany - brak zgody lub GA nie załadowane');
        }
    };

    // Funkcja do śledzenia przejść między stronami (dla SPA)
    window.trackPageView = function(pageTitle = document.title, pageLocation = window.location.href) {
        if (hasAnalyticsConsent() && typeof window.gtag !== 'undefined') {
            window.gtag('event', 'page_view', {
                page_title: pageTitle,
                page_location: pageLocation,
                page_referrer: document.referrer
            });
            console.log('Page view tracked:', pageTitle);
        }
    };

    // Funkcja sprawdzająca status Analytics (dla debugowania)
    window.checkAnalyticsStatus = function() {
        console.log('=== ANALYTICS STATUS ===');
        console.log('Strona:', window.location.href);
        console.log('Zgoda na Analytics:', hasAnalyticsConsent());
        console.log('gtag załadowane:', typeof window.gtag !== 'undefined');
        console.log('dataLayer:', window.dataLayer ? `${window.dataLayer.length} elementów` : 'nie istnieje');

        if (typeof window.gtag !== 'undefined') {
            console.log('✅ Google Analytics jest aktywny');
        } else {
            console.log('❌ Google Analytics nie jest załadowany');
        }
    };

    // Główna logika - uruchom po załadowaniu DOM
    function initializeAnalytics() {
        // Sprawdź czy użytkownik wyraził zgodę na Analytics
        if (hasAnalyticsConsent()) {
            console.log('Znaleziono zgodę na Analytics - ładuję GA...');
            loadGoogleAnalytics();
        } else {
            console.log('Brak zgody na Analytics - GA nie zostanie załadowany');
        }
    }

    // Inicjalizacja
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAnalytics);
    } else {
        // DOM już załadowany
        initializeAnalytics();
    }

    // Opcjonalnie: słuchaj zmian w localStorage (jeśli zgoda zostanie zmieniona na innej karcie)
    window.addEventListener('storage', function(event) {
        if (event.key === COOKIE_ANALYTICS_KEY) {
            console.log('Zmiana zgody na Analytics wykryta:', event.newValue);

            if (event.newValue === 'true' && typeof window.gtag === 'undefined') {
                // Użytkownik właśnie wyraził zgodę - załaduj GA
                loadGoogleAnalytics();
            }
            // Uwaga: jeśli użytkownik cofnął zgodę, GA pozostanie załadowany do odświeżenia strony
        }
    });

})();