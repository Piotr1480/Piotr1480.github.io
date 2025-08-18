// === PRZYCISK "NA POCZĄTEK STRONY" ===
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
    // Pokazuj/ukrywaj przycisk na podstawie pozycji scrolla
    window.addEventListener('scroll', function() {
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
}

// === SLICK SLIDER ===
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



