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