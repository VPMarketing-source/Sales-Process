// Smooth scroll navigation
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
    const estimateNoteElement = document.getElementById('estimate-note');
    const monthlyAdSpendInput = document.getElementById('monthly-ad-spend');
    const customCTA = document.querySelector('.custom-cta');

    function formatCurrency(value) {
        return '$' + value.toLocaleString();
    }

    function getMonthlyAdSpend() {
        if (!monthlyAdSpendInput) {
            return 0;
        }

        const spend = parseInt(monthlyAdSpendInput.value, 10);
        return Number.isNaN(spend) ? 0 : Math.max(spend, 0);
    }

    function getServiceEstimate(checkbox) {
        const basePrice = parseInt(checkbox.getAttribute('data-price'), 10) || 0;
        const serviceType = checkbox.getAttribute('data-type');

        if (serviceType !== 'ads-management') {
            return basePrice;
        }

        const monthlyAdSpend = getMonthlyAdSpend();
        const spendBasedFee = Math.round(monthlyAdSpend * 0.08);

        return Math.max(basePrice, spendBasedFee);
    }

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
                const price = getServiceEstimate(checkbox);
                selectedServices.push({ name: serviceName, price: price });
                totalCost += price;
            }
        });

        if (selectedServices.length === 0) {
            selectedServicesList.innerHTML = '<p style="color: var(--text-light); text-align: center;">Select services above to see them here</p>';
            if (estimateNoteElement) {
                estimateNoteElement.textContent = 'Select services above to build your estimate.';
            }
            customCTA.style.opacity = '0.5';
            customCTA.style.pointerEvents = 'none';
        } else {
            let html = '';
            selectedServices.forEach(service => {
                html += `
                    <div class="selected-service">
                        <span>${service.name}</span>
                        <span style="display: flex; align-items: center;">
                            <span style="color: var(--primary-color); font-weight: 700;">${formatCurrency(service.price)}</span>
                            <span class="service-remove" data-service="${service.name}">x</span>
                        </span>
                    </div>
                `;
            });
            selectedServicesList.innerHTML = html;
            if (estimateNoteElement) {
                const spendText = formatCurrency(getMonthlyAdSpend());
                estimateNoteElement.textContent = `Ad management services are estimated using ${spendText}/month in ad spend. Final pricing is confirmed after strategy review.`;
            }
            customCTA.style.opacity = '1';
            customCTA.style.pointerEvents = 'auto';

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

        totalCostElement.textContent = formatCurrency(totalCost);
    }

    serviceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updateServicesSummary();
            updateCheckboxLabel(this);
        });
    });

    if (monthlyAdSpendInput) {
        monthlyAdSpendInput.addEventListener('input', updateServicesSummary);
    }

    updateServicesSummary();
}
