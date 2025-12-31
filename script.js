/**
 * Thokozane Nxumalo - Portfolio
 * Freelance Web Developer
 * dev@thokozane.co.za
 */

// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start with preloader
    initPreloader();
    
    // Listen for preloader completion to initialize everything
    document.addEventListener('preloaderComplete', initPortfolio);
});

// ============================================
// PRELOADER FUNCTIONS
// ============================================

function initPreloader() {
    // Elements
    const preloader = document.getElementById('preloader');
    const preloaderText = document.getElementById('preloader-text');
    const loadingBar = document.getElementById('loading-bar');
    const mainContent = document.getElementById('main-content');
    
    // Get screen width for responsive adjustments
    const screenWidth = window.innerWidth;
    let animationDuration = 2; // Default duration
    
    // Adjust animation based on screen size
    if (screenWidth < 768) {
        // Mobile - faster animation
        animationDuration = 1.5;
    } else if (screenWidth >= 1920) {
        // Large screens - slightly slower
        animationDuration = 2.5;
    }
    
    // Add preloader active class to body
    document.body.classList.add('preloader-active');
    
    // Preloader Animation Timeline
    const preloaderTL = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => completePreloader(preloader, mainContent, screenWidth)
    });
    
    // Text animation
    preloaderTL.to(preloaderText, {
        duration: 1,
        y: 0,
        opacity: 1,
        ease: "power2.out"
    });
    
    // Loading bar animation with responsive duration
    preloaderTL.to(loadingBar, {
        duration: animationDuration,
        width: "100%",
        ease: "power1.inOut"
    }, "-=0.5");
    
    // Shining effect animation
    // Wait for loading bar to start moving
    gsap.delayedCall(0.8, () => {
        // Create continuous shining animation
        const shineAnimation = gsap.to('.loading-bar::after', {
            duration: 1.2,
            x: "400%", // Move shine across
            ease: "power1.inOut",
            repeat: -1, // Infinite loop
            repeatDelay: 0.3
        });
        
        // Store reference for cleanup
        window.shineAnimation = shineAnimation;
    });
    
    // Handle responsive adjustments on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Re-calculate if needed for responsive adjustments
            if (preloader.style.display !== 'none') {
                // Update animation if still visible
                const currentWidth = loadingBar.style.width || '0%';
                const currentPercent = parseFloat(currentWidth) / 100;
                const remainingTime = animationDuration * (1 - currentPercent);
                
                // Update loading bar animation
                gsap.to(loadingBar, {
                    duration: remainingTime,
                    width: "100%",
                    ease: "power1.inOut"
                });
            }
        }, 100);
    });
    
    // Error fallback
    window.addEventListener('error', () => {
        setTimeout(() => {
            preloader.style.display = 'none';
            mainContent.style.display = 'block';
            document.body.classList.remove('preloader-active');
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
        }, 3000);
    });
    
    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page loaded in ${loadTime}ms on ${screenWidth}px screen`);
        });
    }
}

function completePreloader(preloader, mainContent, screenWidth) {
    // Kill the shine animation
    if (window.shineAnimation) {
        window.shineAnimation.kill();
    }
    
    // Speed up shine for final effect
    gsap.to('.loading-bar::after', {
        duration: 0.3,
        x: "400%",
        ease: "power2.out",
        onComplete: () => {
            // Remove shine element visibility
            const loadingBar = document.querySelector('.loading-bar');
            if (loadingBar) {
                loadingBar.style.overflow = 'visible';
            }
        }
    });
    
    // Fade out preloader
    gsap.to(preloader, {
        duration: screenWidth < 768 ? 0.6 : 0.8,
        opacity: 0,
        ease: "power2.inOut",
        onComplete: () => {
            preloader.style.display = 'none';
            mainContent.style.display = 'block';
            document.body.classList.remove('preloader-active');
            document.body.classList.add('preloader-complete');
            
            // Dispatch custom event for main content to initialize
            document.dispatchEvent(new CustomEvent('preloaderComplete'));
        }
    });
}

// ============================================
// PORTFOLIO INITIALIZATION
// ============================================

function initPortfolio() {
    // Initialize all components
    initNavbar();
    initHero();
    
    // Initialize additional features
    initSmoothScrolling();
    initScrollToTop();
    initPageTransitions();
    
    // Performance optimizations
    initPerformanceMonitoring();
}

// ============================================
// NAVBAR FUNCTIONS
// ============================================

function initNavbar() {
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const navLogo = document.querySelector('.nav-logo');
    const allNavLinks = document.querySelectorAll('.nav-link');
    const mobileMenuBtnElement = document.querySelector('.mobile-menu-btn');
    
    // Fix logo click issue - prevent default behavior if href is just "#"
    if (navLogo && navLogo.getAttribute('href') === '#') {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            // Just scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Navbar scroll effect
    function handleScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    // Initialize mobile menu animations
    initMobileMenuAnimations();
    
    // Navbar entrance animation
    const navTL = gsap.timeline({
        defaults: { ease: "power3.out" }
    });
    
    navTL.to(navLogo, {
        duration: 0.8,
        y: 0,
        opacity: 1,
        ease: "power2.out"
    })
    .to(allNavLinks, {
        duration: 0.6,
        y: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power2.out"
    }, "-=0.4")
    .to(mobileMenuBtnElement, {
        duration: 0.6,
        y: 0,
        opacity: 1,
        ease: "power2.out"
    }, "-=0.3");
    
    // Add animation complete class
    navTL.eventCallback("onComplete", () => {
        navLogo.classList.add('animate-complete');
        allNavLinks.forEach(link => link.classList.add('animate-complete'));
        mobileMenuBtnElement.classList.add('animate-complete');
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Close mobile menu on resize to desktop
            if (window.innerWidth > 767) {
                closeMobileMenu();
                
                // Reset link positions for desktop
                allNavLinks.forEach(link => {
                    gsap.set(link, {
                        x: 0,
                        y: 0,
                        opacity: 1
                    });
                });
            }
        }, 250);
    });
    
    // Initial scroll check
    handleScroll();
}

// ============================================
// MOBILE MENU ANIMATIONS (RIGHT SIDE SLIDE)
// ============================================

function initMobileMenuAnimations() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    const allNavLinks = document.querySelectorAll('.nav-link');
    
    if (!mobileMenuBtn || !navLinks) return;
    
    // Initialize link positions for animation (start from right)
    allNavLinks.forEach(link => {
        gsap.set(link, {
            x: 40, // Start further to the right for more dramatic entrance
            opacity: 0,
            scale: 0.95
        });
    });
    
    mobileMenuBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpening = !navLinks.classList.contains('active');
        
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        
        // Add overlay to close menu when clicking outside
        if (isOpening) {
            const overlay = document.createElement('div');
            overlay.className = 'menu-close-overlay';
            overlay.addEventListener('click', closeMobileMenu);
            document.body.appendChild(overlay);
            
            // Animate overlay in
            gsap.to(overlay, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            });
            
            // Animate links when opening (slide in from right with bounce)
            allNavLinks.forEach((link, index) => {
                gsap.to(link, {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.6,
                    delay: 0.05 + (index * 0.08), // Slightly faster stagger
                    ease: "back.out(1.2)", // Bounce effect
                    onComplete: () => {
                        // Add hover effect class
                        link.classList.add('menu-ready');
                    }
                });
            });
        } else {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        navLinks.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove overlay if it exists
        const overlay = document.querySelector('.menu-close-overlay');
        if (overlay) {
            gsap.to(overlay, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.out",
                onComplete: () => {
                    overlay.remove();
                }
            });
        }
        
        // Animate links when closing (slide out to right with ease)
        allNavLinks.forEach((link, index) => {
            gsap.to(link, {
                x: 40,
                opacity: 0,
                scale: 0.95,
                duration: 0.4,
                delay: (allNavLinks.length - index - 1) * 0.04, // Reverse stagger
                ease: "power2.in",
                onComplete: () => {
                    link.classList.remove('menu-ready');
                }
            });
        });
    }
    
    // Close menu when clicking a link
    allNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Add click animation
            gsap.to(link, {
                scale: 0.95,
                duration: 0.1,
                yoyo: true,
                repeat: 1,
                onComplete: () => {
                    closeMobileMenu();
                    
                    // Get the href and scroll to the section if it's an internal link
                    const href = link.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            setTimeout(() => {
                                window.scrollTo({
                                    top: targetElement.offsetTop - 80,
                                    behavior: 'smooth'
                                });
                            }, 400); // Wait for menu to close
                        }
                    }
                }
            });
        });
        
        // Add hover effects
        link.addEventListener('mouseenter', () => {
            if (link.classList.contains('menu-ready')) {
                gsap.to(link, {
                    scale: 1.02,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (link.classList.contains('menu-ready')) {
                gsap.to(link, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            }
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMobileMenu();
        }
    });
}

// ============================================
// HERO SECTION FUNCTIONS
// ============================================

function initHero() {
    // Elements
    const hero = document.getElementById('hero');
    const heroImage = document.getElementById('hero-image');
    const heroTextIdeate = document.getElementById('hero-text-ideate');
    const heroTextDevelop = document.getElementById('hero-text-develop');
    const developerInfo = document.querySelector('.developer-info');
    const locationTime = document.getElementById('location-time');
    const socialMedia = document.getElementById('social-media');
    
    // Initialize real-time location & time
    initLocationTime();
    
    // Hero Entrance Animation Timeline
    const heroTL = gsap.timeline({
        defaults: { ease: "power3.out" }
    });
    
    // Staggered entrance animation
    heroTL.fromTo(heroImage,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 }
    )
    .fromTo(heroTextIdeate,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.8"
    )
    .fromTo(heroTextDevelop,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.6"
    )
    .fromTo(developerInfo,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
    )
    .fromTo(locationTime,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.3"
    )
    .fromTo(socialMedia,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.3"
    );
    
    // Setup ScrollTrigger animations
    setupScrollAnimations(hero, heroImage, heroTextIdeate, heroTextDevelop);
    
    // Initialize social media hover effects
    initSocialHover();
    
    // Auto-update time every minute
    setInterval(updateTime, 60000);
    
    // Handle responsive adjustments for hero
    handleHeroResponsive();
}

function initLocationTime() {
    const timeElement = document.getElementById('time-text');
    const locationElement = document.getElementById('location-text');
    
    // Update time immediately
    updateTime();
    
    // Get user's location (using Johannesburg as default for South Africa)
    const userLocation = "Johannesburg, SA";
    locationElement.textContent = userLocation;
    
    // Add timezone information
    const timezone = "SAST";
    timeElement.dataset.timezone = timezone;
}

function updateTime() {
    const timeElement = document.getElementById('time-text');
    if (!timeElement) return;
    
    const now = new Date();
    
    // Format time for South Africa (24-hour format)
    const options = {
        timeZone: 'Africa/Johannesburg',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
    };
    
    try {
        const timeString = now.toLocaleTimeString('en-ZA', options);
        const dateString = now.toLocaleDateString('en-ZA', {
            timeZone: 'Africa/Johannesburg',
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        });
        
        timeElement.textContent = `${timeString} • ${dateString}`;
    } catch (error) {
        // Fallback if timezone not supported
        const timeString = now.toLocaleTimeString('en-ZA', { hour12: false, hour: '2-digit', minute: '2-digit' });
        const dateString = now.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
        timeElement.textContent = `${timeString} • ${dateString}`;
    }
}

function setupScrollAnimations(hero, heroImage, heroTextIdeate, heroTextDevelop) {
    // Clean up existing ScrollTriggers
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Check if elements exist
    if (!hero || !heroImage || !heroTextIdeate || !heroTextDevelop) {
        console.warn('Hero elements not found for scroll animations');
        return;
    }
    
    // Parallax effect on image
    gsap.to(heroImage, {
        y: "20%",
        ease: "none",
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
    
    // Text parallax (different speeds for depth)
    gsap.to(heroTextIdeate, {
        y: "15%",
        ease: "none",
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
    
    gsap.to(heroTextDevelop, {
        y: "10%",
        ease: "none",
        scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
    
    // Fade out elements on scroll
    const elementsToFade = [
        heroTextIdeate, 
        heroTextDevelop, 
        '.developer-info', 
        '.location-time', 
        '.social-media'
    ];
    
    elementsToFade.forEach(element => {
        const el = typeof element === 'string' ? document.querySelector(element) : element;
        if (el) {
            gsap.to(el, {
                opacity: 0,
                y: -30,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: hero,
                    start: "center center",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true
                }
            });
        }
    });
    
    // Scale down image on scroll
    gsap.to(heroImage, {
        scale: 0.95,
        opacity: 0.8,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: hero,
            start: "center center",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
        }
    });
}

function initSocialHover() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        // Remove existing event listeners
        link.removeEventListener('mouseenter', handleSocialHover);
        link.removeEventListener('mouseleave', handleSocialLeave);
        link.removeEventListener('touchstart', handleSocialTouch);
        link.removeEventListener('touchend', handleSocialTouchEnd);
        
        // Add new event listeners
        link.addEventListener('mouseenter', handleSocialHover);
        link.addEventListener('mouseleave', handleSocialLeave);
        link.addEventListener('touchstart', handleSocialTouch, { passive: true });
        link.addEventListener('touchend', handleSocialTouchEnd, { passive: true });
        
        // Add focus effects for accessibility
        link.addEventListener('focus', handleSocialHover);
        link.addEventListener('blur', handleSocialLeave);
    });
}

function handleSocialHover(e) {
    gsap.to(e.currentTarget, {
        scale: 1.1,
        duration: 0.3,
        ease: "back.out(1.7)"
    });
}

function handleSocialLeave(e) {
    gsap.to(e.currentTarget, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
    });
}

function handleSocialTouch(e) {
    e.preventDefault();
    handleSocialHover(e);
}

function handleSocialTouchEnd(e) {
    e.preventDefault();
    handleSocialLeave(e);
}

function handleHeroResponsive() {
    let resizeTimeout;
    
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reinitialize scroll animations on resize
            const hero = document.getElementById('hero');
            const heroImage = document.getElementById('hero-image');
            const heroTextIdeate = document.getElementById('hero-text-ideate');
            const heroTextDevelop = document.getElementById('hero-text-develop');
            
            if (hero && heroImage && heroTextIdeate && heroTextDevelop) {
                setupScrollAnimations(hero, heroImage, heroTextIdeate, heroTextDevelop);
            }
        }, 250);
    });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function initSmoothScrolling() {
    // Select all links with hashes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for navbar
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '↑';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);
    
    // Style the button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-to-top {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #000000;
            color: #ffffff;
            border: none;
            border-radius: 50%;
            font-size: 1.5rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 999;
            outline: none;
            -webkit-tap-highlight-color: transparent;
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .scroll-to-top:hover {
            transform: translateY(-5px);
            background: #333333;
        }
        
        @media (max-width: 767px) {
            .scroll-to-top {
                bottom: 20px;
                right: 20px;
                width: 45px;
                height: 45px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function initPageTransitions() {
    // Add page transition styles
    const style = document.createElement('style');
    style.textContent = `
        .page-transition {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffffff;
            z-index: 9999;
            transform: translateY(100%);
            pointer-events: none;
        }
        
        @media (prefers-reduced-motion: reduce) {
            .page-transition {
                display: none;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Handle internal link clicks
    document.querySelectorAll('a[href^="/"], a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#') || href.startsWith('/')) {
                e.preventDefault();
                
                // Create transition element
                const transition = document.createElement('div');
                transition.className = 'page-transition';
                document.body.appendChild(transition);
                
                // Animate in
                gsap.to(transition, {
                    y: 0,
                    duration: 0.5,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Navigate after animation
                        setTimeout(() => {
                            if (href.startsWith('#')) {
                                const target = document.querySelector(href);
                                if (target) {
                                    window.scrollTo({
                                        top: target.offsetTop - 80,
                                        behavior: 'smooth'
                                    });
                                }
                            } else {
                                window.location.href = href;
                            }
                            
                            // Animate out
                            gsap.to(transition, {
                                y: '-100%',
                                duration: 0.5,
                                delay: 0.1,
                                ease: "power2.inOut",
                                onComplete: () => {
                                    document.body.removeChild(transition);
                                }
                            });
                        }, 300);
                    }
                });
            }
        });
    });
}

