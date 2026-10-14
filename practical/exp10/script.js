const products = [{"name": "Chocolate Truffle", "category": "Chocolate", "price": 650, "desc": "Rich chocolate layers with silky ganache.", "emoji": "🍫"}, {"name": "Birthday Confetti", "category": "Birthday", "price": 850, "desc": "Vanilla sponge, buttercream and colorful sprinkles.", "emoji": "🎂"}, {"name": "Rose Wedding Cake", "category": "Wedding", "price": 2400, "desc": "Elegant floral finish for your special day.", "emoji": "🌹"}, {"name": "Mini Cupcake Box", "category": "Cupcakes", "price": 399, "desc": "Six soft cupcakes with assorted toppings.", "emoji": "🧁"}, {"name": "Red Velvet", "category": "Birthday", "price": 720, "desc": "Velvety cocoa cake with cream cheese frosting.", "emoji": "🍰"}, {"name": "Dark Cocoa Cake", "category": "Chocolate", "price": 780, "desc": "A deep cocoa flavor for chocolate lovers.", "emoji": "🍫"}];
const kind = "cake";
const cart = [];
const orders = [];
const grid = document.getElementById("productGrid");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const sortFilter = document.getElementById("sortFilter");
const cartCount = document.getElementById("cartCount");
const dialog = document.getElementById("checkoutDialog");
const toast = document.getElementById("toast");
const orderPanel = document.getElementById("orderPanel");

const money = value => "₹" + value.toLocaleString("en-IN");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2300);
}

function setupCategories() {
  const categories = [...new Set(products.map(product => product.category))];
  categoryFilter.innerHTML = '<option value="All">All categories</option>' + categories.map(category => `<option value="${category}">${category}</option>`).join("");
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  let visible = products.filter(product => {
    const matchesCategory = categoryFilter.value === "All" || product.category === categoryFilter.value;
    const matchesSearch = `${product.name} ${product.category} ${product.desc}`.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  });
  if (sortFilter.value === "low") visible.sort((a, b) => a.price - b.price);
  if (sortFilter.value === "high") visible.sort((a, b) => b.price - a.price);
  grid.innerHTML = visible.length ? visible.map(product => `
    <article class="product-card">
      <div class="product-visual"><span class="category-pill">${product.category}</span><span class="product-emoji">${product.emoji}</span></div>
      <div class="product-info"><h3>${product.name}</h3><p>${product.desc}</p>
        <div class="product-bottom"><span class="price">${money(product.price)}</span><button class="add-button" data-name="${product.name}" aria-label="Add ${product.name}">+</button></div>
      </div>
    </article>`).join("") : '<div class="empty-state">No matches found. Try another search or category.</div>';
  grid.querySelectorAll(".add-button").forEach(button => button.addEventListener("click", () => addToCart(button.dataset.name)));
}

function addToCart(name) {
  const product = products.find(item => item.name === name);
  const existing = cart.find(item => item.name === name);
  if (existing) existing.quantity += 1;
  else cart.push({...product, quantity: 1});
  updateCart();
  showToast(`${name} added to your cart`);
}

function updateCart() {
  cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartItems").innerHTML = cart.length ? cart.map(item => `
    <div class="cart-line"><span>${item.emoji} ${item.name} × ${item.quantity}</span><strong>${money(item.price * item.quantity)}</strong></div>`).join("") : '<p class="muted">Your cart is empty.</p>';
  document.getElementById("cartTotal").textContent = money(cart.reduce((total, item) => total + item.price * item.quantity, 0));
}

function renderOrders() {
  if (!orders.length) {
    orderPanel.innerHTML = '<p class="muted">Your bookings and orders will appear here.</p>';
    return;
  }
  orderPanel.innerHTML = orders.slice().reverse().map(order => `
    <div class="order-item"><div><strong>${order.reference}</strong><div class="muted">${order.summary}</div><div class="muted">${order.customer} · ${order.extra}</div></div><span class="status">${order.status}</span></div>`).join("");
}

document.getElementById("cartButton").addEventListener("click", () => {
  updateCart();
  dialog.showModal();
});
document.getElementById("closeDialog").addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
sortFilter.addEventListener("change", renderProducts);

document.getElementById("checkoutForm").addEventListener("submit", event => {
  event.preventDefault();
  if (!cart.length) {
    showToast("Add an item before checking out");
    return;
  }
  const customer = document.getElementById("customerName").value.trim();
  const contact = document.getElementById("customerContact").value.trim();
  const extra = document.getElementById("customerExtra").value.trim();
  const summary = cart.map(item => `${item.name} × ${item.quantity}`).join(", ");
  orders.push({
    reference: "ORD-" + Math.floor(10000 + Math.random() * 90000),
    summary,
    customer,
    extra: `${contact} · ${extra}`,
    status: kind === "beauty" || kind === "hospital" ? "Requested" : "Order placed"
  });
  cart.length = 0;
  updateCart();
  renderOrders();
  event.target.reset();
  dialog.close();
  showToast(kind === "beauty" || kind === "hospital" ? "Appointment request saved" : "Order placed successfully");
  document.getElementById("orders").scrollIntoView({behavior: "smooth"});
});

setupCategories();
renderProducts();
updateCart();
renderOrders();
