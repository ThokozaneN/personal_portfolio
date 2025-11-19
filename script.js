class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupTheme();
        this.setupNavigation();
        this.setupScrollAnimations();
        this.setupScrollProgress();
        this.setupForm();
        this.setupLocationTime();
        this.setupCopyright();
        this.setupToastSystem();
        this.setupTypingAnimation();
        this.setupParticles();
        this.setupResumeButton();
        this.setupAnimations();
        this.setupSmoothScrolling();
        this.setupPerformanceOptimizations();
        this.setupErrorHandling();
    }

    // Theme Management
    setupTheme() {
        const themeToggle = document.getElementById('themeToggle');
        const lightIcon = document.getElementById('lightIcon');
        const darkIcon = document.getElementById('darkIcon');
        const savedTheme = localStorage.getItem('theme') || 'light';
        
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcons(lightIcon, darkIcon, savedTheme);

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            this.updateThemeIcons(lightIcon, darkIcon, newTheme);
            this.showToast(`Switched to ${newTheme} mode`, 'info');
            
            // Update particles for new theme
            this.updateParticlesForTheme(newTheme);
        });

        // Remove blue highlight on click
        themeToggle.addEventListener('mousedown', (e) => {
            e.preventDefault();
        });
    }

    updateThemeIcons(lightIcon, darkIcon, theme) {
        if (theme === 'light') {
            lightIcon.classList.add('active');
            darkIcon.classList.remove('active');
        } else {
            lightIcon.classList.remove('active');
            darkIcon.classList.add('active');
        }
    }

    // Navigation
    setupNavigation() {
        const hamburger = document.getElementById('hamburger');
        const mobileMenu = document.getElementById('mobileMenu');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

        // Mobile menu toggle
        hamburger.addEventListener('click', () => {
            const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            hamburger.setAttribute('aria-expanded', !isExpanded);
            mobileMenu.setAttribute('aria-hidden', isExpanded);
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close mobile menu when clicking links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            });
        });

        // Update active nav link on scroll
        this.setupActiveNavigation();

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -60% 0px',
            threshold: 0
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const currentId = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${currentId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            sectionObserver.observe(section);
        });
    }

    // Scroll Animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-on-scroll');
                    
                    // Add staggered animation for multiple items
                    if (entry.target.classList.contains('skill-card') || 
                        entry.target.classList.contains('project-card') ||
                        entry.target.classList.contains('timeline-item')) {
                        const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                        entry.target.style.transitionDelay = `${index * 0.1}s`;
                    }
                }
            });
        }, observerOptions);

        // Observe all elements that should animate on scroll
        document.querySelectorAll('.timeline-item, .skill-card, .project-card').forEach(el => {
            observer.observe(el);
        });

        // Navbar background on scroll
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                navbar.style.background = 'rgba(245, 248, 247, 0.95)';
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    navbar.style.background = 'rgba(19, 32, 27, 0.95)';
                }
                navbar.style.backdropFilter = 'blur(10px)';
            } else {
                navbar.style.background = 'var(--bg-primary)';
                navbar.style.backdropFilter = 'blur(0px)';
            }
        });
    }

    // Scroll Progress
    setupScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        
        const updateProgress = () => {
            const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            scrollProgress.style.width = `${Math.min(scrolled, 100)}%`;
        };

        // Throttle scroll events for performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial update
        updateProgress();
    }

    // Smooth Scrolling
    setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (target) {
                    const targetPosition = target.offsetTop - 80; // Account for fixed header
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, anchor.getAttribute('href'));
                }
            });
        });
    }

    // Form Handling
    setupForm() {
        const form = document.getElementById('contactForm');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    // Submit to FormSubmit.co
                    await this.submitToFormSubmit(form);
                    
                    // Show success message instead of redirecting
                    this.showToast('Message sent successfully! I\'ll get back to you within 24 hours.', 'success');
                    form.reset();
                    
                    // Track form submission in analytics
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submission', {
                            'event_category': 'Contact',
                            'event_label': 'Portfolio Contact Form'
                        });
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                    this.showToast('Failed to send message. Please try again or email me directly at dev@thokozane.co.za', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearError(input);
            });
        });

        // Add character counter for message textarea
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', () => {
                this.updateCharacterCount(messageTextarea);
            });
        }
    }

    validateForm() {
        const form = document.getElementById('contactForm');
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + 'Error');

        if (field.hasAttribute('required') && !value) {
            this.showError(field, `${field.labels[0].textContent} is required`);
            return false;
        }

        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }

        if (field.id === 'message' && value.length < 10) {
            this.showError(field, 'Please provide more details about your project (minimum 10 characters)');
            return false;
        }

        this.clearError(field);
        return true;
    }

    showError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        errorElement.textContent = message;
        field.style.borderColor = '#e74c3c';
        field.focus();
    }

    clearError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        errorElement.textContent = '';
        field.style.borderColor = '';
    }

    updateCharacterCount(textarea) {
        const maxLength = 1000;
        const currentLength = textarea.value.length;
        
        // Create or update character count display
        let counter = textarea.parentNode.querySelector('.char-counter');
        if (!counter) {
            counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.fontSize = '0.8rem';
            counter.style.color = 'var(--text-secondary)';
            counter.style.marginTop = '0.25rem';
            textarea.parentNode.appendChild(counter);
        }
        
        counter.textContent = `${currentLength}/${maxLength} characters`;
        
        if (currentLength > maxLength * 0.8) {
            counter.style.color = '#e74c3c';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    }

    async submitToFormSubmit(form) {
        const formData = new FormData(form);
        
        // Add additional hidden fields for FormSubmit.co
        formData.append('_subject', 'New Project Inquiry from Portfolio');
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('_replyto', formData.get('email'));
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Form submission failed');
        }

        return response;
    }

    // Resume Button Functionality with Popup Form
    setupResumeButton() {
        const resumeBtn = document.getElementById('resumeBtn');
        if (!resumeBtn) return;
        
        resumeBtn.addEventListener('click', () => {
            this.showResumeRequestForm();
        });
    }

    // Resume Request Popup Form
    showResumeRequestForm() {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'resume-request-modal';
        modalContent.style.cssText = `
            background: var(--bg-secondary);
            padding: 2.5rem;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            border: 1px solid var(--border);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modalContent.innerHTML = `
            <button class="modal-close-btn" aria-label="Close resume request form" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--text-secondary);
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            ">
                <i class="fas fa-times"></i>
            </button>
            
            <h2 style="margin-bottom: 1rem; color: var(--text-primary); text-align: center;">
                Request My Resume
            </h2>
            
            <p style="color: var(--text-secondary); text-align: center; margin-bottom: 2rem;">
                Please provide your details and I'll send my resume to your email.
            </p>
            
            <form id="resumeRequestForm" class="resume-request-form">
                <div class="form-group">
                    <label for="requesterName">Full Name *</label>
                    <input type="text" id="requesterName" name="name" class="form-control" required>
                    <span class="error-message" id="requesterNameError"></span>
                </div>
                
                <div class="form-group">
                    <label for="requesterEmail">Email Address *</label>
                    <input type="email" id="requesterEmail" name="email" class="form-control" required>
                    <span class="error-message" id="requesterEmailError"></span>
                </div>
                
                <div class="form-group">
                    <label for="companyName">Company Name</label>
                    <input type="text" id="companyName" name="company" class="form-control" placeholder="Optional">
                    <span class="error-message" id="companyNameError"></span>
                </div>
                
                <div class="form-group">
                    <label for="requestReason">Reason for Request *</label>
                    <select id="requestReason" name="reason" class="form-control" required>
                        <option value="">Select a reason</option>
                        <option value="job_opportunity">Job Opportunity</option>
                        <option value="freelance_project">Freelance Project</option>
                        <option value="collaboration">Collaboration</option>
                        <option value="recruitment">Recruitment</option>
                        <option value="networking">Networking</option>
                        <option value="other">Other</option>
                    </select>
                    <span class="error-message" id="requestReasonError"></span>
                </div>
                
                <div class="form-group" id="otherReasonGroup" style="display: none;">
                    <label for="otherReason">Please specify</label>
                    <input type="text" id="otherReason" name="other_reason" class="form-control" placeholder="Please specify your reason">
                    <span class="error-message" id="otherReasonError"></span>
                </div>
                
                <div class="form-group">
                    <label for="additionalNotes">Additional Notes</label>
                    <textarea id="additionalNotes" name="notes" class="form-control" placeholder="Any additional information you'd like to share..." rows="3"></textarea>
                    <span class="error-message" id="additionalNotesError"></span>
                </div>
                
                <div class="form-actions" style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button type="button" class="btn btn-secondary" id="cancelResumeRequest" style="flex: 1;">
                        Cancel
                    </button>
                    <button type="submit" class="btn btn-primary" style="flex: 1;">
                        <i class="fas fa-paper-plane"></i>
                        Send Request
                    </button>
                </div>
            </form>
        `;

        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        document.body.style.overflow = 'hidden';

        // Animate in
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);

        // Setup event listeners for the modal
        this.setupResumeModalEvents(modalOverlay, modalContent);
    }

    setupResumeModalEvents(modalOverlay, modalContent) {
        // Close button
        const closeBtn = modalContent.querySelector('.modal-close-btn');
        const cancelBtn = modalContent.querySelector('#cancelResumeRequest');
        const form = modalContent.querySelector('#resumeRequestForm');
        const reasonSelect = modalContent.querySelector('#requestReason');
        const otherReasonGroup = modalContent.querySelector('#otherReasonGroup');

        // Close modal function
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.9)';
            setTimeout(() => {
                if (modalOverlay.parentNode) {
                    modalOverlay.parentNode.removeChild(modalOverlay);
                }
                document.body.style.overflow = '';
            }, 300);
        };

        // Close events
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && document.body.contains(modalOverlay)) {
                closeModal();
            }
        });

        // Show/hide other reason field
        reasonSelect.addEventListener('change', () => {
            if (reasonSelect.value === 'other') {
                otherReasonGroup.style.display = 'block';
            } else {
                otherReasonGroup.style.display = 'none';
            }
        });

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (this.validateResumeRequestForm(form)) {
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                try {
                    await this.submitResumeRequest(form);
                    closeModal();
                    this.showToast('Resume request sent successfully! I\'ll email my resume to you shortly.', 'success');
                } catch (error) {
                    console.error('Resume request error:', error);
                    this.showToast('Failed to send resume request. Please try again or email me directly.', 'error');
                } finally {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateResumeField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearResumeError(input);
            });
        });
    }

    validateResumeRequestForm(form) {
        const inputs = form.querySelectorAll('input[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateResumeField(input)) {
                isValid = false;
            }
        });

        // Validate email format
        const emailInput = form.querySelector('#requesterEmail');
        if (emailInput.value && !this.isValidEmail(emailInput.value)) {
            this.showResumeError(emailInput, 'Please enter a valid email address');
            isValid = false;
        }

        return isValid;
    }

    validateResumeField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + 'Error');

        if (field.hasAttribute('required') && !value) {
            this.showResumeError(field, 'This field is required');
            return false;
        }

        this.clearResumeError(field);
        return true;
    }

    showResumeError(field, message) {
        const errorElement = document.getElementById(field.id + 'Error');
        errorElement.textContent = message;
        field.style.borderColor = '#e74c3c';
    }

    clearResumeError(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        errorElement.textContent = '';
        field.style.borderColor = '';
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async submitResumeRequest(form) {
        const formData = new FormData(form);
        
        // Add additional fields for FormSubmit.co
        formData.append('_subject', 'Resume Request from Portfolio');
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');
        formData.append('_replyto', formData.get('email'));
        
        // Send to FormSubmit.co (you can use the same email or a different one)
        const response = await fetch('https://formsubmit.co/dev@thokozane.co.za', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Resume request submission failed');
        }

        // Track in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'resume_request', {
                'event_category': 'Engagement',
                'event_label': 'Resume Request Form'
            });
        }

        return response;
    }

    // Location and Time
    setupLocationTime() {
        const currentTimeElement = document.getElementById('currentTime');
        
        const updateTime = () => {
            const now = new Date();
            const options = {
                timeZone: 'Africa/Johannesburg',
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            const timeString = now.toLocaleTimeString('en-ZA', options);
            
            if (currentTimeElement) {
                currentTimeElement.textContent = timeString;
                currentTimeElement.setAttribute('aria-label', `Current time in South Africa: ${timeString}`);
            }
        };

        updateTime();
        setInterval(updateTime, 1000);
    }

    // Typing Animation
    setupTypingAnimation() {
        const typingText = document.getElementById('typingText');
        if (!typingText) return;

        const texts = [
            'Fullstack Web Developer',
            'UI/UX Enthusiast',
            'Problem Solver',
            'Tech Innovator'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingDelay = 100;
        let erasingDelay = 50;
        let newTextDelay = 2000;

        const type = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typingDelay = erasingDelay;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typingDelay = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                typingDelay = newTextDelay;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typingDelay = 500;
            }

            setTimeout(type, typingDelay);
        };

        // Start typing animation after a short delay
        setTimeout(type, 1000);
    }

    // Floating Particles
    setupParticles() {
        const particlesContainer = document.getElementById('floatingParticles');
        if (!particlesContainer) return;

        const particleCount = 15;
        const currentTheme = document.documentElement.getAttribute('data-theme');

        for (let i = 0; i < particleCount; i++) {
            this.createParticle(particlesContainer, i, currentTheme);
        }
    }

    createParticle(container, index, theme) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 60 + 20;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 5;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        // Set particle color based on theme
        if (theme === 'dark') {
            particle.style.background = 'var(--color-acapulco-400)';
        } else {
            particle.style.background = 'var(--color-acapulco-500)';
        }
        
        container.appendChild(particle);
    }

    updateParticlesForTheme(theme) {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            if (theme === 'dark') {
                particle.style.background = 'var(--color-acapulco-400)';
            } else {
                particle.style.background = 'var(--color-acapulco-500)';
            }
        });
    }

    // Auto-updating Copyright
    setupCopyright() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Toast System
    setupToastSystem() {
        this.toastContainer = document.getElementById('toastContainer');
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.id = 'toastContainer';
            this.toastContainer.className = 'toast-container';
            this.toastContainer.setAttribute('aria-live', 'polite');
            this.toastContainer.setAttribute('aria-atomic', 'true');
            document.body.appendChild(this.toastContainer);
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;

        this.toastContainer.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);

        // Remove toast after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 5000);

        // Accessibility: Announce toast to screen readers
        this.announceToScreenReader(message, type);
    }

    announceToScreenReader(message, type) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = `${type} notification: ${message}`;
        
        document.body.appendChild(announcement);
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Additional Animations
    setupAnimations() {
        // Add floating animation to elements with delays
        const floatingElements = document.querySelectorAll('.animate-float');
        floatingElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2}s`;
        });

        // Add hover effects to interactive elements
        this.setupHoverEffects();
    }

    setupHoverEffects() {
        // Add subtle hover effects to cards
        const cards = document.querySelectorAll('.skill-card, .project-card, .timeline-content');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
            });
        });
    }

    // Performance Optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        this.lazyLoadImages();
        
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Setup service worker if available
        this.setupServiceWorker();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    preloadCriticalResources() {
        // Preload critical images
        const criticalImages = [
            // Add paths to critical images here
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = src;
            link.as = 'image';
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    // Error Handling
    setupErrorHandling() {
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
            this.showToast('Something went wrong. Please refresh the page.', 'error');
        });

        window.addEventListener('unhandledrejection', (e) => {
            console.error('Unhandled promise rejection:', e.reason);
            this.showToast('Something went wrong. Please try again.', 'error');
        });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        // Disable animations for users who prefer reduced motion
        document.documentElement.style.setProperty('--transition', 'none');
        document.querySelectorAll('*').forEach(el => {
            el.style.animation = 'none';
        });
    }

    try {
        const app = new PortfolioApp();
        window.portfolioApp = app; // Make available globally for debugging
        
        // Track page view in analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                'page_title': document.title,
                'page_location': window.location.href
            });
        }
    } catch (error) {
        console.error('Failed to initialize portfolio app:', error);
    }
});

// Export for module usage if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioApp;
}

// Add utility functions
const PortfolioUtils = {
    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for performance
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format phone number
    formatPhoneNumber: (phone) => {
        return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }
};

// Make utils available globally
window.PortfolioUtils = PortfolioUtils;