function initPerformanceMonitoring() {
    // Monitor FPS
    if ('requestAnimationFrame' in window) {
        let frameCount = 0;
        let lastTime = performance.now();
        
        function checkFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime > lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
                if (fps < 30) {
                    console.warn(`Low FPS detected: ${fps}`);
                }
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(checkFPS);
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    // Monitor memory usage
    if ('performance' in window && 'memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
            const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
            
            if (usedMB > totalMB * 0.8) {
                console.warn(`High memory usage: ${usedMB}MB / ${totalMB}MB`);
            }
        }, 30000);
    }
}

// ============================================
// GLOBAL EVENT HANDLERS
// ============================================

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        gsap.globalTimeline.pause();
    } else {
        // Resume animations when page is visible
        gsap.globalTimeline.resume();
    }
});

// Error boundary for GSAP
window.addEventListener('error', function(e) {
    if (e.message.includes('GSAP')) {
        console.warn('GSAP error caught:', e);
        // Graceful degradation
        const mainContent = document.getElementById('main-content');
        const preloader = document.getElementById('preloader');
        
        if (preloader && mainContent) {
            preloader.style.display = 'none';
            mainContent.style.display = 'block';
            mainContent.style.opacity = '1';
            document.body.classList.remove('preloader-active');
        }
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    // Close mobile menu on escape
    if (e.key === 'Escape') {
        const navLinks = document.getElementById('nav-links');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        
        if (navLinks && navLinks.classList.contains('active')) {
            // Call closeMobileMenu function
            const closeMobileMenu = () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
                
                // Remove overlay if it exists
                const overlay = document.querySelector('.menu-close-overlay');
                if (overlay) {
                    overlay.remove();
                }
                
                // Animate links out
                const allNavLinks = document.querySelectorAll('.nav-link');
                allNavLinks.forEach((link, index) => {
                    gsap.to(link, {
                        x: 40,
                        opacity: 0,
                        duration: 0.3,
                        delay: (allNavLinks.length - index - 1) * 0.04,
                        ease: "power2.in"
                    });
                });
            };
            
            closeMobileMenu();
        }
    }
});

// Initialize Intersection Observer for lazy loading
function initIntersectionObserver() {
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        // Observe images with data-src attribute
        document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
    }
}

// Call intersection observer after portfolio loads
document.addEventListener('preloaderComplete', initIntersectionObserver);

// Service Worker Registration (Optional - for PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Export functions for debugging if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPreloader,
        initNavbar,
        initHero,
        initPortfolio,
        updateTime,
        initMobileMenuAnimations
    };
}

