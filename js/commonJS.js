// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenuContainer.classList.toggle('active');
    });

    // Zamknij menu po kliknięciu na link
    const navLinks = document.querySelectorAll('.topNav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
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
