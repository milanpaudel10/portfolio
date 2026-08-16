document.addEventListener('DOMContentLoaded', () => {

    /* --- Mobile Navigation Menu --- */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close mobile drawer when clicking internal links
        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    /* --- 1. Email Modal Handling --- */
    const emailModal = document.getElementById('emailModal');
    const openEmailBtn = document.getElementById('openEmailBtn');
    const footerEmailBtn = document.getElementById('footerEmailBtn');
    const closeEmailBtn = document.getElementById('closeEmailBtn');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailAddressElement = document.getElementById('emailAddress');
    const emailAddress = emailAddressElement ? emailAddressElement.innerText : '';

    const openEmailModal = () => emailModal && emailModal.classList.add('active');
    const closeEmailModal = () => emailModal && emailModal.classList.remove('active');

    if (openEmailBtn) openEmailBtn.addEventListener('click', openEmailModal);
    if (footerEmailBtn) footerEmailBtn.addEventListener('click', openEmailModal);
    if (closeEmailBtn) closeEmailBtn.addEventListener('click', closeEmailModal);

    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress).then(() => {
                copyEmailBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyEmailBtn.innerText = 'Copy';
                }, 2000);
            });
        });
    }

    /* --- 2. Resume Modal Viewer Handling --- */
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeBtn');
    const closeResumeBtn = document.getElementById('closeResumeBtn');

    if (openResumeBtn) {
        openResumeBtn.addEventListener('click', () => {
            if (resumeModal) {
                resumeModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    }

    if (closeResumeBtn) {
        closeResumeBtn.addEventListener('click', () => {
            if (resumeModal) {
                resumeModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    /* Global Modal Close on Overlay Click */
    window.addEventListener('click', (e) => {
        if (e.target === emailModal) {
            closeEmailModal();
        }
    });

    /* --- 3. Web3Forms Contact Form Handling --- */
    const contactForm = document.getElementById('contactForm');
    
    const inappropriateWords = [
        'badword1', 'badword2', 'spam', 'hate', 'abuse', 
        'idiot', 'stupid', 'scam', 'fool'
    ];

    if (contactForm) {
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');
        const messageInput = document.getElementById('message');

        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');
        const messageError = document.getElementById('messageError');

        const checkInappropriate = (text) => {
            return inappropriateWords.some(word => 
                new RegExp(`\\b${word}\\b`, 'i').test(text)
            );
        };

        emailInput.addEventListener('input', () => {
            const pattern = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
            emailError.style.display = (!pattern.test(emailInput.value) && emailInput.value !== '') ? 'block' : 'none';
        });

        phoneInput.addEventListener('input', () => {
            const pattern = /^(\+?\d{1,3}[- ]?)?\d{7,11}$/;
            phoneError.style.display = (!pattern.test(phoneInput.value) && phoneInput.value !== '') ? 'block' : 'none';
        });

        messageInput.addEventListener('input', () => {
            const containsInappropriate = checkInappropriate(messageInput.value);
            messageError.style.display = containsInappropriate ? 'block' : 'none';
        });

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isEmailValid = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(emailInput.value);
            const isPhoneValid = /^(\+?\d{1,3}[- ]?)?\d{7,11}$/.test(phoneInput.value);
            const hasInappropriateWords = checkInappropriate(messageInput.value);

            if (!isEmailValid || !isPhoneValid || hasInappropriateWords) {
                if (!isEmailValid) emailError.style.display = 'block';
                if (!isPhoneValid) phoneError.style.display = 'block';
                if (hasInappropriateWords) messageError.style.display = 'block';
                return;
            }

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Send Message';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
            }

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.success) {
                    alert('Thank you! Your message has been sent successfully.');
                    contactForm.reset();
                } else {
                    alert('Error sending message: ' + (data.message || 'Please try again.'));
                }
            } catch (error) {
                console.error('Web3Forms Submission Error:', error);
                alert('Something went wrong. Please check your network connection and try again.');
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            }
        });
    }
});