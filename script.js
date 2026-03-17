document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.querySelector('.breakdown-toggle-button');
    const breakdown = document.getElementById('pricing-breakdown');

    if (!toggleButton || !breakdown) {
        return;
    }

    toggleButton.addEventListener('click', function() {
        const isHidden = breakdown.hasAttribute('hidden');

        if (isHidden) {
            breakdown.removeAttribute('hidden');
            toggleButton.setAttribute('aria-expanded', 'true');
            toggleButton.textContent = 'Hide Full Feature Breakdown';
        } else {
            breakdown.setAttribute('hidden', '');
            toggleButton.setAttribute('aria-expanded', 'false');
            toggleButton.textContent = 'View Full Feature Breakdown';
        }
    });
});
