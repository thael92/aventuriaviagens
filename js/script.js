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

// Enhanced Airlines Stack Animation with Scroll Control
class AirlinesController {
    constructor() {
        this.currentIndex = 0;
        this.totalCards = 6;
        this.isScrollLocked = false;
        this.section = document.getElementById('airlines');
        this.stack = document.getElementById('airlines-stack');
        this.cards = this.stack?.querySelectorAll('.airline-card') || [];
        this.details = document.querySelectorAll('.airline-detail');
        this.progressFill = document.getElementById('progress-fill');
        this.progressText = document.getElementById('progress-text');
        this.scrollIndicator = document.getElementById('scroll-indicator');
        this.isInSection = false;
        this.wheelTimeout = null;
        this.touchStartY = 0;
        this.touchEndY = 0;
        
        this.init();
    }
    
    init() {
        if (!this.section || !this.stack) return;
        
        this.setupScrollObserver();
        this.setupEventListeners();
        this.updateDisplay();
    }
    
    setupScrollObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isInSection = true;
                    this.lockScroll();
                } else {
                    this.isInSection = false;
                    this.unlockScroll();
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '-10% 0px -10% 0px'
        });
        
        observer.observe(this.section);
    }
    
    setupEventListeners() {
        // Wheel event for desktop
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // Touch events for mobile
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Prevent default scroll behavior when in section
        document.addEventListener('scroll', (e) => {
            if (this.isScrollLocked && this.isInSection) {
                e.preventDefault();
                window.scrollTo(0, this.section.offsetTop);
            }
        }, { passive: false });
    }
    
    handleWheel(e) {
        if (!this.isInSection) return;
        
        e.preventDefault();
        
        // Debounce wheel events
        if (this.wheelTimeout) return;
        
        this.wheelTimeout = setTimeout(() => {
            this.wheelTimeout = null;
        }, 150);
        
        const delta = e.deltaY;
        
        if (delta > 0) {
            // Scrolling down
            this.nextCard();
        } else {
            // Scrolling up
            this.prevCard();
        }
    }
    
    handleTouchStart(e) {
        if (!this.isInSection) return;
        this.touchStartY = e.touches[0].clientY;
    }
    
    handleTouchEnd(e) {
        if (!this.isInSection) return;
        this.touchEndY = e.changedTouches[0].clientY;
        
        const deltaY = this.touchStartY - this.touchEndY;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaY) > minSwipeDistance) {
            if (deltaY > 0) {
                // Swiped up (next card)
                this.nextCard();
            } else {
                // Swiped down (previous card)
                this.prevCard();
            }
        }
    }
    
    handleKeyboard(e) {
        if (!this.isInSection) return;
        
        switch(e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                e.preventDefault();
                this.nextCard();
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                e.preventDefault();
                this.prevCard();
                break;
        }
    }
    
    nextCard() {
        if (this.currentIndex < this.totalCards - 1) {
            this.currentIndex++;
            this.updateDisplay();
            this.animateCardTransition('next');
        } else {
            // Last card reached, allow scroll to next section
            this.showScrollIndicator();
            setTimeout(() => {
                this.unlockScroll();
                this.scrollToNextSection();
            }, 1000);
        }
    }
    
    prevCard() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateDisplay();
            this.animateCardTransition('prev');
            this.hideScrollIndicator();
        } else {
            // First card, allow scroll to previous section
            this.unlockScroll();
            this.scrollToPrevSection();
        }
    }
    
    animateCardTransition(direction) {
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'exit-left', 'exit-right');
            
            const relativeIndex = index - this.currentIndex;
            
            if (relativeIndex < 0) {
                // Cards that went behind
                card.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');
                card.style.zIndex = '0';
            } else {
                // Visible cards
                const zIndex = this.totalCards - relativeIndex;
                card.style.zIndex = zIndex.toString();
                
                if (relativeIndex === 0) {
                    card.classList.add('active');
                }
                
                // Update transform based on position
                this.updateCardTransform(card, relativeIndex);
            }
        });
    }
    
    updateCardTransform(card, relativeIndex) {
        const isMobile = window.innerWidth <= 1200;
        
        if (isMobile) {
            // Transformações para selo responsivo
            const baseX = relativeIndex * (window.innerWidth <= 480 ? 2 : 3);
            const baseY = relativeIndex * (window.innerWidth <= 480 ? 1 : 2);
            const rotateZ = -10 + (relativeIndex * 2);
            const opacity = Math.max(0.5, 1 - (relativeIndex * 0.1));
            
            card.style.transform = `translateX(${baseX}px) translateY(${baseY}px) rotateZ(${rotateZ}deg)`;
            card.style.opacity = opacity.toString();
        } else {
            // Transformações para desktop (mantém o original)
            const baseX = relativeIndex * 15;
            const baseY = relativeIndex * 20;
            const rotateY = relativeIndex * 5;
            const rotateX = relativeIndex * 2;
            const opacity = Math.max(0.5, 1 - (relativeIndex * 0.1));
            
            card.style.transform = `translateX(${baseX}px) translateY(${baseY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            card.style.opacity = opacity.toString();
        }
    }
    
    updateDisplay() {
        // Update active states
        this.cards.forEach((card, index) => {
            card.classList.toggle('active', index === this.currentIndex);
        });
        
        this.details.forEach((detail, index) => {
            detail.classList.toggle('active', index === this.currentIndex);
        });
        
        // Update progress
        const progress = ((this.currentIndex + 1) / this.totalCards) * 100;
        if (this.progressFill) {
            this.progressFill.style.width = `${progress}%`;
        }
        
        if (this.progressText) {
            this.progressText.textContent = `${this.currentIndex + 1} / ${this.totalCards}`;
        }
    }
    
    lockScroll() {
        this.isScrollLocked = true;
        document.body.style.overflow = 'hidden';
        
        // Scroll to section top smoothly
        const sectionTop = this.section.offsetTop;
        window.scrollTo({
            top: sectionTop,
            behavior: 'smooth'
        });
    }
    
    unlockScroll() {
        this.isScrollLocked = false;
        document.body.style.overflow = '';
    }
    
    showScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.classList.add('show');
        }
    }
    
    hideScrollIndicator() {
        if (this.scrollIndicator) {
            this.scrollIndicator.classList.remove('show');
        }
    }
    
    scrollToNextSection() {
        const nextSection = this.section.nextElementSibling;
        if (nextSection) {
            nextSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    scrollToPrevSection() {
        const prevSection = this.section.previousElementSibling;
        if (prevSection) {
            prevSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // Public method to reset the controller
    reset() {
        this.currentIndex = 0;
        this.updateDisplay();
        this.hideScrollIndicator();
        
        // Reset all cards to initial positions
        this.cards.forEach((card, index) => {
            card.classList.remove('active', 'exit-left', 'exit-right');
            if (index === 0) {
                card.classList.add('active');
            }
            
            // Reset transforms
            const baseX = index * 15;
            const baseY = index * 20;
            const rotateY = index * 5;
            const rotateX = index * 2;
            const opacity = Math.max(0.5, 1 - (index * 0.1));
            const zIndex = this.totalCards - index;
            
            card.style.transform = `translateX(${baseX}px) translateY(${baseY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            card.style.opacity = opacity.toString();
            card.style.zIndex = zIndex.toString();
        });
    }
    
    // Method to go to specific card
    goToCard(index) {
        if (index >= 0 && index < this.totalCards) {
            this.currentIndex = index;
            this.updateDisplay();
            this.animateCardTransition(index > this.currentIndex ? 'next' : 'prev');
        }
    }
}

