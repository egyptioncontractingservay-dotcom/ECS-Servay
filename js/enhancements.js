/* ============================================
   PROFESSIONAL ENHANCEMENTS SCRIPT
   ============================================ */

(function() {
    'use strict';

    // Loading Screen
    window.addEventListener('load', function() {
        const loadingScreen = document.querySelector('.loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hide');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 1500);
        }
    });

    // Scroll to Top Button
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });

        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Animate on Scroll Enhancement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.service-card, .project-card, .course-card, .equipment-card, .software-card').forEach(el => {
        observer.observe(el);
    });

    // Stats Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const h3 = entry.target.querySelector('h3');
                if (h3) {
                    const text = h3.textContent;
                    const number = parseInt(text.replace(/\D/g, ''));
                    if (!isNaN(number)) {
                        h3.textContent = '0';
                        animateCounter(h3, number);
                        entry.target.dataset.animated = 'true';
                    }
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-card').forEach(card => {
        statsObserver.observe(card);
    });

    // Parallax Effect for Hero
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroVisual = hero.querySelector('.hero-visual');
            if (heroVisual) {
                heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        }
    });

    // Form Validation Enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                if (!this.value.trim()) {
                    this.style.borderColor = '#ff6b35';
                    this.style.boxShadow = '0 0 0 3px rgba(255, 107, 53, 0.1)';
                } else {
                    this.style.borderColor = '';
                    this.style.boxShadow = '';
                }
            });

            input.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.style.borderColor = '#4ade80';
                    this.style.boxShadow = '0 0 0 3px rgba(74, 222, 128, 0.1)';
                }
            });
        });
    });

    // Lazy Loading Images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // Copy to Clipboard Function
    window.copyToClipboard = function(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('تم النسخ!', 'success');
            });
        }
    };

    // Show Notification
    window.showNotification = function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 25px;
            background: ${type === 'success' ? '#4ade80' : '#ff6b35'};
            color: white;
            border-radius: 10px;
            font-weight: 600;
            z-index: 99999;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    };

    // Click to Call Enhancement
    document.querySelectorAll('a[href^="tel:"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth > 768) {
                e.preventDefault();
                const phone = this.getAttribute('href').replace('tel:', '');
                copyToClipboard(phone);
            }
        });
    });

    // Keyboard Navigation Enhancement
    document.addEventListener('keydown', function(e) {
        // ESC to close chatbot
        if (e.key === 'Escape') {
            const chatbotContainer = document.getElementById('chatbotContainer');
            const chatbotToggle = document.getElementById('chatbotToggle');
            if (chatbotContainer && chatbotContainer.classList.contains('active')) {
                chatbotContainer.classList.remove('active');
                chatbotToggle.classList.remove('active');
            }
        }
        
        // Ctrl/Cmd + K to open chatbot
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const chatbotToggle = document.getElementById('chatbotToggle');
            if (chatbotToggle) {
                chatbotToggle.click();
            }
        }
    });

    // Performance Monitoring
    if ('PerformanceObserver' in window) {
        const perfObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 100) {
                    console.warn(`Slow interaction detected: ${entry.name} took ${entry.duration}ms`);
                }
            }
        });
        
        try {
            perfObserver.observe({ entryTypes: ['measure'] });
        } catch (e) {
            // Silently fail if not supported
        }
    }

    // Add animation classes dynamically
    const addAnimationClasses = () => {
        document.querySelectorAll('.service-icon').forEach(icon => {
            icon.classList.add('float');
        });
        
        document.querySelectorAll('.btn-main, .btn-outline').forEach(btn => {
            btn.classList.add('shine');
        });
    };

    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAnimationClasses);
    } else {
        addAnimationClasses();
    }

    // Service Worker Registration (for future PWA)
    if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
        window.addEventListener('load', () => {
            // navigator.serviceWorker.register('/sw.js')
            //     .then(reg => console.log('SW registered'))
            //     .catch(err => console.log('SW registration failed'));
        });
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    console.log('%c🚀 ECS Website Loaded Successfully!', 'color: #ff6b35; font-size: 20px; font-weight: bold;');
    console.log('%c💡 Press Ctrl+K to open chatbot', 'color: #ff9500; font-size: 14px;');

})();

// FAQ Toggle Function
function toggleFAQ(element) {
    const answer = element.querySelector('.faq-answer');
    const icon = element.querySelector('.fa-chevron-down');
    const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== element) {
            item.querySelector('.faq-answer').style.maxHeight = '0';
            item.querySelector('.fa-chevron-down').style.transform = 'rotate(0deg)';
        }
    });
    
    // Toggle current FAQ
    if (isOpen) {
        answer.style.maxHeight = '0';
        icon.style.transform = 'rotate(0deg)';
    } else {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.style.transform = 'rotate(180deg)';
    }
}
