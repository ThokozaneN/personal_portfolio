// Performance optimizations
let scrollTimeout;
let animationFrameId;

// Debounced scroll handler
function debounce(func, wait) {
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(scrollTimeout);
            func(...args);
        };
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(later, wait);
    };
}

// Throttled scroll handler for better performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Create floating particles for hero background - OPTIMIZED
function createParticles() {
    const particlesContainer = document.getElementById('floatingParticles');
    if (!particlesContainer) return;
    
    const particleCount = 12; // Reduced for mobile performance
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Optimized random properties
        const size = Math.random() * 30 + 8; // Smaller particles
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 25 + 15; // Faster animations
        const animationDelay = Math.random() * 3;
        const opacity = Math.random() * 0.08 + 0.03; // More subtle

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${left}%;
            animation-duration: ${animationDuration}s;
            animation-delay: ${animationDelay}s;
            opacity: ${opacity};
            will-change: transform, opacity;
        `;

        fragment.appendChild(particle);
    }
    
    particlesContainer.appendChild(fragment);
}

// Scroll progress bar - OPTIMIZED
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    if (!scrollProgress) return;
    
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    // Use transform for better performance
    scrollProgress.style.transform = `scaleX(${scrollPercentage / 100})`;
}

// Intersection Observer for scroll animations - REPLACES handleScrollAnimations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                element.classList.add('visible');
                
                // Stagger animations
                if (element.classList.contains('tech-pill')) {
                    const index = Array.from(element.parentElement.children).indexOf(element);
                    element.style.transitionDelay = `${index * 0.08}s`;
                }
                
                if (element.classList.contains('contact-detail')) {
                    const index = Array.from(element.parentElement.children).indexOf(element);
                    element.style.transitionDelay = `${index * 0.15}s`;
                }
                
                if (element.classList.contains('form-group')) {
                    const index = Array.from(element.parentElement.children).indexOf(element);
                    element.style.transitionDelay = `${index * 0.08}s`;
                }
                
                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.section-title, .about-text, .about-image, .tech-pill, .project-card, .contact-info, .contact-card, .contact-detail, .social-icon, .contact-form, .form-group'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Optimized Typing Animation
const typingText = document.getElementById('typingText');
const texts = ['Fullstack Web Dev', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;
let typingTimeout;

function type() {
    if (!typingText) return;
    
    const currentText = texts[textIndex];
    
    if (isDeleting) {
        typingText.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentText.length) {
        isDeleting = true;
        typingSpeed = 1000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500;
    }

    typingTimeout = setTimeout(type, typingSpeed);
}

// Stop typing animation when not visible
function stopTypingAnimation() {
    if (typingTimeout) {
        clearTimeout(typingTimeout);
    }
}

// Form validation - OPTIMIZED
function validateForm() {
    let isValid = true;
    
    // Use requestAnimationFrame for better performance
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    animationFrameId = requestAnimationFrame(() => {
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        
        document.querySelectorAll('.form-control').forEach(input => {
            input.classList.remove('error');
        });

        // Validate name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            document.getElementById('nameError').textContent = 'Full name is required';
            name.classList.add('error');
            isValid = false;
        }

        // Validate email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            document.getElementById('emailError').textContent = 'Email address is required';
            email.classList.add('error');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            document.getElementById('emailError').textContent = 'Please enter a valid email address';
            email.classList.add('error');
            isValid = false;
        }

        // Validate service
        const service = document.getElementById('service');
        if (!service.value) {
            document.getElementById('serviceError').textContent = 'Service selection is required';
            service.classList.add('error');
            isValid = false;
        }

        // Validate message
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            document.getElementById('messageError').textContent = 'Project details are required';
            message.classList.add('error');
            isValid = false;
        } else if (message.value.trim().length < 10) {
            document.getElementById('messageError').textContent = 'Please provide more details (at least 10 characters)';
            message.classList.add('error');
            isValid = false;
        }
    });
    
    return isValid;
}

// Optimized mailto function
function sendEmail(subject = '', body = '') {
    return new Promise((resolve) => {
        const email = 'dev@thokozane.co.za';
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Use window.location for better compatibility
        window.location.href = mailtoLink;
        
        // Fallback timeout
        setTimeout(() => resolve(true), 100);
    });
}

// Quick contact function
function quickContact() {
    const subject = 'Website Inquiry - Potential Project';
    const body = `Hello Thokozane,

I came across your portfolio and would like to discuss a potential project.

Best regards,
[Your Name]`;
    
    sendEmail(subject, body)
        .then(() => {
            showToast('Email client opened! Please send your message to dev@thokozane.co.za', 'success');
        });
}

// Resume request function
function requestResume() {
    const subject = 'Resume Request - Thokozane Nxumalo Portfolio';
    const body = `Hello Thokozane,

I came across your portfolio and would like to request a copy of your resume.

Best regards,
[Your Name]`;
    
    sendEmail(subject, body)
        .then(() => {
            showToast('Opening email client to request resume...', 'success');
        });
}

// Theme Toggle - OPTIMIZED
const themeToggle = document.getElementById('themeToggle');
const lightIcon = document.getElementById('lightIcon');
const darkIcon = document.getElementById('darkIcon');

function initTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark', currentTheme === 'dark');
    lightIcon.classList.toggle('active', currentTheme === 'light');
    darkIcon.classList.toggle('active', currentTheme === 'dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        lightIcon.classList.toggle('active', !isDark);
        darkIcon.classList.toggle('active', isDark);
    });
}

// Mobile Navigation Toggle - OPTIMIZED
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
}

// Navbar scroll effect - OPTIMIZED with throttle
const navbar = document.getElementById('navbar');
function handleNavbarScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 50);
}

// Smooth Scrolling - OPTIMIZED
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Form Submission with FormSubmit.co - BEST SOLUTION
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Validate form before allowing submission
        if (!validateForm()) {
            e.preventDefault();
            showToast('Please fix the form errors before submitting.', 'error');
            return;
        }
        
        // Show loading state but allow natural form submission
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitButton.disabled = true;
        
        showToast('Sending your message...', 'info');
        
        // Form will submit naturally to FormSubmit
        // Since we're not preventing default, the form will submit normally
        // FormSubmit will process and redirect, but we handle the UX with toasts
        
        // Fallback: if still on page after 5 seconds (in case FormSubmit fails), reset button
        setTimeout(() => {
            if (submitButton.disabled) {
                submitButton.innerHTML = originalButtonText;
                submitButton.disabled = false;
                showToast('Submission taking longer than expected. Please try again.', 'info');
            }
        }, 5000);
        
        // Success is handled by FormSubmit's redirect, but we show immediate feedback
        // The page will reload on successful submission, so no need to manually reset
    });
}

// Real-time form validation - OPTIMIZED
function initFormValidation() {
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                const errorElement = document.getElementById(this.id + 'Error');
                if (errorElement) errorElement.textContent = '';
                this.classList.remove('error');
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(field.id + 'Error');
    if (!errorElement) return;

    switch(field.id) {
        case 'name':
            if (!value) {
                errorElement.textContent = 'Full name is required';
                field.classList.add('error');
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                errorElement.textContent = 'Email address is required';
                field.classList.add('error');
            } else if (!emailRegex.test(value)) {
                errorElement.textContent = 'Please enter a valid email address';
                field.classList.add('error');
            }
            break;
        case 'service':
            if (!value) {
                errorElement.textContent = 'Service selection is required';
                field.classList.add('error');
            }
            break;
        case 'message':
            if (!value) {
                errorElement.textContent = 'Project details are required';
                field.classList.add('error');
            } else if (value.length < 10) {
                errorElement.textContent = 'Please provide more details (at least 10 characters)';
                field.classList.add('error');
            }
            break;
    }
}

// Toast system - OPTIMIZED
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    // Remove existing toasts
    toastContainer.querySelectorAll('.toast').forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    const icons = {
        success: 'check',
        error: 'exclamation-circle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${icons[type] || 'info-circle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Add event listener for close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        toast.remove();
    });
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remove after 6 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }
    }, 6000);
}

// Time and date functions - OPTIMIZED
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-ZA', {
            timeZone: 'Africa/Johannesburg',
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Active nav link - OPTIMIZED with Intersection Observer
function initActiveNavObserver() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    const isActive = link.getAttribute('href') === `#${currentSection}`;
                    link.classList.toggle('active', isActive);
                    link.toggleAttribute('aria-current', isActive);
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
}

