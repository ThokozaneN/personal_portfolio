// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Enhanced Preloader Animation
const preloader = document.getElementById('preloader');
const preloaderText = document.querySelectorAll('.preloader-text span');
const loadingBar = document.querySelector('.loading-bar');

// Animate preloader text with enhanced stagger
const textTimeline = gsap.timeline();

// Initial text animation with bounce effect
preloaderText.forEach((span, i) => {
    textTimeline.fromTo(span,
        { 
            opacity: 0, 
            y: 30,
            scale: 0.8,
            filter: "blur(10px)"
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "back.out(1.7)",
            delay: i * 0.08
        },
        i * 0.08
    );
});

// Loading bar animation
let currentPercentage = 0;
const targetPercentage = 100;
const totalDuration = 5000; // 5 seconds total
const updateInterval = 30; // Update every 30ms

function updateLoadingBar() {
    const increment = (targetPercentage / totalDuration) * updateInterval;
    const easing = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const progress = currentPercentage / targetPercentage;
    const easedProgress = easing(progress);
    
    currentPercentage = Math.min(currentPercentage + increment, targetPercentage);
    const displayPercentage = Math.floor(easedProgress * targetPercentage);
    
    loadingBar.style.width = `${displayPercentage}%`;
    
    if (currentPercentage < targetPercentage) {
        setTimeout(updateLoadingBar, updateInterval);
    } else {
        // Complete loading sequence
        completePreloader();
    }
}

function completePreloader() {
    // Final animations before hiding preloader
    gsap.to(preloaderText, {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: 0.6,
        stagger: 0.05,
        ease: "power3.in"
    });
    
    gsap.to(['.loading-bar', '.loading-bar-container'], {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power2.in",
        onComplete: () => {
            // Hide preloader
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.7,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                    initHeroAnimations();
                    initParallaxEffects(); // Initialize parallax effects
                }
            });
        }
    });
}

// Start loading animation after initial text animation
setTimeout(updateLoadingBar, 1000);

// Mobile Menu Functionality
function initMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');
    
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        mobileNav.classList.toggle('active');
        
        if (mobileNav.classList.contains('active')) {
            // Animate mobile nav links in
            gsap.to(mobileNav, {
                opacity: 1,
                duration: 0.3
            });
            
            mobileNavLinks.forEach((link, i) => {
                gsap.to(link, {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: i * 0.1,
                    ease: "back.out(1.7)"
                });
            });
        } else {
            // Animate mobile nav links out
            mobileNavLinks.forEach((link, i) => {
                gsap.to(link, {
                    x: 80,
                    opacity: 0,
                    duration: 0.4,
                    delay: i * 0.05,
                    ease: "power3.in"
                });
            });
            
            gsap.to(mobileNav, {
                opacity: 0,
                duration: 0.3,
                delay: 0.3
            });
        }
    });
    
    // Close menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            
            mobileNavLinks.forEach((link, i) => {
                gsap.to(link, {
                    x: 80,
                    opacity: 0,
                    duration: 0.3,
                    delay: i * 0.05,
                    ease: "power3.in"
                });
            });
            
            gsap.to(mobileNav, {
                opacity: 0,
                duration: 0.3,
                delay: 0.3,
                onComplete: () => {
                    mobileNav.classList.remove('active');
                }
            });
        });
    });
}

