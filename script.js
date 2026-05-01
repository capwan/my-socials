/**
 * 🌌 Minimal Particles Background
 * Лёгкая анимация без нагрузки на браузер
 */

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    
    // Настройка canvas под размер экрана
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // Параметры частиц
    const particles = [];
    const particleCount = 40;
    const connectionDistance = 120;
    
    // Класс частицы
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 1.5 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Отскок от краёв
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.fill();
        }
    }
    
    // Создаём частицы
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    // Соединяем близкие частицы линиями
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < connectionDistance) {
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }
    
    // Анимационный цикл
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        requestAnimationFrame(animate);
    }
    
    animate();
    
    // ===== ДОП: Эффект "пульсации" при клике на кнопку =====
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            // Создаём визуальный эффект нажатия
            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255,255,255,0.4);
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                pointer-events: none;
                left: ${e.clientX - this.getBoundingClientRect().left}px;
                top: ${e.clientY - this.getBoundingClientRect().top}px;
                width: 20px;
                height: 20px;
            `;
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Добавляем ключевые кадры для эффекта ряби
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-effect {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});



// ===== DYNAMIC FAVICON =====
function setFavicon(emoji) {
    const favicon = document.getElementById('favicon');
    favicon.href = `data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>${encodeURIComponent(emoji)}</text></svg>`;
}

// Меняем иконку при наведении на кнопки
document.querySelectorAll('.social-btn').forEach(btn => {
    const map = {
        'github': '🐙',
        'linkedin': '💼',
        'instagram': '📸',
        'telegram': '✈️'
    };
    
    btn.addEventListener('mouseenter', () => {
        const platform = btn.classList[1]; // github, linkedin...
        if (map[platform]) setFavicon(map[platform]);
    });
    
    btn.addEventListener('mouseleave', () => {
        setFavicon('⚡'); // Возвращаем дефолтную
    });
});

// Также меняем при фокусе с клавиатуры
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('focus', () => {
        const platform = btn.classList[1];
        if (map[platform]) setFavicon(map[platform]);
    });
    btn.addEventListener('blur', () => setFavicon('⚡'));
});