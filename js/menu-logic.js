// Mini Punjab Menu Logic - Supabase Version

let menuItems = [];

document.addEventListener('DOMContentLoaded', async function () {
    await fetchMenuItems();

    // Customer Features
    const menuSearch = document.getElementById('menuSearch');
    if (menuSearch) menuSearch.addEventListener('input', filterCustomerMenu);

    document.querySelectorAll('#quickFilters .badge').forEach(btn => {
        btn.addEventListener('click', function () {
            const active = document.querySelector('#quickFilters .active');
            if (active) active.classList.remove('active');
            this.classList.add('active');
            renderCustomerView();
        });
    });
});

async function fetchMenuItems() {
    let supabaseItems = [];
    try {
        const { data, error } = await window.supabaseClient
            .from('menu_items')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        supabaseItems = data;
    } catch (error) {
        console.error('Supabase fetch error:', error);
    }

    // Purana Data (LocalStorage)
    const localItems = JSON.parse(localStorage.getItem('miniPunjabMenu')) || [];

    // Donon ko merge karna (image handling ke saath)
    const normalizedLocal = localItems.map(item => ({
        ...item,
        image_url: item.image_url || item.image || 'images/default_dish.png'
    }));

    // Combine: Naya data pehle, fir purana
    menuItems = [...supabaseItems, ...normalizedLocal];
    renderCustomerView();
}

function renderCustomerView() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;

    const activeFilterBadge = document.querySelector('#quickFilters .badge.active');
    const activeFilter = activeFilterBadge ? activeFilterBadge.dataset.filter : 'all';

    const filteredItems = menuItems.filter(item =>
        activeFilter === 'all' || item.category === activeFilter
    );

    if (filteredItems.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">No items found in this category.</p></div>';
        return;
    }

    grid.innerHTML = filteredItems.map(item => `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <img src="${item.image_url}" class="card-img-top" style="height: 200px; object-fit: cover;" 
                     onerror="this.src='images/default_dish.png'">
                <div class="card-body">
                    <h5 class="fw-bold mb-1">${item.name}</h5>
                    <p class="text-danger fw-bold fs-5 mb-2">₹${item.price}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-${getCategoryColor(item.category)}">${getCategoryName(item.category)}</span>
                        <button class="btn btn-outline-danger btn-sm rounded-pill btn-add-to-cart" 
                                 data-name="${item.name}" data-price="${item.price}">Add to Order</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function filterCustomerMenu() {
    const searchTerm = document.getElementById('menuSearch').value.toLowerCase();
    renderCustomerView();
    if (searchTerm) {
        document.querySelectorAll('#menuGrid .card').forEach(card => {
            const name = card.querySelector('h5').textContent.toLowerCase();
            const col = card.closest('.col-lg-3');
            if (col) col.style.display = name.includes(searchTerm) ? '' : 'none';
        });
    }
}

function getCategoryColor(cat) {
    const colors = {
        soup: 'info',
        chinese: 'danger',
        noodles: 'warning text-dark',
        rice: 'success',
        pulav_biryani: 'primary',
        papad_salad: 'secondary',
        tandoor: 'dark',
        chapati: 'warning text-dark',
        dal: 'warning',
        mini_punjab: 'danger',
        paneer: 'success',
        veg: 'success',
        jain: 'info'
    };
    return colors[cat] || 'secondary';
}

function getCategoryName(cat) {
    const names = {
        soup: 'Soup',
        chinese: 'Chinese',
        noodles: 'Chinese noodles',
        rice: 'Chinese Rice',
        pulav_biryani: 'Pulav/Biryani',
        papad_salad: 'Papad/salad',
        tandoor: 'Tandur Ka kamal (Evening)',
        chapati: 'Chapati (Noon)',
        dal: 'Dal ka kamal',
        mini_punjab: 'Sp. Mini Punjab',
        paneer: 'Paneer ka kamal',
        veg: 'Sp. veg. Sabji',
        jain: 'Jain'
    };
    return names[cat] || cat;
}

