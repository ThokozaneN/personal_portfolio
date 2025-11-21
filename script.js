// Main JavaScript for Thokozane Nxumalo Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initThemeToggle();
    initScrollAnimations();
    initMobileMenu();
    initTypingEffect();
    initCurrentTime();
    initScrollProgress();
    initContactForm();
    initResumeModal();
    initCookieBanner();
    initFloatingParticles();
    initSmoothScrolling();
    initCurrentYear();

    // Re-initialize scroll animations after a short delay
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
});

// Theme Toggle Functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const lightIcon = document.getElementById('lightIcon');
    const darkIcon = document.getElementById('darkIcon');
    
    if (!themeToggle || !lightIcon || !darkIcon) return;
    
    // Check for saved theme or prefer color scheme
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setDarkTheme(lightIcon, darkIcon);
    } else {
        setLightTheme(lightIcon, darkIcon);
    }
    
    // Theme toggle event
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        
        if (currentTheme === 'light') {
            setDarkTheme(lightIcon, darkIcon);
        } else {
            setLightTheme(lightIcon, darkIcon);
        }
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                setDarkTheme(lightIcon, darkIcon);
            } else {
                setLightTheme(lightIcon, darkIcon);
            }
        }
    });
}

function setDarkTheme(lightIcon, darkIcon) {
    document.documentElement.style.transition = 'all 0.5s ease';
    document.documentElement.setAttribute('data-theme', 'dark');
    lightIcon.classList.remove('active');
    darkIcon.classList.add('active');
    localStorage.setItem('theme', 'dark');
    
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 500);
}

function setLightTheme(lightIcon, darkIcon) {
    document.documentElement.style.transition = 'all 0.5s ease';
    document.documentElement.setAttribute('data-theme', 'light');
    darkIcon.classList.remove('active');
    lightIcon.classList.add('active');
    localStorage.setItem('theme', 'light');
    
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 500);
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to section
                if (entry.target.classList.contains('section')) {
                    entry.target.classList.add('visible');
                }
                
                // Handle specific elements with staggered animations
                if (entry.target.classList.contains('about-content')) {
                    entry.target.classList.add('visible');
                }
                
                if (entry.target.classList.contains('contact-container')) {
                    entry.target.classList.add('visible');
                }
                
                if (entry.target.classList.contains('projects-grid')) {
                    const cards = entry.target.querySelectorAll('.project-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('visible');
                        }, index * 200);
                    });
                }
                
                // Handle individual project cards
                if (entry.target.classList.contains('project-card')) {
                    entry.target.classList.add('visible');
                }
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Observe individual animated elements
    const animatedElements = document.querySelectorAll(
        '.about-content, .contact-container, .projects-grid, .project-card'
    );
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !mobileMenu) return;

    // Toggle mobile menu
    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        mobileMenu.setAttribute('aria-hidden', isExpanded);
        
        // Toggle body scroll
        document.body.style.overflow = isExpanded ? 'auto' : 'hidden';
    });

    // Close mobile menu when clicking links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        });
    });

    // Update active nav link on scroll
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        
        // Get all sections
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => link.classList.remove('active'));
                mobileNavLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const currentLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                const currentMobileLink = document.querySelector(`.mobile-nav-link[href="#${sectionId}"]`);
                
                if (currentLink) currentLink.classList.add('active');
                if (currentMobileLink) currentMobileLink.classList.add('active');
            }
        });
    }

    // Update nav links on scroll
    window.addEventListener('scroll', throttle(updateActiveNavLink, 100));
    updateActiveNavLink(); // Initial call
}

// Typing Effect
function initTypingEffect() {
    const typingText = document.getElementById('typingText');
    if (!typingText) return;

    const texts = [
        'Say No To GBV',
        'Stop GBV',
        //'Fullstack Web Developer',
        //'UI/UX Enthusiast',
        //'Problem Solver',
        //'Digital Craftsman'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;
    let erasingDelay = 50;
    let newTextDelay = 2000;

    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            // Remove character
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = erasingDelay;
        } else {
            // Add character
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            // Pause at end of text
            isDeleting = true;
            typingDelay = newTextDelay;
        } else if (isDeleting && charIndex === 0) {
            // Move to next text
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingDelay = 500;
        }

        setTimeout(type, typingDelay);
    }

    // Start typing effect after a short delay
    setTimeout(type, 1000);
}

// Current Time Display
function initCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    if (!currentTimeElement) return;
    
    function updateTime() {
        const now = new Date();
        const options = { 
            timeZone: 'Africa/Johannesburg',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        };
        const timeString = now.toLocaleTimeString('en-ZA', options);
        currentTimeElement.textContent = `SAST ${timeString}`;
    }
    
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
}

