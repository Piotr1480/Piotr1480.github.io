// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenuContainer.classList.toggle('active');
    });

    //
    document.addEventListener('DOMContentLoaded', function() {
        const hamburger = document.getElementById('hamburger');
        const navMenuContainer = document.querySelector('.nav-menu-container');

        // Obsługa kliknięcia w linki menu głównego (z wyjątkiem "Technologie")
        const navLinks = document.querySelectorAll('.topNav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                // Jeśli to submenu — otwórz stronę
                if (link.closest('.submenu')) {
                    event.preventDefault(); // zapobiega domyślnemu przeładowaniu
                    const targetUrl = link.getAttribute('href');
                    window.location.href = targetUrl; // przejście do strony
                }

                // Zamykanie menu (nie zamykaj przy kliknięciu w "Technologie")
                if (!link.closest('.has-submenu')) {
                    hamburger.classList.remove('active');
                    navMenuContainer.classList.remove('active');
                }
            });
        });
    });

    // Zamknij menu po kliknięciu poza nim
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenuContainer.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
        }
    });
});