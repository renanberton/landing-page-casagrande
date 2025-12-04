const accordionHeaders = document.querySelectorAll(".accordion-header");

    accordionHeaders.forEach(header => {
        header.addEventListener("click", () => {

            const item = header.parentElement;
            const content = item.querySelector(".accordion-content");

            // Fecha outros
            document.querySelectorAll(".accordion-item").forEach(i => {
                if (i !== item) {
                    i.classList.remove("active");
                    i.querySelector(".accordion-content").style.maxHeight = null;
                }
            });

            // Abre fecha clicado
            item.classList.toggle("active");

            if (item.classList.contains("active")) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });


    // Contador de urgência
function startCountdown() {
    const hours = document.getElementById('horas');
    const minutes = document.getElementById('minutos');
    const seconds = document.getElementById('segundos');
    
    let totalSeconds = 12 * 3600 + 45 * 60 + 30; // 12h45m30s
    
    setInterval(() => {
        totalSeconds--;
        
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        
        hours.textContent = hrs.toString().padStart(2, '0');
        minutes.textContent = mins.toString().padStart(2, '0');
        seconds.textContent = secs.toString().padStart(2, '0');
        
        if (totalSeconds <= 0) {
            totalSeconds = 12 * 3600 + 45 * 60 + 30; // Reinicia
        }
    }, 1000);
}

// Inicia quando a página carregar
document.addEventListener('DOMContentLoaded', startCountdown);


// Carrossel Automático com 2 cards - CORRIGIDO para mobile
document.addEventListener('DOMContentLoaded', function() {
    const carrosselTrack = document.querySelector('.carrossel-track');
    const slides = document.querySelectorAll('.carrossel-slide');
    const container = document.querySelector('.carrossel-auto-container');
    
    let currentPosition = 0;
    let slidesPerView = 2;
    let slideWidth = 0;
    let gap = 30;
    let autoSlideInterval;
    let isMobile = window.innerWidth <= 768;
    
    // Função para calcular slides por view baseado na largura da tela
    function calculateSlidesPerView() {
        if (window.innerWidth <= 768) {
            return 1;
        }
        return 2;
    }
    
    // Função para calcular largura do slide - CORRIGIDA para mobile
    function calculateSlideWidth() {
        if (slides.length === 0) return 0;
        
        slidesPerView = calculateSlidesPerView();
        isMobile = slidesPerView === 1;
        
        if (isMobile) {
            // No mobile, usar a largura do container menos o padding
            const containerStyle = window.getComputedStyle(container);
            const containerPadding = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
            return container.offsetWidth - containerPadding;
        } else {
            // No desktop, cálculo normal
            const containerWidth = container.offsetWidth;
            return (containerWidth / slidesPerView) - (gap * (slidesPerView - 1) / slidesPerView);
        }
    }
    
    // Função para atualizar posição do carrossel - CORRIGIDA para mobile
    function updateCarrosselPosition() {
        slideWidth = calculateSlideWidth();
        
        if (isMobile) {
            // No mobile, centralizar usando transform
            const transformValue = -currentPosition * (slideWidth + gap + 10);
            carrosselTrack.style.transform = `translateX(${transformValue}px)`;
        } else {
            // No desktop, comportamento normal
            const transformValue = -currentPosition * (slideWidth + gap + 10);
            carrosselTrack.style.transform = `translateX(${transformValue}px)`;
        }
        
        // Atualizar classes active
        slides.forEach((slide, index) => {
            slide.classList.remove('active');
            // No mobile, apenas o slide atual fica ativo
            if (isMobile) {
                if (index === currentPosition) {
                    slide.classList.add('active');
                }
            } else {
                // No desktop, ativar o par atual
                if (index === currentPosition || index === currentPosition + 1) {
                    slide.classList.add('active');
                }
            }
        });
    }
    
    // Função para mover para o próximo slide - CORRIGIDA
    function nextSlide() {
        const totalSlides = slides.length;
        const maxPosition = totalSlides - slidesPerView;
        
        if (currentPosition >= maxPosition) {
            // Voltar ao início
            currentPosition = 0;
        } else {
            currentPosition += 1;
        }
        
        updateCarrosselPosition();
    }
    
    // Inicializar carrossel
    function initCarrossel() {
        slideWidth = calculateSlideWidth();
        
        // Ajustar o gap para mobile
        if (isMobile) {
            gap = 20; // Menor gap no mobile
        }
        
        updateCarrosselPosition();
        
        // Iniciar auto-play
        startAutoSlide();
    }
    
    // Função para iniciar auto-slide
    function startAutoSlide() {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, 4000); // Muda a cada 4 segundos
    }
    
    // Pausar auto-play ao passar o mouse
    carrosselTrack.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });
    
    // Retomar auto-play ao tirar o mouse
    carrosselTrack.addEventListener('mouseleave', () => {
        startAutoSlide();
    });
    
    // Inicializar quando a página carregar
    initCarrossel();
    
    // Atualizar em redimensionamento da janela
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            slideWidth = calculateSlideWidth();
            // Resetar posição se mudou de mobile para desktop ou vice-versa
            if ((isMobile && calculateSlidesPerView() === 2) || 
                (!isMobile && calculateSlidesPerView() === 1)) {
                currentPosition = 0;
            }
            updateCarrosselPosition();
        }, 250);
    });
    
    // Touch support para mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    carrosselTrack.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        clearInterval(autoSlideInterval);
    });
    
    carrosselTrack.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe para a esquerda - próximo
                nextSlide();
            } else {
                // Swipe para a direita - anterior
                const totalSlides = slides.length;
                const maxPosition = totalSlides - slidesPerView;
                
                if (currentPosition <= 0) {
                    currentPosition = maxPosition;
                } else {
                    currentPosition -= 1;
                }
                updateCarrosselPosition();
            }
        }
    }
});