// PARALLAX EFFECTS
function initParallaxEffects() {
    // Hero to About Section Transition Parallax
    const heroSection = document.getElementById('hero');
    const aboutSection = document.getElementById('about');
    
    if (!heroSection || !aboutSection) return;
    
    // Get elements for parallax
    const profileImage = document.querySelector('.profile-image');
    const heroTextFront = document.querySelector('.hero-text-front');
    const heroTextBehind = document.querySelector('.hero-text-behind');
    const locationInfo = document.querySelector('.location-info');
    const heroContent = document.querySelector('.hero-content');
    
    // Calculate the distance between hero and about sections
    const heroHeight = heroSection.offsetHeight;
    const aboutOffset = aboutSection.offsetTop;
    const transitionDistance = aboutOffset - heroHeight;
    
    // Create a master timeline for hero-to-about parallax
    const parallaxTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: `+=${transitionDistance}`,
            scrub: 1.2,
            pin: false,
            anticipatePin: 1,
            markers: false, // Set to true for debugging
            onUpdate: (self) => {
                const progress = self.progress;
                
                // Apply parallax effects based on scroll progress
                applyHeroToAboutParallax(progress);
            }
        }
    });
    
    // Function to apply parallax effects during hero-to-about transition
    function applyHeroToAboutParallax(progress) {
        // Profile image parallax - moves up and scales
        if (profileImage) {
            const imageY = -progress * 100; // Move up
            const imageScale = 1 + (progress * 0.3); // Scale up slightly
            const imageOpacity = 1 - (progress * 0.7); // Fade out
            
            gsap.to(profileImage, {
                y: imageY,
                scale: imageScale,
                opacity: imageOpacity,
                duration: 0.1,
                ease: "none"
            });
        }
        
        // "DEVELOPMENT" text parallax - moves left and fades
        if (heroTextFront) {
            const frontX = -progress * 300; // Move left
            const frontOpacity = 0.15 - (progress * 0.15); // Fade out
            const frontScale = 1 + (progress * 0.4); // Scale up
            
            gsap.to(heroTextFront, {
                x: frontX,
                opacity: Math.max(0, frontOpacity),
                scale: frontScale,
                duration: 0.1,
                ease: "none"
            });
        }
        
        // "MARKETING" text parallax - moves right and fades
        if (heroTextBehind) {
            const behindX = progress * 200; // Move right
            const behindOpacity = 0.1 - (progress * 0.1); // Fade out
            const behindScale = 1 + (progress * 0.2); // Scale up
            
            gsap.to(heroTextBehind, {
                x: behindX,
                opacity: Math.max(0, behindOpacity),
                scale: behindScale,
                duration: 0.1,
                ease: "none"
            });
        }
        
        // Location info parallax - moves up and fades
        if (locationInfo) {
            const locationY = -progress * 150; // Move up
            const locationOpacity = 1 - (progress * 1.2); // Fade out faster
            
            gsap.to(locationInfo, {
                y: locationY,
                opacity: Math.max(0, locationOpacity),
                duration: 0.1,
                ease: "none"
            });
        }
        
        // Hero content parallax - fades out
        if (heroContent) {
            const contentOpacity = 1 - (progress * 1.5); // Fade out quickly
            
            gsap.to(heroContent, {
                opacity: Math.max(0, contentOpacity),
                duration: 0.1,
                ease: "none"
            });
        }
        
        // Apply blur effect to hero section as we transition
        const heroBlur = progress * 10; // Increase blur as we scroll
        heroSection.style.backdropFilter = `blur(${heroBlur}px)`;
        heroSection.style.webkitBackdropFilter = `blur(${heroBlur}px)`;
    }
    
    // About Section Entry Parallax
    const aboutBgElements = document.querySelector('.about-bg-elements');
    const aboutTitle = document.querySelector('.about-title');
    const aboutCards = document.querySelectorAll('.horizontal-card');
    
    if (aboutSection && aboutBgElements) {
        // About background elements parallax - subtle movement
        gsap.to(aboutBgElements, {
            y: -100,
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5,
                ease: "none"
            }
        });
        
        // About title parallax - scale and fade in
        if (aboutTitle) {
            gsap.fromTo(aboutTitle,
                {
                    scale: 0.8,
                    opacity: 0,
                    y: 100
                },
                {
                    scale: 1,
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: 1,
                        ease: "power2.out"
                    }
                }
            );
        }
        
        // About cards staggered parallax
        aboutCards.forEach((card, index) => {
            gsap.fromTo(card,
                {
                    y: 100 + (index * 20),
                    opacity: 0,
                    rotateX: 10,
                    rotateY: index % 2 === 0 ? -5 : 5
                },
                {
                    y: 0,
                    opacity: 1,
                    rotateX: 0,
                    rotateY: 0,
                    scrollTrigger: {
                        trigger: aboutSection,
                        start: 'top 70%',
                        end: 'top 20%',
                        scrub: 1,
                        delay: index * 0.1,
                        ease: "power2.out"
                    }
                }
            );
        });
    }
    
    // Additional parallax for about section background circles
    const bgCircle1 = document.querySelector('.circle-1');
    const bgCircle2 = document.querySelector('.circle-2');
    
    if (bgCircle1 && bgCircle2) {
        // Circle 1 - moves slower (depth effect)
        gsap.to(bgCircle1, {
            y: -50,
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.3,
                ease: "none"
            }
        });
        
        // Circle 2 - moves faster (closer to viewer)
        gsap.to(bgCircle2, {
            y: -100,
            scrollTrigger: {
                trigger: aboutSection,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.7,
                ease: "none"
            }
        });
    }
}

