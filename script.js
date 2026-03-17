// Smooth scroll navigation (enhanced)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Initialize page on load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Landing page loaded successfully');
    initializeCustomServices();
});

// Custom Services Functionality
function initializeCustomServices() {
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
    const selectedServicesList = document.getElementById('selected-services');
    const totalCostElement = document.getElementById('total-cost');
    const customCTA = document.querySelector('.custom-cta');

    // Add event listeners to checkboxes
    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateServicesSummary();
            updateCheckboxLabel(this);
        });
    });

    function updateCheckboxLabel(checkbox) {
        const label = checkbox.nextElementSibling;
        const serviceName = checkbox.getAttribute('data-service');
        label.querySelector('.service-name').textContent = serviceName;
    }

    function updateServicesSummary() {
        const selectedServices = [];
        let totalCost = 0;

        serviceCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const serviceName = checkbox.getAttribute('data-service');
                const price = parseInt(checkbox.getAttribute('data-price'));
                selectedServices.push({ name: serviceName, price: price });
                totalCost += price;
            }
        });

        // Update selected services list
        if (selectedServices.length === 0) {
            selectedServicesList.innerHTML = '<p style="color: var(--text-light); text-align: center;">Select services above to see them here</p>';
            customCTA.style.opacity = '0.5';
            customCTA.style.pointerEvents = 'none';
        } else {
            let html = '';
            selectedServices.forEach(service => {
                html += `
                    <div class="selected-service">
                        <span>${service.name}</span>
                        <span style="display: flex; align-items: center;">
                            <span style="color: var(--primary-color); font-weight: 700;">$${service.price}</span>
                            <span class="service-remove" data-service="${service.name}">✕</span>
                        </span>
                    </div>
                `;
            });
            selectedServicesList.innerHTML = html;
            customCTA.style.opacity = '1';
            customCTA.style.pointerEvents = 'auto';

            // Add remove functionality
            document.querySelectorAll('.service-remove').forEach(btn => {
                btn.addEventListener('click', function() {
                    const serviceName = this.getAttribute('data-service');
                    const checkboxToUncheck = Array.from(serviceCheckboxes).find(
                        cb => cb.getAttribute('data-service') === serviceName
                    );
                    if (checkboxToUncheck) {
                        checkboxToUncheck.checked = false;
                        updateServicesSummary();
                    }
                });
            });
        }

        // Update total cost
        totalCostElement.textContent = '$' + totalCost.toLocaleString();
    }

    // Initialize on load
    updateServicesSummary();
}