// Scroll Progress Bar
function initScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / documentHeight) * 100;
        
        scrollProgress.style.width = scrollPercentage + '%';
    }
    
    window.addEventListener('scroll', throttle(updateScrollProgress, 16));
    window.addEventListener('resize', throttle(updateScrollProgress, 16));
    updateScrollProgress(); // Initial call
}

// Contact Form Handling with FormSubmit
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        if (validateContactForm()) {
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            
            try {
                // Submit to FormSubmit
                const formData = new FormData(contactForm);
                const result = await submitToFormSubmit(contactForm, formData);
                
                if (result) {
                    showToast('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                    contactForm.reset();
                    // Clear validation states
                    clearAllErrors(contactForm);
                }
            } catch (error) {
                console.error('Form submission error:', error);
                // Even if there's an error, FormSubmit might still process the email
                showToast('Message sent! There might be a slight delay in delivery. If you don\'t hear back within 24 hours, please email me directly at dev@thokozane.co.za', 'success');
                contactForm.reset();
                clearAllErrors(contactForm);
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
                submitButton.classList.remove('loading');
            }
        }
    });

    // Real-time validation
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateContactField(input);
        });
        
        input.addEventListener('input', () => {
            clearError(input);
            // Add valid state for real-time feedback
            if (input.value.trim() && validateContactField(input, true)) {
                input.classList.add('valid');
            } else {
                input.classList.remove('valid');
            }
        });
        
        // Clear valid state when field is empty
        input.addEventListener('change', () => {
            if (!input.value.trim()) {
                input.classList.remove('valid');
            }
        });
    });
}

function validateContactForm() {
    let isValid = true;
    const form = document.getElementById('contactForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateContactField(field)) {
            isValid = false;
        } else {
            field.classList.add('valid');
        }
    });
    
    return isValid;
}

function validateContactField(field, silent = false) {
    const value = field.value.trim();
    const errorElement = document.getElementById(field.id + 'Error');
    
    // Clear previous error
    if (!silent) clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        if (!silent) showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            if (!silent) showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
        if (!silent) showError(field, 'Please select an option');
        return false;
    }
    
    return true;
}

// Resume Form Handling with FormSubmit
function initResumeModal() {
    const resumeModal = document.getElementById('resumeModal');
    const requestResumeBtn = document.getElementById('requestResume');
    const closeModalBtn = document.getElementById('closeModal');
    const resumeForm = document.getElementById('resumeForm');

    // Open modal
    if (requestResumeBtn) {
        requestResumeBtn.addEventListener('click', () => {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeResumeModal);
    }

    // Close modal when clicking outside
    if (resumeModal) {
        resumeModal.addEventListener('click', (e) => {
            if (e.target === resumeModal) {
                closeResumeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && resumeModal && resumeModal.classList.contains('active')) {
            closeResumeModal();
        }
    });

    // Handle resume form submission
    if (resumeForm) {
        resumeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (validateResumeForm()) {
                const submitButton = resumeForm.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                
                // Show loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Request...';
                submitButton.disabled = true;
                submitButton.classList.add('loading');
                
                try {
                    // Submit to FormSubmit
                    const formData = new FormData(resumeForm);
                    const result = await submitToFormSubmit(resumeForm, formData);
                    
                    if (result) {
                        showToast('Resume request sent successfully! I\'ll email it to you within 24 hours.', 'success');
                        closeResumeModal();
                        resumeForm.reset();
                        // Clear validation states
                        clearAllErrors(resumeForm);
                    }
                } catch (error) {
                    console.error('Resume form submission error:', error);
                    // Even if there's an error, FormSubmit might still process the email
                    showToast('Resume request sent! There might be a slight delay. If you don\'t receive it within 24 hours, please email me directly at dev@thokozane.co.za', 'success');
                    closeResumeModal();
                    resumeForm.reset();
                    clearAllErrors(resumeForm);
                } finally {
                    // Reset button state
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    submitButton.classList.remove('loading');
                }
            }
        });

        // Real-time validation for resume form
        const resumeFormInputs = resumeForm.querySelectorAll('input, select, textarea');
        resumeFormInputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateResumeField(input);
            });
            
            input.addEventListener('input', () => {
                clearError(input);
                // Add valid state for real-time feedback
                if (input.value.trim() && validateResumeField(input, true)) {
                    input.classList.add('valid');
                } else {
                    input.classList.remove('valid');
                }
            });
            
            // Clear valid state when field is empty
            input.addEventListener('change', () => {
                if (!input.value.trim()) {
                    input.classList.remove('valid');
                    input.classList.remove('error');
                    clearError(input);
                    // For selects, check if it's the default option
                    if (input.tagName === 'SELECT' && !input.value) {
                        input.classList.add('error');
                        showError(input, 'Please select an option');
                    }
                }
            });
        });
    }
}

