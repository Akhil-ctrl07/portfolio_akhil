// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initializeNavigation();
    initializeLoadingScreen();
    initializeScrollAnimations();
    initializeStatCounters();
    initializeSkillBars();
    initializeContactForm();
    initializeBackToTop();
    initializeModal();
    initializeSmoothScrolling();
    
    // Add scroll event listener for navbar
    window.addEventListener('scroll', handleNavbarScroll);
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
});

// Navigation Functions
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('nav-open');
        });
    });
    
    // Update active nav link on scroll
    updateActiveNavLink();
    window.addEventListener('scroll', updateActiveNavLink);
}

function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Loading Screen
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger specific animations
                if (entry.target.classList.contains('stat-item')) {
                    animateCounter(entry.target.querySelector('.stat-number'));
                }
                
                if (entry.target.classList.contains('skill-category')) {
                    animateSkillBars(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('[data-aos]');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Observe stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => observer.observe(item));
    
    // Observe skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => observer.observe(category));
}

// Counter Animation
function initializeStatCounters() {
    // This will be triggered by the intersection observer
}

function animateCounter(element) {
    if (element.classList.contains('counted')) return;
    
    const target = parseFloat(element.getAttribute('data-target'));
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(function() {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format the number appropriately
        if (target === 6.32) {
            element.textContent = current.toFixed(2);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
    
    element.classList.add('counted');
}

// Skill Bars Animation
function initializeSkillBars() {
    // This will be triggered by the intersection observer
}

function animateSkillBars(skillCategory) {
    if (skillCategory.classList.contains('animated')) return;
    
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        }, index * 200);
    });
    
    skillCategory.classList.add('animated');
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Validate form
        if (!validateForm(name, email, subject, message)) {
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            contactForm.reset();
            
            // Reset button
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}

function validateForm(name, email, subject, message) {
    const errors = [];
    
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }
    
    if (!email || !isValidEmail(email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!subject || subject.trim().length < 3) {
        errors.push('Subject must be at least 3 characters long');
    }
    
    if (!message || message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('<br>'), 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10001;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => removeNotification(notification));
    
    // Auto remove after 5 seconds
    setTimeout(() => removeNotification(notification), 5000);
}

function removeNotification(notification) {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Smooth scroll to top
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Modal Functions
function initializeModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.getElementById('modal-close');
    
    // Close modal when clicking close button
    closeBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    // Project data
    const projectData = {
        'wallpaper-hub': {
            title: 'WallpaperHub (Zedge Clone)',
            content: `
                <div class="modal-project-details">
                    <div class="project-overview">
                        <h4>Project Overview</h4>
                        <p>A comprehensive web application for browsing and uploading wallpapers, designed to replicate and enhance the core functionalities of Zedge. This project demonstrates advanced web development skills and user experience design.</p>
                    </div>
                    
                    <div class="project-features-detailed">
                        <h4>Key Features</h4>
                        <ul>
                            <li><strong>Advanced Search System:</strong> Multi-parameter search functionality allowing users to find wallpapers by title, tags, categories, and custom filters</li>
                            <li><strong>Dynamic Filtering:</strong> Real-time category filtering with smooth animations and instant results</li>
                            <li><strong>Interactive UI Elements:</strong> Toggle between grid and list views, detailed modal previews, and intuitive navigation</li>
                            <li><strong>Upload System:</strong> Sophisticated drag-and-drop interface for uploading custom wallpapers with metadata management</li>
                            <li><strong>Responsive Design:</strong> Seamless experience across all devices using CSS Grid, Flexbox, and media queries</li>
                            <li><strong>Download & Share:</strong> Integrated download functionality with social sharing capabilities</li>
                        </ul>
                    </div>
                    
                    <div class="project-tech-stack">
                        <h4>Technology Stack</h4>
                        <div class="tech-grid">
                            <div class="tech-item">
                                <strong>Frontend:</strong>
                                <span>HTML5, CSS3, JavaScript (ES6+)</span>
                            </div>
                            <div class="tech-item">
                                <strong>Design:</strong>
                                <span>Responsive Web Design, CSS Grid, Flexbox</span>
                            </div>
                            <div class="tech-item">
                                <strong>Features:</strong>
                                <span>File Upload API, Local Storage, DOM Manipulation</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="project-challenges">
                        <h4>Technical Challenges Solved</h4>
                        <ul>
                            <li>Implemented efficient image lazy loading for optimal performance</li>
                            <li>Created a robust search algorithm with multiple filter combinations</li>
                            <li>Designed a scalable architecture for handling large image collections</li>
                            <li>Optimized for fast loading times and smooth user interactions</li>
                        </ul>
                    </div>
                    
                    <div class="project-impact">
                        <h4>Project Impact</h4>
                        <p>This project showcases advanced frontend development skills, user experience design, and the ability to create complex web applications with pure JavaScript. It demonstrates proficiency in modern web technologies and responsive design principles.</p>
                    </div>
                </div>
            `
        }
    };
    
    const project = projectData[projectId];
    if (project) {
        modalTitle.textContent = project.title;
        modalBody.innerHTML = project.content;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Resize Handler
function handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 768) {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    }
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// Add additional CSS for animations
const additionalCSS = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
    
    .modal-project-details {
        line-height: 1.6;
    }
    
    .modal-project-details h4 {
        color: var(--primary-color);
        margin: 1.5rem 0 1rem 0;
        font-size: 1.2rem;
        font-weight: 600;
    }
    
    .modal-project-details h4:first-child {
        margin-top: 0;
    }
    
    .modal-project-details ul {
        margin: 1rem 0;
        padding-left: 1.5rem;
    }
    
    .modal-project-details li {
        margin-bottom: 0.75rem;
        color: var(--text-secondary);
    }
    
    .modal-project-details strong {
        color: var(--text-primary);
    }
    
    .tech-grid {
        display: grid;
        gap: 1rem;
        margin: 1rem 0;
    }
    
    .tech-item {
        display: flex;
        gap: 1rem;
        align-items: start;
    }
    
    .tech-item strong {
        min-width: 80px;
        color: var(--primary-color);
    }
    
    .tech-item span {
        color: var(--text-secondary);
    }
    
    .project-impact p {
        color: var(--text-secondary);
        font-style: italic;
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 4px solid var(--primary-color);
    }
`;

// Inject additional CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalCSS;
document.head.appendChild(styleSheet);

// Performance optimizations
const debouncedResize = debounce(handleResize, 250);
const throttledScroll = throttle(handleNavbarScroll, 16);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add entrance animations to elements
    const elementsToAnimate = document.querySelectorAll('.hero-content, .about-content, .timeline-item, .experience-card, .project-card, .skill-category, .leadership-card, .contact-content');
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});
