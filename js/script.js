document.addEventListener('DOMContentLoaded', () => {
    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if href is just '#'

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const offsetTop = targetElement.offsetTop;
                scroll({
                    top: offsetTop - (document.querySelector('.header').offsetHeight || 0), // Adjust for sticky header
                    behavior: 'smooth'
                });

                // Close mobile menu after clicking a link
                const navMenu = document.getElementById('nav-menu');
                const hamburger = document.getElementById('hamburger');
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    hamburger.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            }
        });
    });

    // Sticky Header
    const header = document.getElementById('header');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) { // Add sticky class after scrolling 100px
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }

            // Optional: Hide/show header on scroll down/up
            // if (scrollTop > lastScrollTop) {
            //     // Scrolling down
            //     header.style.transform = 'translateY(-100%)';
            // } else {
            //     // Scrolling up
            //     header.style.transform = 'translateY(0)';
            // }
            // lastScrollTop = scrollTop;
        });
    }


    // Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Prevent scrolling when menu is open
        });
    }

    // Back to Top Button
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Show button after scrolling 300px
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Particles.js Initialization (assuming particles.min.js is loaded)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('hero-particles', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "src": "img/github.svg",
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }

    // ScrollReveal Initialization (assuming scrollreveal.min.js is loaded)
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.section-header, .about-image, .about-text, .service-card, .destination-card, .testimonial-slide, .contact-info, .contact-form-wrapper, .footer-brand, .footer-column', {
            delay: 200,
            distance: '50px',
            origin: 'bottom',
            interval: 100,
            easing: 'ease-in-out',
            duration: 800,
            mobile: false // Disable on mobile for performance if needed
        });

        ScrollReveal().reveal('.hero-title, .hero-subtitle, .hero-buttons', {
            delay: 400,
            scale: 0.9,
            easing: 'ease-in-out',
            duration: 1000,
            mobile: false
        });
    }

    // GSAP and ScrollTrigger Animations (assuming gsap.min.js and ScrollTrigger.min.js are loaded)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Floating elements in Services section
        gsap.utils.toArray(".floating-element").forEach(element => {
            gsap.to(element, {
                y: "random(-20, 20)",
                x: "random(-20, 20)",
                rotation: "random(0, 360)",
                ease: "none",
                repeat: -1,
                yoyo: true,
                duration: "random(8, 15)",
                delay: "random(0, 5)"
            });
        });

        // Example: Pinning a section
        // gsap.to(".services-background", {
        //     scrollTrigger: {
        //         trigger: ".services",
        //         pin: true,
        //         start: "top top",
        //         end: "bottom bottom",
        //         scrub: 1,
        //         // markers: true
        //     }
        // });
    }

    // Destination Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const destinationCards = document.querySelectorAll('.destination-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filter = button.dataset.filter; // 'all', 'nacional', 'internacional', 'aventura'

            destinationCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block'; // Show card
                    gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' });
                } else {
                    card.style.display = 'none'; // Hide card
                }
            });
        });
    });

    // Testimonials Slider
    const testimonialSlider = document.getElementById('testimonials-slider');
    const prevBtn = document.getElementById('prev-testimonial');
    const nextBtn = document.getElementById('next-testimonial');
    const testimonialDots = document.getElementById('testimonials-dots');
    const slides = Array.from(testimonialSlider ? testimonialSlider.querySelectorAll('.testimonial-slide') : []);
    const dots = Array.from(testimonialDots ? testimonialDots.querySelectorAll('.dot') : []);
    let currentSlide = 0;

    function showSlide(index) {
        if (!slides.length) return;

        // Ensure index is within bounds
        if (index >= slides.length) {
            index = 0;
        } else if (index < 0) {
            index = slides.length - 1;
        }

        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            // GSAP animation for sliding effect
            if (i === index) {
                gsap.fromTo(slide, { x: (i > currentSlide ? '100%' : '-100%'), opacity: 0 }, { x: '0%', opacity: 1, duration: 0.7, ease: 'power2.out' });
                slide.classList.add('active');
            } else {
                gsap.to(slide, { opacity: 0, duration: 0.3, onComplete: () => { slide.style.display = 'none'; } });
            }
        });

        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === index) {
                dot.classList.add('active');
            }
        });
        currentSlide = index;
    }

    if (testimonialSlider) { // Only run if slider exists
        // Initial setup
        showSlide(currentSlide);

        prevBtn.addEventListener('click', () => {
            showSlide(currentSlide - 1);
        });

        nextBtn.addEventListener('click', () => {
            showSlide(currentSlide + 1);
        });

        dots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                showSlide(slideIndex);
            });
        });

        // Auto slide
        let slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 8000); // Change slide every 8 seconds

        // Pause on hover
        testimonialSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
        testimonialSlider.addEventListener('mouseleave', () => {
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 8000);
        });
    }


    // Contact Form Submission (Placeholder)
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // In a real scenario, you would send this data to a server
            alert('Mensagem enviada com sucesso! Em breve entraremos em contato.');
            contactForm.reset();
        });
    }

    // Add active class to current nav link on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Adjust as needed to activate when section is 30% visible
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${entry.target.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Special handling for home section when at the very top
    window.addEventListener('scroll', () => {
        if (window.scrollY < document.getElementById('about').offsetTop - (document.querySelector('.header').offsetHeight || 0) ) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active');
                }
            });
        }
    });
});