// Initialize EmailJS
(function() {
    emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID
})();

// Animation on scroll
const animateElements = document.querySelectorAll('.animate');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, {
    threshold: 0.1
});

animateElements.forEach(element => {
    observer.observe(element);
});

// Mobile menu toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const nav = document.querySelector('nav');

mobileMenuBtn.addEventListener('click', () => {
    document.querySelector('.nav-container').classList.toggle('show');
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all nav links
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to clicked link
        this.classList.add('active');
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-container').classList.remove('show');
            }
        }
    });
});

// Update active nav item based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Gallery Slider functionality
const slides = document.querySelectorAll('.gallery-slide');
const dots = document.querySelectorAll('.gallery-dot');
const prevBtn = document.getElementById('galleryPrev');
const nextBtn = document.getElementById('galleryNext');
let currentSlide = 0;
let isTransitioning = false;

function showSlide(index) {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // Remove active class from current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    // Update current slide index
    currentSlide = index;
    
    // Add active class to new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
    
    // Reset transition flag after animation
    setTimeout(() => {
        isTransitioning = false;
    }, 600);
}

function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);

// Dot navigation
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Auto-play functionality
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 5000);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Start auto-play
startAutoPlay();

// Pause auto-play on hover
const slider = document.querySelector('.gallery-slider');
slider.addEventListener('mouseenter', stopAutoPlay);
slider.addEventListener('mouseleave', startAutoPlay);

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }
}

// Form submission
const form = document.getElementById('membershipForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        // Remove any existing messages
        const existingMessage = form.querySelector('.form-success, .form-error');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Form validation
        const fullname = document.getElementById('fullname').value.trim();
        const email = document.getElementById('email').value.trim();
        const province = document.getElementById('province').value;
        const phone = document.getElementById('phone').value.trim();
        const message = document.getElementById('message').value.trim();
        
        if (!fullname || !email || !province) {
            showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Veuillez entrer une adresse email valide.', 'error');
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            return;
        }
        
        // Prepare form data
        const formData = new FormData();
        formData.append('fullname', fullname);
        formData.append('email', email);
        formData.append('province', province);
        formData.append('phone', phone);
        formData.append('message', message);
        formData.append('_subject', 'Nouvelle demande d\'adhésion APKA');
        formData.append('_replyto', email);
        
        // Create WhatsApp message with form data
        const whatsappMessage = `Nouvelle demande d'adhésion APKA%0A%0ANom: ${fullname}%0AEmail: ${email}%0ATéléphone: ${phone}%0AProvince: ${province}%0AMessage: ${message}`;
        const whatsappUrl = `https://wa.me/243831700110?text=${whatsappMessage}`;
        
        // Show success message with WhatsApp link
        showMessage(`
            <div style="text-align: left;">
                <strong>Formulaire soumis avec succès!</strong><br><br>
                <strong>Détails de la demande:</strong><br>
                Nom: ${fullname}<br>
                Email: ${email}<br>
                Téléphone: ${phone}<br>
                Province: ${province}<br>
                Message: ${message}<br><br>
                <a href="${whatsappUrl}" target="_blank" style="color: white; text-decoration: underline; background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 5px; display: inline-block;">
                    <i class="fab fa-whatsapp"></i> Confirmer via WhatsApp
                </a>
            </div>
        `, 'success');
        form.reset();
        
        // Auto-open WhatsApp after 2 seconds
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 2000);
        
        // Reset button state
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'form-success' : 'form-error';
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <br><br>
        ${message}
    `;
    
    form.appendChild(messageDiv);
    
    // Auto-remove success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
} 