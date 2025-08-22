// Przełączanie trybu ciemnego/jasnego - natychmiastowe zastosowanie
(function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');

        const darkThemeLink = document.getElementById('dark-theme-style');
        if (darkThemeLink) {
            darkThemeLink.disabled = false;
        }

        // Jeśli przycisk istnieje, dodajemy klasę active
        const toggleSwitch = document.querySelector('.toggle-switch');
        if (toggleSwitch) {
            toggleSwitch.classList.add('active');
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

        // Ustawienie aktualnego roku w stopce
        setCurrentYearFooter();
    }

    // === PRZEŁĄCZANIE TRYBU CIEMNEGO/JASNEGO ===
    const toggleBtn = document.querySelector('.theme-toggle');
    const toggleSwitch = document.querySelector('.toggle-switch');
    const root = document.documentElement;
    const darkThemeLink = document.getElementById('dark-theme-style');

    if (!toggleBtn) {
        console.warn('Element .theme-toggle nie został znaleziony');
        return;
    }
    if (!darkThemeLink) {
        console.warn('Element #dark-theme-style nie został znaleziony');
        return;
    }

    function setTheme(isDark) {
        console.log('Ustawianie trybu:', isDark ? 'ciemny' : 'jasny');

        root.classList.toggle('dark', isDark);
        document.body.classList.toggle('dark', isDark);
        darkThemeLink.disabled = !isDark;
        toggleSwitch.classList.toggle('active', isDark);
    }

    // Ustaw motyw przy pierwszym załadowaniu
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark');

    // Obsługa kliknięcia
    toggleBtn.addEventListener('click', () => {
        const newDarkState = !root.classList.contains('dark');
        setTheme(newDarkState);
        localStorage.setItem('theme', newDarkState ? 'dark' : 'light');
    });

});

function setCurrentYearFooter() {
    const yearSpan = document.getElementById('year-footer');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear().toString();
    }
}