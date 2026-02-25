// Mini Punjab Menu & Cart Logic

const WHATSAPP_NUMBER = "918320201186";
let cart = [];

function updateCartUI() {
    const countElement = document.getElementById('cartCount');
    if (countElement) countElement.textContent = cart.length;

    const cartSummary = document.getElementById('cartSummary');
    if (cartSummary) {
        if (cart.length > 0) {
            const itemsList = cart.map(item => `- ${item.name} (₹${item.price})`).join('%0A');
            const waText = `Hi Mini Punjab, I'd like to order:%0A%0A${itemsList}%0A%0ATotal: ₹${cart.reduce((sum, i) => sum + Number(i.price), 0)}%0A%0AAvailable for takeaway?`;
            cartSummary.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;
            cartSummary.style.animation = "pulse 1.5s infinite";
        } else {
            cartSummary.href = "#";
            cartSummary.style.animation = "none";
        }
    }
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCartUI();

    // Toast Feedback
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 start-50 translate-middle-x bg-dark text-white p-3 rounded-pill mb-5 shadow-lg';
    toast.style.zIndex = "2000";
    toast.style.transition = "0.5s";
    toast.innerHTML = `✅ Added <b>${name}</b> to order`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}

// Menu Data Visualization (for dynamically added items)
function renderDynamicMenu() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    // Get items from admin panel's storage
    const dynamicItems = JSON.parse(localStorage.getItem('miniPunjabMenu')) || [];

    // This function can be expanded to merge static HTML with dynamic items
    // For now, we rely on the logic in menu.html
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Button interactions
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-add-to-cart')) {
            const name = e.target.dataset.name;
            const price = e.target.dataset.price;
            addToCart(name, price);
        }
    });

    // 2. Filter Logic
    const filterBadges = document.querySelectorAll('.filter-tags .badge');
    filterBadges.forEach(badge => {
        badge.addEventListener('click', () => {
            filterBadges.forEach(b => b.classList.remove('active', 'bg-danger'));
            filterBadges.forEach(b => b.classList.add('bg-secondary'));

            badge.classList.remove('bg-secondary');
            badge.classList.add('active', 'bg-danger');

            const filter = badge.dataset.filter;
            document.querySelectorAll('.menu-item').forEach(item => {
                const tags = item.dataset.tags || '';
                if (filter === 'all' || tags.includes(filter)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
});
