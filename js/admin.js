// Mini Punjab Admin Dashboard Logic
// Supabase Integration

// State Management
let menuItems = [];

async function fetchMenu() {
    const { data, error } = await window.supabaseClient
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching menu:', error);
        return;
    }
    menuItems = data;
    renderAll();
}

async function checkAuth() {
    const passInput = document.getElementById('adminPass');
    const errorMsg = document.getElementById('errorMsg');

    // Simple password check for now, can be replaced with Supabase Auth
    if (passInput.value === "minipunjab2026") {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        sessionStorage.setItem('is_admin', 'true');
        await fetchMenu();
    } else {
        errorMsg.style.display = 'block';
        passInput.value = '';
        passInput.focus();
    }
}

function logout() {
    sessionStorage.removeItem('is_admin');
    window.location.reload();
}

function updateStats() {
    const totalEl = document.getElementById('totalItems');
    const riceEl = document.getElementById('riceCount');
    const mainEl = document.getElementById('mainCount');

    if (totalEl) totalEl.innerText = menuItems.length;
    // Categories matching the database structure
    if (riceEl) riceEl.innerText = menuItems.filter(i => i.category === 'rice' || i.category === 'chinese_rice').length;
    if (mainEl) mainEl.innerText = menuItems.filter(i => i.category === 'paneer' || i.category === 'veg' || i.category === 'mini_punjab').length;
}

function getCategoryName(cat) {
    const names = {
        soup: 'Soup',
        chinese: 'Chinese',
        noodles: 'Chinese noodles',
        chinese_rice: 'Chinese Rice',
        biryani: 'Pulav/Biryani',
        papad: 'Papad/salad',
        tandur: 'Tandur Ka kamal (Evening)',
        chapati: 'Chapati (Noon)',
        dal: 'Dal ka kamal',
        mini_punjab: 'Sp. Mini Punjab',
        paneer: 'Paneer ka kamal',
        veg: 'Sp. veg. Sabji',
        jain: 'Jain'
    };
    return names[cat] || cat;
}

function renderCustomerGrid() {
    const grid = document.getElementById('menuGrid');
    if (!grid) return;
    grid.innerHTML = menuItems.map(item => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                <img src="${item.image_url}" class="card-img-top" style="height: 180px; object-fit: cover;">
                <div class="card-body">
                    <h6 class="fw-bold mb-1">${item.name}</h6>
                    <p class="text-danger fw-bold mb-1">₹${item.price}</p>
                    <span class="badge bg-light text-dark border small">${getCategoryName(item.category)}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAdminGrid() {
    const grid = document.getElementById('adminGrid');
    if (!grid) return;
    grid.innerHTML = menuItems.map(item => `
        <div class="col-md-4 mb-4">
            <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden bg-light">
                <div class="position-absolute top-0 end-0 p-2" style="z-index: 5;">
                    <button onclick="removeItem('${item.id}', '${item.image_url}', ${item.isLocal || false})" class="btn btn-danger btn-sm rounded-circle">
                        <i class="fas fa-trash"></i>
                    </button>
                    ${item.isLocal ? '<span class="badge bg-warning text-dark position-absolute top-100 start-50 translate-middle-x mt-2">Local File</span>' : ''}
                </div>
                <img src="${item.image_url}" class="card-img-top" style="height: 150px; object-fit: cover; opacity: 0.8;">
                <div class="card-body p-3">
                    <h6 class="fw-bold mb-0 small text-truncate">${item.name}</h6>
                    <p class="text-muted small mb-0">₹${item.price}</p>
                </div>
            </div>
        </div>
    `).join('');
}

function renderAll() {
    renderCustomerGrid();
    renderAdminGrid();
    updateStats();
}

async function removeItem(id, imageUrl) {
    if (confirm('Delete this item from menu?')) {
        const { error } = await window.supabaseClient
            .from('menu_items')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Error deleting item: ' + error.message);
            return;
        }

        // Optional: Delete from storage if you want to be clean
        // Note: You'd need to parse the filename from imageUrl

        await fetchMenu();
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', async () => {
    const addForm = document.getElementById('addItemForm');

    if (addForm) {
        addForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const submitBtn = addForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Adding...';

            const name = document.getElementById('itemName').value;
            const price = document.getElementById('itemPrice').value;
            const category = document.getElementById('itemCategory').value;
            const imageFile = document.getElementById('itemImage').files[0];

            if (!imageFile) {
                alert('Please select an image');
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Add to Menu';
                return;
            }

            try {
                // 1. Upload Image to Supabase Storage
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `menu/${fileName}`;

                const { data: uploadData, error: uploadError } = await window.supabaseClient
                    .storage
                    .from('menu-images')
                    .upload(filePath, imageFile);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: { publicUrl } } = window.supabaseClient
                    .storage
                    .from('menu-images')
                    .getPublicUrl(filePath);

                // 3. Save to Database
                const { error: dbError } = await window.supabaseClient
                    .from('menu_items')
                    .insert([{
                        name: name,
                        price: parseFloat(price),
                        category: category,
                        image_url: publicUrl
                    }]);

                if (dbError) throw dbError;

                alert('Item added successfully!');
                addForm.reset();
                await fetchMenu();

            } catch (err) {
                console.error(err);
                alert('Error: ' + err.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Add to Menu';
            }
        });
    }

    // Auto-login if session exists
    if (sessionStorage.getItem('is_admin') === 'true' && document.getElementById('adminPanel')) {
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'block';
        await fetchMenu();
    }
});

// Expose functions globally
window.checkAuth = checkAuth;
window.logout = logout;
window.removeItem = removeItem;