// Enhanced scroll management
class ScrollManager {
    constructor() {
        this.scrollLocked = false;
        this.lockedSection = null;
        this.init();
    }
    
    init() {
        // Prevent default scroll behavior when locked
        window.addEventListener('scroll', (e) => {
            if (this.scrollLocked && this.lockedSection) {
                e.preventDefault();
                window.scrollTo(0, this.lockedSection.offsetTop);
            }
        }, { passive: false });
        
        // Prevent scroll restoration
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
    }
    
    lockToSection(section) {
        this.scrollLocked = true;
        this.lockedSection = section;
        document.body.style.overflow = 'hidden';
    }
    
    unlock() {
        this.scrollLocked = false;
        this.lockedSection = null;
        document.body.style.overflow = '';
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the airlines controller
    const airlinesController = new AirlinesController();
    const scrollManager = new ScrollManager();
    
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // If clicking on airlines section, reset it first
                if (target.id === 'airlines') {
                    airlinesController.reset();
                }
                
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add visual feedback for card interactions
    const cards = document.querySelectorAll('.airline-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (this.classList.contains('active')) {
                this.style.transform += ' scale(1.02)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset transform without scale
            const index = parseInt(this.dataset.index);
            const currentIndex = airlinesController.currentIndex;
            const relativeIndex = index - currentIndex;
            
            if (relativeIndex >= 0) {
                const baseX = relativeIndex * 15;
                const baseY = relativeIndex * 20;
                const rotateY = relativeIndex * 5;
                const rotateX = relativeIndex * 2;
                
                this.style.transform = `translateX(${baseX}px) translateY(${baseY}px) rotateY(${rotateY}deg) rotateX(${rotateX}deg)`;
            }
        });
    });
    
    // Add keyboard navigation hints
    const navigationHint = document.querySelector('.navigation-hint p');
    if (navigationHint) {
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobile) {
            navigationHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Deslize para navegar pelas companhias';
        } else {
            navigationHint.innerHTML = '<i class="fas fa-mouse"></i> Role ou use as setas para navegar';
        }
    }
    
    // Add progress animation on section enter
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    progressBar.style.animation = 'progressPulse 2s ease-in-out infinite';
                } else {
                    progressBar.style.animation = '';
                }
            });
        });
        
        observer.observe(document.getElementById('airlines'));
    }
    
    // Expose controller globally for debugging
    window.airlinesController = airlinesController;
});

