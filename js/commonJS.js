// Hamburger menu
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');
    const submenuParents = document.querySelectorAll('.has-submenu'); // Wszystkie submenu
    const submenuToggles = document.querySelectorAll('.submenu-toggle'); // Wszystkie toggle'e

    // Kliknięcie w hamburger
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenuContainer.classList.toggle('active');

        // Jeśli menu zostało zamknięte, zamknij wszystkie submenu i zresetuj strzałki
        if (!navMenuContainer.classList.contains('active')) {
            submenuParents.forEach(parent => {
                parent.classList.remove('open');
            });
        }
    });

    // Kliknięcie w każdy submenu toggle (Technologie, JavaScript)
    submenuToggles.forEach((toggle, index) => {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();

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
        backToTopBtn.blur();
    }
});

// Płynny powrót na górę strony po kliknięciu
backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    backToTopBtn.blur();
});


//Slick slider
$(document).ready(function() {
    $('.slider-container').slick({
        dots: true,
        infinite: true,
        speed: 800,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: true,
        pauseOnHover: true,
        prevArrow: $('.nav-arrow-left'),
        nextArrow: $('.nav-arrow-right')
    });
});