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

document.addEventListener('DOMContentLoaded', function() {
    initializeCustomServices();
});

function initializeCustomServices() {
    const serviceCheckboxes = document.querySelectorAll('.service-checkbox');
    const selectedServicesList = document.getElementById('selected-services');
    const totalCostElement = document.getElementById('total-cost');
    const estimateNoteElement = document.getElementById('estimate-note');
    const monthlyAdSpendInput = document.getElementById('monthly-ad-spend');
    const emailSubscribersInput = document.getElementById('email-subscribers');
    const customCTA = document.querySelector('.custom-cta');

    function formatCurrency(value) {
        return '$' + value.toLocaleString();
    }

    function getNumericValue(input) {
        if (!input) {
            return 0;
        }

        const value = parseInt(input.value, 10);
        return Number.isNaN(value) ? 0 : Math.max(value, 0);
    }

    function getMonthlyAdSpend() {
        return getNumericValue(monthlyAdSpendInput);
    }

    function getEmailSubscribers() {
        return getNumericValue(emailSubscribersInput);
    }

    function getEmailMarketingEstimate(basePrice, subscribers) {
        if (subscribers <= 5000) {
            return basePrice;
        }
        if (subscribers <= 10000) {
            return 700;
        }
        if (subscribers <= 25000) {
            return 1000;
        }
        if (subscribers <= 50000) {
            return 1500;
        }
        return 2200;
    }

    function getSpendBasedEstimate(serviceName, basePrice, monthlyAdSpend) {
        const multipliers = {
            'Meta Ads Management': 0.08,
            'Google Ads Management': 0.08,
            'CRO and Testing': 0.03,
            'Ad Creative Design': 0.025,
            'Website Optimization': 0.04,
            'Ad Copy Writing': 0.015
        };

        const multiplier = multipliers[serviceName];
        if (!multiplier) {
            return basePrice;
        }

        return Math.max(basePrice, Math.round(monthlyAdSpend * multiplier));
    }

    function getServiceEstimate(checkbox) {
        const basePrice = parseInt(checkbox.getAttribute('data-price'), 10) || 0;
        const serviceType = checkbox.getAttribute('data-type');
        const serviceName = checkbox.getAttribute('data-service');
        const monthlyAdSpend = getMonthlyAdSpend();
        const emailSubscribers = getEmailSubscribers();

        if (serviceType === 'ads-management' || serviceType === 'spend-based') {
            return getSpendBasedEstimate(serviceName, basePrice, monthlyAdSpend);
        }

        if (serviceType === 'email-marketing') {
            return getEmailMarketingEstimate(basePrice, emailSubscribers);
        }

        return basePrice;
    }

    function updateServiceCardPrices() {
        serviceCheckboxes.forEach(checkbox => {
            const label = checkbox.nextElementSibling;
            const priceElement = label.querySelector('.service-price');
            const estimate = getServiceEstimate(checkbox);
            const serviceType = checkbox.getAttribute('data-type');

            if (serviceType === 'ads-management' || serviceType === 'spend-based' || serviceType === 'email-marketing') {
                priceElement.textContent = `Estimate ${formatCurrency(estimate)}/month`;
            } else {
                priceElement.textContent = `${formatCurrency(estimate)}/month`;
            }
        });
    }

    function updateServicesSummary() {
        const selectedServices = [];
        let totalCost = 0;

        updateServiceCardPrices();

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
                estimateNoteElement.textContent = 'Adjust your ad spend and subscriber count, then select services to build your estimate.';
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
                estimateNoteElement.textContent = `Current estimate uses ${formatCurrency(getMonthlyAdSpend())}/month in paid ad spend and ${getEmailSubscribers().toLocaleString()} email subscribers. Final pricing is confirmed after strategy review.`;
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
        checkbox.addEventListener('change', updateServicesSummary);
    });

    if (monthlyAdSpendInput) {
        monthlyAdSpendInput.addEventListener('input', updateServicesSummary);
    }

    if (emailSubscribersInput) {
        emailSubscribersInput.addEventListener('input', updateServicesSummary);
    }

    updateServicesSummary();
}