// Add CSS animation for progress pulse
const style = document.createElement('style');
style.textContent = `
    @keyframes progressPulse {
        0%, 100% { 
            box-shadow: 0 0 0 0 rgba(251, 139, 4, 0.4); 
        }
        50% { 
            box-shadow: 0 0 0 8px rgba(251, 139, 4, 0); 
        }
    }
    
    /* Smooth transitions for all elements */
    .airline-card {
        will-change: transform, opacity, z-index;
    }
    
    .airline-detail {
        will-change: opacity, transform;
    }
    
    /* Loading state */
    .airlines-partners.loading .airline-card {
        opacity: 0;
        transform: translateY(50px);
    }
    
    .airlines-partners.loaded .airline-card {
        animation: cardSlideIn 0.8s ease-out forwards;
    }
    
    @keyframes cardSlideIn {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

document.head.appendChild(style);

// Add loading animation
window.addEventListener('load', function() {
    const airlinesSection = document.getElementById('airlines');
    if (airlinesSection) {
        airlinesSection.classList.add('loading');
        
        setTimeout(() => {
            airlinesSection.classList.remove('loading');
            airlinesSection.classList.add('loaded');
        }, 100);
    }
});
// Adicione esta função ao final do arquivo JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animação da seção About
    const aboutSection = document.getElementById('about');
    
    if (aboutSection) {
        const aboutObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.3
        });
        
        aboutObserver.observe(aboutSection);
        
        // Contador animado para os stats
        const statNumbers = document.querySelectorAll('.stat-number');
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalNumber = target.textContent;
                    
                    if (finalNumber.includes('+') && !finalNumber.includes('BTC')) {
                        const number = parseInt(finalNumber.replace('+', ''));
                        animateCounter(target, 0, number, 2000);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => {
            statsObserver.observe(stat);
        });
    }
    
    function animateCounter(element, start, end, duration) {
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            const currentNumber = Math.floor(progress * (end - start) + start);
            element.textContent = currentNumber + '+';
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
});

// Adicione esta função ao final do arquivo JavaScript existente

document.addEventListener('DOMContentLoaded', function() {
    // Aguardar um pouco para garantir que tudo foi carregado
    setTimeout(function() {
        initImageModal();
    }, 500);
});

function initImageModal() {
    const mainImage = document.getElementById('mainImage');
    const imageFrame = document.querySelector('.image-inner-frame');
    const imageModal = document.getElementById('imageModal');
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (!imageModal || !mainImage) {
        console.log('Elementos do modal não encontrados');
        return;
    }
    
    function openModal() {
        imageModal.classList.add('active');
        document.body.classList.add('modal-open');
        imageModal.style.display = 'flex';
    }
    
    function closeModal() {
        imageModal.classList.remove('active');
        document.body.classList.remove('modal-open');
        setTimeout(() => {
            imageModal.style.display = 'none';
        }, 400);
    }
    
    // Abrir modal ao clicar na imagem
    mainImage.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openModal();
    });
    
    // Abrir modal ao clicar no frame
    if (imageFrame) {
        imageFrame.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }
    
    // Fechar modal - botão X
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }
    
    // Fechar modal - clique no overlay
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
    
    // Fechar modal - tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && imageModal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Prevenir fechamento ao clicar na imagem do modal
    const modalImage = imageModal.querySelector('.modal-image-fullscreen');
    if (modalImage) {
        modalImage.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    console.log('Modal da imagem inicializado com sucesso!');
}
