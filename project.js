// Project Page Animations and Functionality
        class ProjectPage {
            constructor() {
                this.sections = document.querySelectorAll('.project-section, .section-title, .stat-card, .tech-category, .feature-card, .gallery-item, .process-phase');
                this.observer = null;
                this.init();
            }

            init() {
                this.setupScrollAnimations();
                this.setupProjectData();
                this.setupSmoothScrolling();
            }

            setupScrollAnimations() {
                const options = {
                    threshold: 0.1,
                    rootMargin: '0px 0px -50px 0px'
                };

                this.observer = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('visible');
                            
                            // Stagger animations for child elements
                            if (entry.target.classList.contains('features-grid')) {
                                this.staggerAnimation(entry.target.querySelectorAll('.feature-card'), 0.1);
                            }
                            if (entry.target.classList.contains('tech-stack-grid')) {
                                this.staggerAnimation(entry.target.querySelectorAll('.tech-category'), 0.15);
                            }
                            if (entry.target.classList.contains('overview-stats')) {
                                this.staggerAnimation(entry.target.querySelectorAll('.stat-card'), 0.2);
                            }
                            if (entry.target.classList.contains('gallery-grid')) {
                                this.staggerAnimation(entry.target.querySelectorAll('.gallery-item'), 0.1);
                            }
                            if (entry.target.classList.contains('process-timeline')) {
                                this.staggerAnimation(entry.target.querySelectorAll('.process-phase'), 0.3);
                            }
                        }
                    });
                }, options);

                this.sections.forEach(section => {
                    this.observer.observe(section);
                });

                // Observe section titles separately
                document.querySelectorAll('.section-title').forEach(title => {
                    this.observer.observe(title);
                });
            }

            staggerAnimation(elements, delay) {
                elements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('visible');
                    }, index * delay * 1000);
                });
            }

            setupProjectData() {
                // Get project data from URL parameters or set default
                const urlParams = new URLSearchParams(window.location.search);
                const projectId = urlParams.get('project') || 'ecommerce';
                
                const projects = {
                    ecommerce: {
                        title: 'E-Commerce Platform',
                        subtitle: 'A modern e-commerce solution for a sportswear store with real-time inventory, AI-powered recommendations, and seamless payment integration.',
                        category: 'E-Commerce',
                        year: '2025',
                        demoUrl: 'https://thokozanen.github.io/mzansi-fits/#',
                        stats: {
                            conversion: '+45%',
                            loadTime: '2.1s',
                            uptime: '99.8%'
                        }
                    },
                    analytics: {
                        title: 'Analytics Dashboard',
                        subtitle: 'Interactive data visualization platform that transforms complex datasets into actionable insights with real-time updates.',
                        category: 'Analytics',
                        year: '2024',
                        demoUrl: '#',
                        stats: {
                            conversion: '+60%',
                            loadTime: '1.8s',
                            uptime: '99.9%'
                        }
                    },
                    health: {
                        title: 'Health & Fitness App',
                        subtitle: 'Comprehensive mobile application for fitness tracking, meal planning, and community engagement.',
                        category: 'Mobile App',
                        year: '2024',
                        demoUrl: '#',
                        stats: {
                            conversion: '+75%',
                            loadTime: '1.5s',
                            uptime: '99.7%'
                        }
                    }
                };

                const project = projects[projectId] || projects.ecommerce;
                
                // Update page content
                document.getElementById('projectTitle').textContent = project.title;
                document.getElementById('projectSubtitle').textContent = project.subtitle;
                document.getElementById('projectCategory').textContent = project.category;
                document.getElementById('projectYear').textContent = project.year;
                document.getElementById('liveDemoBtn').href = project.demoUrl;

                // Update stats
                const statCards = document.querySelectorAll('.stat-card');
                if (statCards.length >= 3) {
                    statCards[0].querySelector('.stat-number').textContent = project.stats.conversion;
                    statCards[1].querySelector('.stat-number').textContent = project.stats.loadTime;
                    statCards[2].querySelector('.stat-number').textContent = project.stats.uptime;
                }

                // Update page title
                document.title = `${project.title} - Thokozane Nxumalo`;
            }

            setupSmoothScrolling() {
                // Smooth scrolling for anchor links
                document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                    anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        const target = document.querySelector(this.getAttribute('href'));
                        if (target) {
                            target.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                        }
                    });
                });
            }
        }

        // Initialize project page when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            new ProjectPage();
            
            // Update current year in footer
            const yearElement = document.getElementById('currentYear');
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        });

        // Parallax effect for project hero
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.project-hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Add this script to ensure bento images are visible
        document.addEventListener('DOMContentLoaded', function() {
            // Force bento images to be visible
            const bentoImages = document.querySelectorAll('.bento-item img');
            bentoImages.forEach(img => {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
                img.style.display = 'block';
                img.style.zIndex = '1';
            });
            
            // Check if images loaded properly
            bentoImages.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) {
                    console.warn('Image failed to load:', img.src);
                    // Add fallback background
                    img.style.background = 'linear-gradient(135deg, var(--chart-1), var(--chart-2))';
                }
            });
        });