function validateResumeForm() {
    let isValid = true;
    const form = document.getElementById('resumeForm');
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateResumeField(field)) {
            isValid = false;
        } else {
            field.classList.add('valid');
        }
    });
    
    return isValid;
}

function validateResumeField(field, silent = false) {
    const value = field.value.trim();
    const errorElement = document.getElementById(field.id + 'Error');
    
    // Clear previous error
    if (!silent) clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        if (!silent) showError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            if (!silent) showError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Select validation
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) {
        if (!silent) showError(field, 'Please select an option');
        return false;
    }
    
    // Phone validation (optional but if provided, validate)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            if (!silent) showError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

// FormSubmit Integration - Always assume success
async function submitToFormSubmit(form, formData) {
    const action = form.getAttribute('action');
    
    try {
        // Just attempt to send, don't worry about response
        await fetch(action, {
            method: 'POST',
            body: formData
        });
        
        return true; // Always return success
    } catch (error) {
        console.error('FormSubmit error:', error);
        return true; // Still return success since emails often go through anyway
    }
}

// Utility Functions
function showError(field, message) {
    const errorElement = document.getElementById(field.id + 'Error');
    field.classList.add('error');
    field.classList.remove('valid');
    if (errorElement) {
        errorElement.textContent = message;
    }
}

function clearError(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    field.classList.remove('error');
    if (errorElement) {
        errorElement.textContent = '';
    }
}

function clearAllErrors(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        clearError(field);
        field.classList.remove('valid');
        field.classList.remove('error');
    });
}

function closeResumeModal() {
    const resumeModal = document.getElementById('resumeModal');
    const resumeForm = document.getElementById('resumeForm');
    
    if (resumeModal) {
        resumeModal.classList.remove('active');
    }
    
    if (resumeForm) {
        // Clear any errors when closing
        clearAllErrors(resumeForm);
    }
    
    document.body.style.overflow = 'auto';
}

// Cookie Banner
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');
    
    if (!cookieBanner || !acceptCookiesBtn) return;
    
    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.classList.add('active');
        }, 2000);
    }
    
    acceptCookiesBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieBanner.classList.remove('active');
    });
}

// Floating Particles Animation
function initFloatingParticles() {
    const particlesContainer = document.getElementById('floatingParticles');
    if (!particlesContainer) return;
    
    const particleCount = 15;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'floating-particle';
    
    // Random properties
    const size = Math.random() * 4 + 1;
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const opacity = Math.random() * 0.3 + 0.1;
    
    // Apply styles
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: var(--primary-color);
        border-radius: 50%;
        left: ${posX}%;
        top: ${posY}%;
        opacity: ${opacity};
        animation: float ${duration}s ease-in-out ${delay}s infinite;
    `;
    
    // Add to container
    container.appendChild(particle);
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    if (history.pushState) {
                        history.pushState(null, null, href);
                    }
                }
            }
        });
    });
}

// Current Year in Footer
function initCurrentYear() {
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
}

// Toast Notification System
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        // Create toast container if it doesn't exist
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        container.setAttribute('aria-live', 'polite');
        container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Remove toast after delay
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Performance optimization: Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization: Debounce function
function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Re-initialize on window resize (with debounce)
const debouncedResize = debounce(() => {
    initScrollAnimations();
    initFloatingParticles();
}, 250);

window.addEventListener('resize', debouncedResize);

// Error boundary for graceful error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    showToast('Something went wrong. Please refresh the page.', 'error');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Page became visible again, reinitialize animations
        setTimeout(() => {
            initScrollAnimations();
        }, 100);
    }
});

// Add CSS for floating particles if not already in styles
function addFloatingParticlesCSS() {
    if (!document.querySelector('style[data-floating-particles]')) {
        const style = document.createElement('style');
        style.setAttribute('data-floating-particles', 'true');
        style.textContent = `
            @keyframes float {
                0%, 100% { 
                    transform: translate(0, 0) rotate(0deg) scale(1);
                }
                25% { 
                    transform: translate(20px, -20px) rotate(90deg) scale(1.1);
                }
                50% { 
                    transform: translate(-15px, 15px) rotate(180deg) scale(0.9);
                }
                75% { 
                    transform: translate(10px, -10px) rotate(270deg) scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize floating particles CSS
addFloatingParticlesCSS();