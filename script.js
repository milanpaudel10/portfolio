document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section');
    const form = document.getElementById('form');
    const result = document.getElementById('result');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object = Object.fromEntries(formData);
            const json = JSON.stringify(object);
            result.innerHTML = "Sending...";

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: json
            })
            .then(async (response) => {
                let res = await response.json();
                if (response.status == 200) {
                    result.innerHTML = "Message sent successfully!";
                    result.style.color = "black";
                    form.reset();
                } else {
                    result.innerHTML = res.message;
                    result.style.color = "red";
                }
            })
            .catch(error => {
                result.innerHTML = "Something went wrong!";
                result.style.color = "red";
            })
            .then(() => {
                setTimeout(() => { result.innerHTML = ""; }, 5000);
            });
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // Start Date: March 14, 2026
    const projectStart = new Date(2026, 2, 14, 0, 0, 0).getTime();

    // Helper to add leading zero
    const formatTime = (num) => num.toString().padStart(2, '0');

    function updateTimer() {
        const now = new Date().getTime();
        const diff = now - projectStart;

        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        // Update with formatted strings
        document.getElementById("days").innerText = formatTime(d);
        document.getElementById("hours").innerText = formatTime(h);
        document.getElementById("minutes").innerText = formatTime(m);
        document.getElementById("seconds").innerText = formatTime(s);
    }

    setInterval(updateTimer, 1000);
    updateTimer();
});