// ========================================
// CUSTOM CURSOR ANIMATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorTrail = document.querySelector('.cursor-trail');

    let mouseX = 0, mouseY = 0;
    let trailX = 0, trailY = 0;
    let outlineX = 0, outlineY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Cursor dot follows immediately
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';

        // Cursor outline follows with delay
        setTimeout(() => {
            cursorOutline.style.left = (mouseX - 15) + 'px';
            cursorOutline.style.top = (mouseY - 15) + 'px';
        }, 100);

        // Create trail effect
        createTrail(mouseX, mouseY);
    });

    function createTrail(x, y) {
        const trail = document.createElement('div');
        trail.style.position = 'fixed';
        trail.style.left = (x - 3) + 'px';
        trail.style.top = (y - 3) + 'px';
        trail.style.width = '6px';
        trail.style.height = '6px';
        trail.style.background = 'var(--accent)';
        trail.style.borderRadius = '50%';
        trail.style.pointerEvents = 'none';
        trail.style.zIndex = '9998';
        trail.style.opacity = '0.6';
        trail.style.animation = 'fadeOut 0.8s ease-out forwards';
        document.body.appendChild(trail);

        setTimeout(() => trail.remove(), 800);
    }

    // Hide cursor on hover over interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .btn, .social-link, .cert-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '0.5';
            cursorOutline.style.opacity = '0.3';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '0.7';
        });
    });

    // Initialize other animations
    initNavScroll();
    initScrollAnimations();
    initNavigation();
    initScrollSpy();
    initCounterAnimation();
    initCardHoverEffects();
    initScrollToTop();
});

// ========================================
// NAV BAR SCROLL STATE
// ========================================

function initNavScroll() {
    const nav = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }, { passive: true });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                const delay = index % 6;
                entry.target.style.animationDelay = `${delay * 0.1}s`;
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll(
        '.skill-card, .achievement-card, .project-card, ' +
        '.internship-container, .cert-group, .about-left, .about-right'
    );
    
    elements.forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// SMOOTH NAVIGATION
// ========================================

function initNavigation() {
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            if (navMenu) navMenu.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                if (navMenu) navMenu.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
                
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                updateActiveNavLink(this);
            }
        });
    });
}

function updateActiveNavLink(link) {
    document.querySelectorAll('nav a').forEach(a => {
        a.classList.remove('active');
    });
    link.classList.add('active');
}

// ========================================
// SCROLL SPY
// ========================================

function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200 && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

// ========================================
// COUNTER ANIMATION
// ========================================

function initCounterAnimation() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (!entry.isIntersecting) return;
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(now) {
                const elapsed = now - startTime;
                const progress = Math.min(elapsed / duration, 1);
                counter.textContent = Math.round(target * progress);
                if (progress < 1) requestAnimationFrame(updateCounter);
                else counter.textContent = target;
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(counter);
        });
    }, { threshold: 0.3 });

    counters.forEach(function(c) { observer.observe(c); });
}

// ========================================
// CARD HOVER EFFECTS
// ========================================

function initCardHoverEffects() {
    const cards = document.querySelectorAll(
        '.skill-card, .achievement-card, .project-card, ' +
        '.cert-card, .internship-container'
    );

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            if (window.innerWidth > 768) {
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// ========================================
// SCROLL TO TOP BUTTON
// ========================================

function initScrollToTop() {
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.className = 'scroll-to-top';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        color: white;
        border: none;
        cursor: none;
        font-size: 20px;
        z-index: 99;
        opacity: 0;
        transition: all 0.3s;
        display: none;
        box-shadow: 0 10px 30px rgba(0, 102, 255, 0.4);
        font-weight: bold;
    `;

    document.body.appendChild(scrollTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.display = 'block';
            scrollTopBtn.style.opacity = '1';
        } else {
            scrollTopBtn.style.opacity = '0';
            setTimeout(() => {
                scrollTopBtn.style.display = 'none';
            }, 300);
        }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// MOBILE RESPONSIVENESS
// ========================================

function handleMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');

    if (window.innerWidth <= 768) {
        if (menuToggle) menuToggle.style.display = 'flex';
    } else {
        if (navMenu) navMenu.classList.remove('active');
        if (menuToggle) menuToggle.style.display = 'none';
    }
}

window.addEventListener('resize', handleMobileMenu);
window.addEventListener('load', handleMobileMenu);

// ========================================
// SMOOTH LOADING
// ========================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
    console.log('%c Portfolio Website Loaded! 🚀', 'color: #00d4ff; font-size: 16px; font-weight: bold;');
});

// ========================================
// ADD FADE OUT ANIMATION FOR TRAIL
// ========================================

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(style);
// ========================================
// CONTACT FORM HANDLING WITH EMAILJS
// ========================================

// Initialize EmailJS - Replace with your credentials
// Sign up at https://www.emailjs.com/ to get these IDs
(function() {
    // YOUR SERVICE ID: service_xxxxx
    // YOUR TEMPLATE ID: template_xxxxx
    // YOUR PUBLIC KEY: your_public_key
    emailjs.init("YOUR_PUBLIC_KEY_HERE"); // Replace with your EmailJS public key
})();

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.querySelector('.form-status');
    const submitBtn = document.querySelector('.submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!name || !email || !subject || !message) {
                showFormStatus('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormStatus('Please enter a valid email address', 'error');
                return;
            }

            // Show loading state
            submitBtn.textContent = '⏳ Sending...';
            submitBtn.disabled = true;

            try {
                // If using EmailJS (recommended)
                if (typeof emailjs !== 'undefined') {
                    const templateParams = {
                        to_email: 'vdharshini122006@gmail.com',
                        from_name: name,
                        from_email: email,
                        subject: subject,
                        message: message,
                        reply_to: email
                    };

                    const response = await emailjs.send(
                        'YOUR_SERVICE_ID',      // Replace with your service ID
                        'YOUR_TEMPLATE_ID',     // Replace with your template ID
                        templateParams
                    );

                    if (response.status === 200) {
                        showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                        
                        // Celebrate with animation
                        animateSuccess();
                    }
                } else {
                    // Fallback: Send via Formspree
                    const formData = new FormData();
                    formData.append('name', name);
                    formData.append('email', email);
                    formData.append('subject', subject);
                    formData.append('message', message);

                    const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        showFormStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
                        contactForm.reset();
                        animateSuccess();
                    } else {
                        throw new Error('Failed to send message');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                showFormStatus('❌ Failed to send message. Please try the direct email link instead.', 'error');
            } finally {
                submitBtn.textContent = '✨ Send Message';
                submitBtn.disabled = false;
            }
        });
    }
});

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show form status message
function showFormStatus(message, type) {
    const formStatus = document.querySelector('.form-status');
    if (formStatus) {
        formStatus.textContent = message;
        formStatus.className = `form-status ${type}`;
        
        // Auto-hide success message after 4 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.textContent = '';
                formStatus.className = 'form-status';
            }, 4000);
        }
    }
}

// Success animation
function animateSuccess() {
    // Create floating particles
    for (let i = 0; i < 8; i++) {
        createConfetti();
    }
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '10000';
    confetti.textContent = ['✨', '🎉', '⭐', '🚀', '💫'][Math.floor(Math.random() * 5)];
    confetti.style.fontSize = '2rem';
    confetti.style.left = Math.random() * window.innerWidth + 'px';
    confetti.style.top = '50%';
    confetti.style.animation = 'confettiFall 2s ease-out forwards';
    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 2000);
}

// Add confetti animation
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(400px) rotate(360deg) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);