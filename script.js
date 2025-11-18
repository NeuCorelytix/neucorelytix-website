// Email form handling
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('emailForm');
    const emailInput = document.getElementById('emailInput');
    const submitBtn = document.querySelector('.submit-btn');

    emailForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const originalBtnText = submitBtn.textContent;
        
        if (email) {
            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Connecting...';
            submitBtn.style.opacity = '0.7';
            
            try {
                // Submit to Formspree (or your email service)
                const formData = new FormData(emailForm);
                const response = await fetch(emailForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Success
                    submitBtn.textContent = '✓ Connected!';
                    submitBtn.style.background = 'linear-gradient(135deg, #00C851 0%, #007E33 100%)';
                    emailInput.value = '';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.textContent = originalBtnText;
                        submitBtn.style.background = 'linear-gradient(135deg, #f1a41b 0%, #fbd863 50%, #037da1 100%)';
                        submitBtn.disabled = false;
                        submitBtn.style.opacity = '1';
                    }, 3000);
                } else {
                    throw new Error('Submission failed');
                }
            } catch (error) {
                // Error handling
                submitBtn.textContent = 'Try Again';
                submitBtn.style.background = 'linear-gradient(135deg, #FF4444 0%, #CC0000 100%)';
                
                setTimeout(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.style.background = 'linear-gradient(135deg, #f1a41b 0%, #fbd863 50%, #037da1 100%)';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            }
        }
    });

    // Add smooth scroll behavior
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

    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Typing animation
    const typingElement = document.getElementById('typingElement');
    const texts = [
        'Where ideas connect',
        'Where minds meet',
        'Where futures align',
        'Where potential unfolds'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeText() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentText.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before next text
        }

        setTimeout(typeText, typeSpeed);
    }

    if (typingElement) {
        typeText();
    }

    // Observe grid nodes
    document.querySelectorAll('.grid-node').forEach(node => {
        node.style.opacity = '0';
        node.style.transform = 'translateY(20px)';
        node.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(node);
    });
});

