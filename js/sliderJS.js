class ImageSlider {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.currentSlide = 0;
        this.displayTimeout = null;
        this.transitionTimeout = null;
        this.isAnimating = false;
        this.autoPlay = true;
        this.init();
    }

    init() {
        if (this.slides.length > 0) {
            // Ustaw początkowe pozycje slajdów
            this.slides.forEach((slide, index) => {
                if (index === 0) {
                    slide.style.left = '0%'; // Pierwszy slajd aktywny
                } else {
                    slide.style.left = '100%'; // Pozostałe slajdy z prawej
                }
            });

            // Dodaj obsługę strzałek
            this.setupNavigation();

            // Uruchom automatyczne odtwarzanie
            if (this.autoPlay) {
                this.startSlider();
            }
        }
    }

    setupNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.pauseAutoPlay();
                this.prevSlide();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.pauseAutoPlay();
                this.nextSlide();
            });
        }
    }

    showSlide(index, direction = 'next') {
        if (this.isAnimating) return; // Zapobiegaj nakładaniu się animacji

        this.isAnimating = true;

        const currentSlideElement = this.slides[this.currentSlide];
        const nextSlideElement = this.slides[index];

        // Ustaw pozycję następnego slajdu w zależności od kierunku
        nextSlideElement.style.transition = 'none';
        if (direction === 'next') {
            nextSlideElement.style.left = '100%'; // Z prawej
        } else {
            nextSlideElement.style.left = '-100%'; // Z lewej
        }

        // Małe opóźnienie żeby CSS zdążył się zaktualizować
        setTimeout(() => {
            // Włącz animację dla obu slajdów
            currentSlideElement.style.transition = 'left 2s ease-in-out';
            nextSlideElement.style.transition = 'left 2s ease-in-out';

            // Animacja w zależności od kierunku
            if (direction === 'next') {
                currentSlideElement.style.left = '-100%'; // Aktualny w lewo
                nextSlideElement.style.left = '0%';       // Następny do środka
            } else {
                currentSlideElement.style.left = '100%';  // Aktualny w prawo
                nextSlideElement.style.left = '0%';       // Następny do środka
            }

            this.currentSlide = index;

            // Odblokuj animację po jej zakończeniu
            setTimeout(() => {
                this.isAnimating = false;
            }, 2000);

        }, 10);
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.showSlide(nextIndex, 'next');
    }

    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex, 'prev');
    }

    startSlider() {
        this.autoPlay = true;

        // Funkcja do uruchomienia cyklu
        const runCycle = () => {
            if (!this.autoPlay) return;

            // Po 4 sekundach rozpocznij przejście do następnego slajdu
            this.displayTimeout = setTimeout(() => {
                if (!this.autoPlay) return;

                this.nextSlide();

                // Po 2 sekundach animacji uruchom następny cykl
                this.transitionTimeout = setTimeout(() => {
                    if (this.autoPlay) {
                        runCycle();
                    }
                }, 2000);

            }, 4000);
        };

        // Uruchom pierwszy cykl
        runCycle();
    }

    pauseAutoPlay() {
        this.autoPlay = false;
        this.stopSlider();

        // Wznów automatyczne odtwarzanie po 5 sekundach bezczynności
        setTimeout(() => {
            if (!this.autoPlay) {
                this.startSlider();
            }
        }, 5000);
    }

    stopSlider() {
        if (this.displayTimeout) {
            clearTimeout(this.displayTimeout);
            this.displayTimeout = null;
        }
        if (this.transitionTimeout) {
            clearTimeout(this.transitionTimeout);
            this.transitionTimeout = null;
        }
    }

    restartSlider() {
        this.stopSlider();
        this.startSlider();
    }
}

// Inicjalizuj slider po załadowaniu strony
document.addEventListener('DOMContentLoaded', function() {
    const slider = new ImageSlider();

    // Opcjonalnie: zatrzymaj slider gdy użytkownik opuści kartę
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            slider.stopSlider();
        } else {
            slider.restartSlider();
        }
    });
});