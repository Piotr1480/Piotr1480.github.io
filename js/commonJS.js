// Hamburger menu
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');
    const submenuParent = document.querySelector('.has-submenu');
    const submenuToggle = submenuParent.querySelector('.submenu-toggle');

    // Kliknięcie w hamburger
    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenuContainer.classList.toggle('active');

        // Jeśli menu zostało zamknięte, zamknij też submenu i zresetuj strzałkę
        if (!navMenuContainer.classList.contains('active')) {
            submenuParent.classList.remove('open');
        }
    });

    // Kliknięcie w "Technologie"
    submenuToggle.addEventListener('click', function (e) {
        e.preventDefault();

        const isOpen = submenuParent.classList.contains('open');
        // Zamknij jeśli otwarte, otwórz jeśli zamknięte
        if (isOpen) {
            submenuParent.classList.remove('open');
        } else {
            submenuParent.classList.add('open');
        }
    });

    // Zamknięcie całego menu po kliknięciu w link (oprócz "Technologie")
    const navLinks = document.querySelectorAll('.topNav a:not(.submenu-toggle)');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
            submenuParent.classList.remove('open');
        });
    });

    // Kliknięcie poza menu – zamknięcie wszystkiego
    document.addEventListener('click', function (event) {
        const isClickInsideMenu = navMenuContainer.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideMenu) {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
            submenuParent.classList.remove('open');
        }
    });
});


// Przycisk "Na początek strony"
let backToTopBtn = document.getElementById('backToTop');

function handleClick() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

backToTopBtn.addEventListener('click', handleClick);

window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
        if (!backToTopBtn.classList.contains('show')) {
            backToTopBtn.classList.add('show');
        }
    } else {
        if (backToTopBtn.classList.contains('show')) {
            backToTopBtn.classList.remove('show');

            // ✅ Klonujemy przycisk, by zresetować focus/active
            const clone = backToTopBtn.cloneNode(true);
            backToTopBtn.parentNode.replaceChild(clone, backToTopBtn);

            // ✅ Aktualizujemy referencję i podpinamy zdarzenie
            backToTopBtn = clone;
            backToTopBtn.addEventListener('click', handleClick);
        }
    }
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