// Contact interactions for copy functionality
function initContactInteractions() {
    const contactLinks = document.querySelectorAll('.contact-detail-text a[href^="mailto:"], .contact-detail-text a[href^="tel:"]');
    
    contactLinks.forEach(link => {
        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'copy-tooltip';
        tooltip.textContent = 'Click to copy';
        link.parentElement.style.position = 'relative';
        link.parentElement.appendChild(tooltip);
        
        // Show tooltip on hover
        link.addEventListener('mouseenter', () => tooltip.classList.add('show'));
        link.addEventListener('mouseleave', () => tooltip.classList.remove('show'));
        
        // Copy to clipboard on click
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = link.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                tooltip.textContent = 'Copied!';
                tooltip.classList.add('show');
                
                setTimeout(() => {
                    tooltip.textContent = 'Click to copy';
                    tooltip.classList.remove('show');
                    // Open the link after copy
                    window.location.href = link.getAttribute('href');
                }, 1500);
            }).catch(() => {
                // Fallback: just open the link
                window.location.href = link.getAttribute('href');
            });
        });
    });
}

// Initialize everything - OPTIMIZED
function init() {
    // Set initial theme
    initTheme();
    
    // Initialize components
    createParticles();
    initIntersectionObserver();
    initSmoothScroll();
    initFormValidation();
    initActiveNavObserver();
    initContactInteractions();
    
    // Start animations
    setTimeout(type, 1000);
    
    // Initialize time
    updateTime();
    updateCurrentYear();
    setInterval(updateTime, 30000); // Update every 30 seconds instead of 1
    
    // Event listeners with optimizations
    window.addEventListener('scroll', throttle(handleNavbarScroll, 100));
    window.addEventListener('scroll', throttle(updateScrollProgress, 16));
    
    // Resume button
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', requestResume);
    }
    
    // Close mobile menu handlers
    document.addEventListener('click', (e) => {
        if (mobileMenu?.classList.contains('active') && 
            !e.target.closest('.mobile-menu') && 
            !e.target.closest('.hamburger')) {
            toggleMobileMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// Load when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Cleanup on page hide/unload
window.addEventListener('beforeunload', () => {
    stopTypingAnimation();
    if (scrollTimeout) clearTimeout(scrollTimeout);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
});