function initHeroAnimations() {
    // Check if mobile view
    const isMobile = window.innerWidth <= 1024;
    
    // Animate header elements
    gsap.to('.header', {
        opacity: 1,
        duration: 1,
        ease: "power3.out"
    });
    
    // Logo animation with bounce
    gsap.to('.logo', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        delay: 0.3
    });
    
    // Desktop navigation animation
    if (!isMobile) {
        const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
        gsap.to(navLinks, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            delay: 0.5,
            ease: "power3.out"
        });
    } else {
        // Hamburger menu animation for mobile
        gsap.to('.hamburger-menu', {
            opacity: 1,
            duration: 0.8,
            delay: 0.5,
            ease: "power3.out"
        });
    }
    
    // Profile image animation
    const profileImageContainer = document.querySelector('.profile-image-container');
    gsap.to(profileImageContainer, {
        opacity: 1,
        x: 0,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.4
    });
    
    // Background text animations
    const textFront = document.querySelector('.hero-text-front');
    const textBehind = document.querySelector('.hero-text-behind');
    
    // DEVELOPMENT text animation - IN FRONT
    gsap.fromTo(textFront,
        { 
            opacity: 0, 
            scale: 0.8,
            x: 100,
            y: 30 
        },
        {
            opacity: isMobile ? 0.25 : 0.15,
            scale: 1,
            x: 0,
            y: 0,
            duration: 2,
            ease: "power4.out",
            delay: 0.6
        }
    );
    
    // MARKETING text animation - BEHIND
    gsap.fromTo(textBehind,
        { 
            opacity: 0, 
            scale: 0.7,
            x: -100,
            y: -30 
        },
        {
            opacity: isMobile ? 0.2 : 0.1,
            scale: 1,
            x: 0,
            y: 0,
            duration: 2.2,
            ease: "power4.out",
            delay: 0.8
        }
    );
    
    // Hero content animation
    gsap.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.9,
        ease: "power3.out"
    });
    
    // Location info animation
    gsap.fromTo('.location-info',
        { 
            opacity: 0, 
            x: -40,
            y: 20,
            rotate: -5 
        },
        {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            duration: 1.2,
            delay: 1,
            ease: "back.out(1.7)"
        }
    );
    
    // Hero title animation
    const titleLines = document.querySelectorAll('.title-text');
    titleLines.forEach((line, i) => {
        gsap.to(line, {
            y: 0,
            duration: 1.2,
            delay: 1 + (i * 0.3),
            ease: "power4.out"
        });
    });
    
    // Initialize mobile menu
    initMobileMenu();
    
    // Enhanced Scroll Animations
    // DEVELOPMENT text scroll effect - moves left on scroll
    gsap.to(textFront, {
        x: -200,
        scale: 1.2,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
            ease: "none"
        }
    });
    
    // MARKETING text scroll effect - moves right on scroll
    gsap.to(textBehind, {
        x: 150,
        scale: 0.9,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
            ease: "none"
        }
    });
    
    // Profile image scroll effect
    gsap.to('.profile-image', {
        scale: 1.2,
        y: 50,
        filter: "grayscale(30%) contrast(110%)",
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            ease: "none"
        }
    });
    
    // Mouse movement parallax for desktop
    if (!isMobile) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 40;
            const y = (e.clientY / window.innerHeight - 0.5) * 40;
            
            // DEVELOPMENT text moves with mouse
            gsap.to(textFront, {
                x: x * 0.5,
                y: y * 0.5,
                duration: 1.5,
                ease: "power2.out"
            });
            
            // MARKETING text moves opposite direction
            gsap.to(textBehind, {
                x: -x * 0.3,
                y: -y * 0.3,
                duration: 1.8,
                ease: "power2.out"
            });
            
            // Image moves subtly
            gsap.to('.profile-image', {
                x: x * 0.1,
                y: y * 0.1,
                duration: 1.2,
                ease: "power2.out"
            });
        });
    }
    
    // Header scroll effect
    const header = document.getElementById('header');
    ScrollTrigger.create({
        start: 50,
        onUpdate: (self) => {
            if (self.progress > 0) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Hero title scroll effect
    gsap.to('.hero-title', {
        y: -30,
        opacity: 0.9,
        scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
}

// Function to update live time
function updateLiveTime() {
    const now = new Date();
    const options = { 
        timeZone: 'Africa/Johannesburg',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    const johannesburgTime = now.toLocaleTimeString('en-US', options);
    
    const liveTimeElement = document.getElementById('liveTime');
    if (liveTimeElement) {
        liveTimeElement.textContent = `${johannesburgTime}`;
    }
}

// Update time initially and every second
updateLiveTime();
setInterval(updateLiveTime, 1000);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
        // Reinitialize parallax effects on resize
        if (typeof initParallaxEffects === 'function') {
            // Kill existing ScrollTriggers first
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            initParallaxEffects();
        }
    }, 250);
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// About Section Animations
function initAboutSection() {
    // Select elements
    const aboutSection = document.querySelector('.about-section');
    const titleTexts = document.querySelectorAll('.title-text');
    const subtitleItems = document.querySelectorAll('.subtitle-item');
    const subtitleDividers = document.querySelectorAll('.subtitle-divider');
    const cards = document.querySelectorAll('.horizontal-card');
    const counters = document.querySelectorAll('.counter-number');
    
    // Create observer for section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate title
                gsap.to(titleTexts, {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.4,
                    ease: "power4.out",
                    delay: 0.2
                });
                
                // Animate subtitle items
                gsap.to(subtitleItems, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.3,
                    delay: 0.8,
                    ease: "back.out(1.7)"
                });
                
                // Animate subtitle dividers
                gsap.to(subtitleDividers, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.2,
                    delay: 1.2,
                    ease: "back.out(1.7)"
                });
                
                // Animate cards with staggered delay - Updated for 2x2 grid
                cards.forEach((card, index) => {
                    gsap.to(card, {
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        delay: 1.5 + (index * 0.1), // Reduced delay for grid layout
                        ease: "power3.out"
                    });
                });
                
                // Animate counters
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2;
                    
                    gsap.to(counter, {
                        innerText: target,
                        duration: duration,
                        snap: { innerText: 1 },
                        ease: "power2.out",
                        delay: 2
                    });
                });
                
                // Unobserve after animation
                observer.unobserve(aboutSection);
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    // Start observing
    if (aboutSection) {
        observer.observe(aboutSection);
    }
    
    // Card hover effects with parallax - Updated for grid layout
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 3;
            const rotateX = ((centerY - y) / centerY) * 3;
            
            gsap.to(card.querySelector('.card-content'), {
                rotateY: rotateY,
                rotateX: -rotateX,
                transformPerspective: 1000,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card.querySelector('.card-content'), {
                rotateY: 0,
                rotateX: 0,
                duration: 0.6,
                ease: "power3.out"
            });
        });
    });
    
    // Interactive card scaling on click/tap
    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Add a subtle scale effect on click
            gsap.to(card.querySelector('.card-content'), {
                scale: 0.98,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            });
        });
    });
    
    // Add keyboard navigation for cards
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && document.activeElement.classList.contains('horizontal-card')) {
            gsap.to(document.activeElement.querySelector('.card-content'), {
                scale: 1.02,
                duration: 0.2,
                ease: "power2.out"
            });
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Tab' && document.activeElement.classList.contains('horizontal-card')) {
            gsap.to(document.activeElement.querySelector('.card-content'), {
                scale: 1,
                duration: 0.2,
                ease: "power2.out"
            });
        }
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth <= 768;
    
    // Initialize about section
    initAboutSection();
    
    // Add touch support for mobile devices
    if (isMobile) {
        const cards = document.querySelectorAll('.horizontal-card');
        cards.forEach(card => {
            card.addEventListener('touchstart', () => {
                gsap.to(card.querySelector('.card-content'), {
                    scale: 0.98,
                    duration: 0.1,
                    ease: "power2.out"
                });
            });
            
            card.addEventListener('touchend', () => {
                gsap.to(card.querySelector('.card-content'), {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
    }
    
    // Performance optimization for animations
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            // Initialize any non-critical animations here
            console.log('Portfolio animations initialized');
        });
    } else {
        setTimeout(() => {
            console.log('Portfolio animations initialized');
        }, 1000);
    }
});

// Error handling for GSAP
if (typeof gsap === 'undefined') {
    console.error('GSAP library not loaded. Please check CDN links.');
    
    // Fallback animations using CSS
    document.addEventListener('DOMContentLoaded', function() {
        // Simple fallback for preloader
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) {
                preloader.style.transition = 'opacity 0.7s ease';
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 700);
            }
        }, 3000);
        
        // Simple fallback for about section animations
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const cards = entry.target.querySelectorAll('.horizontal-card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, index * 200);
                    });
                    
                    // Animate counters
                    const counters = entry.target.querySelectorAll('.counter-number');
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        let current = 0;
                        const increment = target / 50;
                        
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                setTimeout(updateCounter, 30);
                            } else {
                                counter.textContent = target;
                            }
                        };
                        
                        setTimeout(updateCounter, 1000);
                    });
                }
            });
        }, observerOptions);
        
        const aboutSection = document.querySelector('.about-section');
        if (aboutSection) {
            aboutObserver.observe(aboutSection);
        }
    });
}
