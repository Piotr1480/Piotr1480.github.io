// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');
    const submenuParent = document.querySelector('.has-submenu');
    const submenuToggle = submenuParent.querySelector('.submenu-toggle');

    // Toggle hamburger menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenuContainer.classList.toggle('active');

        // Jeśli menu zostało zamknięte, zamknij również submenu
        if (!navMenuContainer.classList.contains('active')) {
            submenuParent.classList.remove('open');
        }
    });

    // Rozwijanie submenu po kliknięciu "Technologie"
    submenuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        submenuParent.classList.toggle('open');
    });

    // Zamykaj menu po kliknięciu w link (ale nie "Technologie")
    const navLinks = document.querySelectorAll('.topNav a:not(.submenu-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
            submenuParent.classList.remove('open');
        });
    });

    // Zamknij menu i submenu po kliknięciu poza nimi
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenuContainer.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideMenu) {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
            submenuParent.classList.remove('open');
        }
    });
});

// Przycisk "Na początek strony"
const backToTopBtn = document.getElementById('backToTop');

// Pokazuj/ukrywaj przycisk na podstawie pozycji scrolla
window.addEventListener('scroll', function() {
    // Pokaż button gdy użytkownik przewinie więcej niż 300px
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Płynny powrót na górę strony po kliknięciu
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
