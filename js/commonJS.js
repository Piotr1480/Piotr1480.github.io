// Hamburger menu
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenuContainer = document.querySelector('.nav-menu-container');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenuContainer.classList.toggle('active');
    });

    // Zamknij menu po kliknięciu w link



    // Zamknij menu po kliknięciu poza nim
    document.addEventListener('click', function(event) {
        if (!hamburger.contains(event.target) && !navMenuContainer.contains(event.target)) {
            hamburger.classList.remove('active');
            navMenuContainer.classList.remove('active');
        }
    });
});