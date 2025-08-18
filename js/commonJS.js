// Przełączanie trybu ciemnego/jasnego - natychmiastowe zastosowanie
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        // Spróbuj znaleźć i włączyć ciemny motyw
        const darkThemeLink = document.getElementById('dark-theme-style');
        if (darkThemeLink) {
            darkThemeLink.disabled = false;
        }
    }
})();

// Główny kod po załadowaniu DOM
document.addEventListener('DOMContentLoaded', function () {

    // === HAMBURGER MENU ===
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');
    const submenuParents = document.querySelectorAll('.has-submenu');
    const submenuToggles = document.querySelectorAll('.submenu-toggle');

    if (hamburger && navMenuContainer) {
        // Kliknięcie w hamburger
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenuContainer.classList.toggle('active');

            // Jeśli menu zostało zamknięte, zamknij wszystkie submenu
            if (!navMenuContainer.classList.contains('active')) {
                submenuParents.forEach(parent => {
                    parent.classList.remove('open');
                });
            }
        });

        // Kliknięcie w każdy submenu toggle
        submenuToggles.forEach((toggle, index) => {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();

                if (submenuParents[index]) {
                    const parentSubmenu = submenuParents[index];
                    const isOpen = parentSubmenu.classList.contains('open');

                    // Zamknij wszystkie inne submenu
                    submenuParents.forEach((parent, i) => {
                        if (i !== index) {
                            parent.classList.remove('open');
                        }
                    });

                    // Przełącz aktualnie kliknięte submenu
                    if (isOpen) {
                        parentSubmenu.classList.remove('open');
                    } else {
                        parentSubmenu.classList.add('open');
                    }
                }
            });
        });

        // Zamknięcie całego menu po kliknięciu w link (oprócz submenu toggles)
        const navLinks = document.querySelectorAll('.topNav a:not(.submenu-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenuContainer.classList.remove('active');
                submenuParents.forEach(parent => {
                    parent.classList.remove('open');
                });
            });
        });

        // Kliknięcie poza menu – zamknięcie wszystkiego
        document.addEventListener('click', function (event) {
            const isClickInsideMenu = navMenuContainer.contains(event.target) || hamburger.contains(event.target);
            if (!isClickInsideMenu) {
                hamburger.classList.remove('active');
                navMenuContainer.classList.remove('active');
                submenuParents.forEach(parent => {
                    parent.classList.remove('open');
                });
            }
        });
    }

    // === PRZEŁĄCZANIE TRYBU CIEMNEGO/JASNEGO ===
    const toggleBtn = document.getElementById('themeToggle');
    const root = document.documentElement;
    const darkThemeLink = document.getElementById('dark-theme-style');

    if (toggleBtn && darkThemeLink) {
        // Funkcja do ustawienia trybu
        function setTheme(isDark) {
            console.log('Ustawianie trybu:', isDark ? 'ciemny' : 'jasny');

            if (isDark) {
                root.classList.add('dark');
                document.body.classList.add('dark');
                darkThemeLink.disabled = false;
                toggleBtn.textContent = '☀️';
            } else {
                root.classList.remove('dark');
                document.body.classList.remove('dark');
                darkThemeLink.disabled = true;
                toggleBtn.textContent = '🌙';
            }
        }

        // Sprawdź zapisany tryb z localStorage i zastosuj go
        const savedTheme = localStorage.getItem('theme');
        const isDarkMode = savedTheme === 'dark';
        console.log('Zapisany motyw:', savedTheme);
        setTheme(isDarkMode);

        // Kliknięcie = zmiana trybu
        toggleBtn.addEventListener('click', () => {
            const currentlyDark = root.classList.contains('dark');
            const newDarkState = !currentlyDark;

            setTheme(newDarkState);
            localStorage.setItem('theme', newDarkState ? 'dark' : 'light');
        });
    } else if (!toggleBtn) {
        console.warn('Element themeToggle nie został znaleziony');
    } else if (!darkThemeLink) {
        console.warn('Element dark-theme-style nie został znaleziony');
    }
});