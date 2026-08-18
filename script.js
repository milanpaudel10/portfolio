document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. Mobile Navigation Menu --- */
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        document.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    /* --- 2. Email Modal Handling --- */
    const emailModal = document.getElementById('emailModal');
    const openEmailBtn = document.getElementById('openEmailBtn');
    const footerEmailBtn = document.getElementById('footerEmailBtn');
    const closeEmailBtn = document.getElementById('closeEmailBtn');
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    const emailAddressElement = document.getElementById('emailAddress');
    const emailAddress = emailAddressElement ? emailAddressElement.innerText.trim() : '';

    const openEmailModal = () => emailModal?.classList.add('active');
    const closeEmailModal = () => emailModal?.classList.remove('active');

    openEmailBtn?.addEventListener('click', openEmailModal);
    footerEmailBtn?.addEventListener('click', openEmailModal);
    closeEmailBtn?.addEventListener('click', closeEmailModal);

    if (copyEmailBtn && emailAddress) {
        copyEmailBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(emailAddress).then(() => {
                const originalText = copyEmailBtn.innerText;
                copyEmailBtn.innerText = 'Copied!';
                setTimeout(() => {
                    copyEmailBtn.innerText = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy email: ', err);
            });
        });
    }

    /* --- 3. Resume Modal Viewer Handling --- */
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeBtn');
    const closeResumeBtn = document.getElementById('closeResumeBtn');

    const openResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    const closeResumeModal = () => {
        if (resumeModal) {
            resumeModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    };

    openResumeBtn?.addEventListener('click', openResumeModal);
    closeResumeBtn?.addEventListener('click', closeResumeModal);

    /* --- Global Modal Close (Overlay & Keyboard) --- */
    window.addEventListener('click', (e) => {
        if (e.target === emailModal) closeEmailModal();
        if (e.target === resumeModal) closeResumeModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeEmailModal();
            closeResumeModal();
        }
    });

    /* --- 4. Web3Forms Contact Form Handling --- */
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

        const validateEmail = () => {
            const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const isValid = pattern.test(emailInput.value.trim());
            if (emailError) {
                emailError.style.display = (!isValid && emailInput.value.trim() !== '') ? 'block' : 'none';
            }
            return isValid;
        };

        const validatePhone = () => {
            const pattern = /^(\+?\d{1,3}[- ]?)?\d{7,11}$/;
            const isValid = pattern.test(phoneInput.value.trim());
            if (phoneError) {
                phoneError.style.display = (!isValid && phoneInput.value.trim() !== '') ? 'block' : 'none';
            }
            return isValid;
        };

        const validateMessage = () => {
            const containsInappropriate = checkInappropriate(messageInput.value);
            if (messageError) {
                messageError.style.display = containsInappropriate ? 'block' : 'none';
            }
            return !containsInappropriate && messageInput.value.trim() !== '';
        };

        emailInput?.addEventListener('input', validateEmail);
        phoneInput?.addEventListener('input', validatePhone);
        messageInput?.addEventListener('input', validateMessage);

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isEmailValid = validateEmail();
            const isPhoneValid = validatePhone();
            const isMessageValid = validateMessage();

            if (!isEmailValid || !isPhoneValid || !isMessageValid) {
                if (!isEmailValid && emailError) emailError.style.display = 'block';
                if (!isPhoneValid && phoneError) phoneError.style.display = 'block';
                if (!isMessageValid && messageError) messageError.style.display = 'block';
                return;
            }

            const formData = new FormData(contactForm);
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-paper-plane"></i> Send Message';

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
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
                    submitBtn.innerHTML = originalBtnHtml;
                }
            }
        });
    }
});
