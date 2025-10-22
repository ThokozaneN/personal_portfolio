// Create floating particles for hero background
function createParticles() {
    const particlesContainer = document.getElementById('floatingParticles');
    const particleCount = 15;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random properties
        const size = Math.random() * 40 + 10;
        const left = Math.random() * 100;
        const animationDuration = Math.random() * 30 + 20;
        const animationDelay = Math.random() * 5;
        const opacity = Math.random() * 0.1 + 0.05;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${animationDuration}s`;
        particle.style.animationDelay = `${animationDelay}s`;
        particle.style.opacity = opacity;

        particlesContainer.appendChild(particle);
    }
}

// Scroll progress bar
function updateScrollProgress() {
    const scrollProgress = document.getElementById('scrollProgress');
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = `${scrollPercentage}%`;
}

// Scroll-triggered animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.section-title, .about-text, .about-image, .tech-pill, .project-card, .contact-info, .contact-card, .contact-detail, .social-icon, .contact-form, .form-group');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
            
            // Stagger animations for tech pills
            if (element.classList.contains('tech-pill')) {
                const index = Array.from(element.parentElement.children).indexOf(element);
                element.style.transitionDelay = `${index * 0.1}s`;
            }
            
            // Stagger animations for contact details
            if (element.classList.contains('contact-detail')) {
                const index = Array.from(element.parentElement.children).indexOf(element);
                element.style.transitionDelay = `${index * 0.2}s`;
            }
            
            // Stagger animations for form groups
            if (element.classList.contains('form-group')) {
                const index = Array.from(element.parentElement.children).indexOf(element);
                element.style.transitionDelay = `${index * 0.1}s`;
            }
        }
    });
}

// Typing Animation
const typingText = document.getElementById('typingText');
const texts = ['Fullstack Web Dev', 'UI/UX Designer', 'Problem Solver', 'Tech Enthusiast'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
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
        typingSpeed = 1000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typingSpeed = 500; // Pause before starting next text
    }

    setTimeout(type, typingSpeed);
}

// Form validation
function validateForm() {
    let isValid = true;
    
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

    // Validate project type
    const subject = document.getElementById('subject');
    if (!subject.value.trim()) {
        document.getElementById('subjectError').textContent = 'Project type is required';
        subject.classList.add('error');
        isValid = false;
    }

    // Validate message
    const message = document.getElementById('message');
    if (!message.value.trim()) {
        document.getElementById('messageError').textContent = 'Project details are required';
        message.classList.add('error');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        document.getElementById('messageError').textContent = 'Please provide more details about your project (at least 10 characters)';
        message.classList.add('error');
        isValid = false;
    }

    return isValid;
}

// Mailto function that doesn't navigate away
function sendEmail(subject = '', body = '') {
    return new Promise((resolve) => {
        const email = 'dev@thokozane.co.za';
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Create a temporary anchor element to trigger mailto
        const anchor = document.createElement('a');
        anchor.href = mailtoLink;
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        
        // Trigger click
        anchor.click();
        
        // Clean up
        document.body.removeChild(anchor);
        
        // Always resolve as success since we can't reliably detect if email client opened
        resolve(true);
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
            showToast('Email client opened successfully! Please send your message to dev@thokozane.co.za', 'success');
        });
}

// Resume request function
function requestResume() {
    const subject = 'Resume Request - Thokozane Nxumalo Portfolio';
    const body = `Hello Thokozane,

I came across your portfolio and would like to request a copy of your resume.

Could you please share your resume with me? I'm interested in learning more about your experience and skills.

Best regards,
[Your Name]
[Your Company/Organization - Optional]
[Your Email/Phone - Optional]`;
    
    sendEmail(subject, body)
        .then(() => {
            showToast('Opening email client to request resume...', 'success');
        })
        .catch(() => {
            showToast('Failed to open email client. Please email dev@thokozane.co.za directly.', 'error');
        });
}

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const lightIcon = document.getElementById('lightIcon');
const darkIcon = document.getElementById('darkIcon');
const body = document.body;

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark');
    lightIcon.classList.remove('active');
    darkIcon.classList.add('active');
}

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
        body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        lightIcon.classList.add('active');
        darkIcon.classList.remove('active');
    } else {
        body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        lightIcon.classList.remove('active');
        darkIcon.classList.add('active');
    }
});

// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
    mobileMenu.setAttribute('aria-hidden', isExpanded);
    
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (mobileMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto';
    });
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateScrollProgress();
    handleScrollAnimations();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Form Submission with Validation and Toast Feedback
const contactForm = document.getElementById('contactForm');
const toastContainer = document.getElementById('toastContainer');
const submitButton = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Disable submit button to prevent multiple submissions
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Sending...';
    submitButton.disabled = true;
    
    // Validate form
    if (!validateForm()) {
        showToast('Please fix the errors in the form before submitting.', 'error');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
        return;
    }
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const projectType = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Create email content
    const emailSubject = `New Project Inquiry: ${projectType}`;
    const emailBody = `Hello Thokozane,

I would like to discuss a ${projectType} project with you.

Here are my details:
• Name: ${name}
• Email: ${email}

Project Details:
${message}

I look forward to hearing from you.

Best regards,
${name}`;
    
    try {
        // Use mailto function
        await sendEmail(emailSubject, emailBody);
        
        // Show success toast
        showToast('Your email client is opening! Please send the pre-filled message to complete your inquiry.', 'success');
        
        // Reset form after a short delay
        setTimeout(() => {
            contactForm.reset();
            // Clear any error states
            document.querySelectorAll('.form-control').forEach(input => {
                input.classList.remove('error');
            });
            document.querySelectorAll('.error-message').forEach(error => {
                error.textContent = '';
            });
        }, 2000);
        
    } catch (error) {
        // Show error toast
        showToast('Failed to open email client. Please email us directly at dev@thokozane.co.za', 'error');
    } finally {
        // Re-enable submit button after a delay
        setTimeout(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        }, 2000);
    }
});

// Real-time form validation
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        // Clear error when user starts typing
        if (this.classList.contains('error')) {
            const fieldName = this.id;
            document.getElementById(fieldName + 'Error').textContent = '';
            this.classList.remove('error');
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.id;
    const errorElement = document.getElementById(fieldName + 'Error');
    
    switch(fieldName) {
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
        case 'subject':
            if (!value) {
                errorElement.textContent = 'Project type is required';
                field.classList.add('error');
            }
            break;
        case 'message':
            if (!value) {
                errorElement.textContent = 'Project details are required';
                field.classList.add('error');
            } else if (value.length < 10) {
                errorElement.textContent = 'Please provide more details about your project (at least 10 characters)';
                field.classList.add('error');
            }
            break;
    }
}

function showToast(message, type = 'success') {
    // Remove existing toasts
    const existingToasts = toastContainer.querySelectorAll('.toast');
    existingToasts.forEach(toast => {
        toast.remove();
    });
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-circle' : type === 'info' ? 'info-circle' : 'exclamation-triangle'}"></i>
        </div>
        <div class="toast-message">${message}</div>
        <button class="toast-close" onclick="this.parentElement.remove()" aria-label="Close notification">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    // Auto-hide toast after 8 seconds (longer for important messages)
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 500);
        }
    }, 8000);
}

// Update current time for South Africa
function updateTime() {
    const now = new Date();
    const options = { 
        timeZone: 'Africa/Johannesburg',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const timeString = now.toLocaleTimeString('en-ZA', options);
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
}

// Update current year in footer
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Set active nav link based on scroll position
function setActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Create particles
    createParticles();
    
    // Start typing animation
    setTimeout(type, 1000);
    
    // Start time update
    updateTime();
    setInterval(updateTime, 1000);
    
    // Update current year
    updateCurrentYear();
    
    // Initial scroll animations check
    handleScrollAnimations();
    
    // Set initial active nav link
    setActiveNavLink();
    
    // Add scroll event listeners
    window.addEventListener('scroll', handleScrollAnimations);
    window.addEventListener('scroll', setActiveNavLink);
    window.addEventListener('scroll', updateScrollProgress);
    
    // Add mailto links to any elements with class 'mailto-link'
    document.querySelectorAll('.mailto-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            quickContact();
        });
    });
    
    // Add click event to email in contact details
    const emailLink = document.querySelector('a[href="mailto:dev@thokozane.co.za"]');
    if (emailLink) {
        emailLink.addEventListener('click', function(e) {
            e.preventDefault();
            quickContact();
        });
    }
    
    // Add resume button event listener
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', requestResume);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileMenu.classList.contains('active') && 
            !e.target.closest('.mobile-menu') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });

    // Handle escape key to close mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            mobileMenu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = 'auto';
        }
    });
});