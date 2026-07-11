/* =========================================================
   REGALIA FOODS — Basket (cart) logic
   Persisted to localStorage so it survives page navigation
   and refreshes on the deployed site.
   ========================================================= */

const CART_KEY = "regalia_cart_v1";
const DELIVERY_KEY = "regalia_delivery_v1";

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateBasketCount();
}

function addToCart(productId, qty) {
  qty = qty || 1;
  const cart = getCart();
  cart[productId] = (cart[productId] || 0) + qty;
  saveCart(cart);
  return cart[productId];
}

function setQty(productId, qty) {
  const cart = getCart();
  if (qty <= 0) {
    delete cart[productId];
  } else {
    cart[productId] = qty;
  }
  saveCart(cart);
}

function removeFromCart(productId) {
  const cart = getCart();
  delete cart[productId];
  saveCart(cart);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateBasketCount();
}

function getCartCount() {
  const cart = getCart();
  return Object.values(cart).reduce((sum, q) => sum + q, 0);
}

function getCartLines() {
  const cart = getCart();
  return Object.keys(cart)
    .map((id) => {
      const product = REGALIA_PRODUCTS.find((p) => p.id === id);
      if (!product) return null;
      return { product, qty: cart[id], lineTotal: product.price * cart[id] };
    })
    .filter(Boolean);
}

function getCartSubtotal() {
  return getCartLines().reduce((sum, l) => sum + l.lineTotal, 0);
}

function formatNaira(amount) {
  return "₦" + Number(amount).toLocaleString("en-NG");
}

function updateBasketCount() {
  document.querySelectorAll("[data-basket-count]").forEach((el) => {
    const count = getCartCount();
    el.textContent = count;
    el.style.display = count > 0 ? "inline-flex" : "none";
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

document.addEventListener("DOMContentLoaded", updateBasketCount);
