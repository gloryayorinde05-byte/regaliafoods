/* =========================================================
   REGALIA FOODS — Site behavior
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  bindNav();
  bindCartDrawer();
  renderCartDrawer();

  if (document.querySelector("[data-store-page]")) {
    initStorePage();
  }
  if (document.querySelector("[data-checkout-page]")) {
    initCheckoutPage();
  }
  if (document.querySelector("[data-thankyou-page]")) {
    initThankYouPage();
  }
});

/* ---------------- Nav ---------------- */
function bindNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
  }
}

/* ---------------- Cart drawer (present on every page) ---------------- */
function bindCartDrawer() {
  const drawer = document.querySelector(".cart-drawer");
  const overlay = document.querySelector(".overlay");
  if (!drawer || !overlay) return;

  document.querySelectorAll("[data-open-cart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      drawer.classList.add("open");
      overlay.classList.add("open");
      document.body.style.overflow = "hidden";
    });
  });

  const closeDrawer = () => {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  };

  overlay.addEventListener("click", closeDrawer);
  const closeBtn = document.querySelector(".cart-close");
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);
}

function renderCartDrawer() {
  const container = document.querySelector("[data-cart-items]");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const footEl = document.querySelector("[data-cart-foot]");
  if (!container) return;

  const lines = getCartLines();

  if (lines.length === 0) {
    container.innerHTML = `
      <div class="cart-empty">
        ${REGALIA_ICONS.produce}
        <p>Your basket is empty.</p>
      </div>`;
    if (footEl) footEl.style.display = "none";
    return;
  }

  if (footEl) footEl.style.display = "block";

  container.innerHTML = lines
    .map(
      (line) => `
    <div class="cart-item" data-line="${line.product.id}">
      <div class="cart-item-icon">${REGALIA_ICONS[line.product.category]}</div>
      <div class="cart-item-info">
        <h4>${line.product.name}</h4>
        <span>${line.qty} × ${formatNaira(line.product.price)} (${line.product.unit})</span>
        <br/>
        <button class="cart-item-remove" data-remove="${line.product.id}">Remove</button>
      </div>
      <div class="cart-item-price">${formatNaira(line.lineTotal)}</div>
    </div>`
    )
    .join("");

  container.querySelectorAll("[data-remove]").forEach((btn) => {
    btn.addEventListener("click", () => {
      removeFromCart(btn.getAttribute("data-remove"));
      renderCartDrawer();
      if (document.querySelector("[data-checkout-page]")) renderCheckoutSummary();
      if (document.querySelector("[data-store-page]")) syncProductQtyInputs();
    });
  });

  if (subtotalEl) subtotalEl.textContent = formatNaira(getCartSubtotal());
}

/* ---------------- Store / Home page ---------------- */
let activeCategory = "all";

function initStorePage() {
  renderProductGrid();
  renderFilterChips();
}

function renderFilterChips() {
  const row = document.querySelector("[data-filter-row]");
  if (!row) return;
  const chips = [{ id: "all", label: "All Products" }, ...REGALIA_CATEGORIES];
  row.innerHTML = chips
    .map(
      (c) =>
        `<button class="chip${c.id === activeCategory ? " active" : ""}" data-filter="${c.id}">${c.label}</button>`
    )
    .join("");
  row.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeCategory = btn.getAttribute("data-filter");
      renderFilterChips();
      renderProductGrid();
    });
  });
}

function renderProductGrid() {
  const grid = document.querySelector("[data-product-grid]");
  if (!grid) return;
  const products =
    activeCategory === "all"
      ? REGALIA_PRODUCTS
      : REGALIA_PRODUCTS.filter((p) => p.category === activeCategory);

  const cart = getCart();

  grid.innerHTML = products
    .map((p) => {
      const catLabel = REGALIA_CATEGORIES.find((c) => c.id === p.category).label;
      const currentQty = cart[p.id] || 0;
      return `
      <article class="product-card">
        <div class="product-icon-wrap">
          <span class="product-tag">${catLabel}</span>
          ${REGALIA_ICONS[p.category]}
        </div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-unit">${p.desc}</p>
        <div class="product-price">${formatNaira(p.price)} <span style="color:var(--stone); font-weight:400; font-size:0.75rem;">/ ${p.unit}</span></div>
        ${currentQty > 0 ? `<p style="font-size:0.78rem; color:var(--green-mid); margin:-6px 0 0; font-weight:600;">${currentQty} already in basket</p>` : ""}
        <div class="product-foot">
          <div class="qty-stepper" data-stepper="${p.id}">
            <button type="button" data-step="-1" aria-label="Decrease quantity">−</button>
            <input type="text" inputmode="numeric" value="1" data-qty-input aria-label="Quantity to add" />
            <button type="button" data-step="1" aria-label="Increase quantity">+</button>
          </div>
          <button class="add-btn" data-add="${p.id}">${currentQty > 0 ? "Add more" : "Add to basket"}</button>
        </div>
      </article>`;
    })
    .join("");

  grid.querySelectorAll("[data-stepper]").forEach((stepper) => {
    const input = stepper.querySelector("[data-qty-input]");
    stepper.querySelectorAll("[data-step]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const delta = parseInt(btn.getAttribute("data-step"), 10);
        const next = Math.max(1, parseInt(input.value || "1", 10) + delta);
        input.value = next;
      });
    });
    input.addEventListener("change", () => {
      const val = Math.max(1, parseInt(input.value || "1", 10) || 1);
      input.value = val;
    });
  });

  grid.querySelectorAll("[data-add]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-add");
      const stepper = grid.querySelector(`[data-stepper="${id}"] [data-qty-input]`);
      const qty = parseInt(stepper.value || "1", 10) || 1;
      addToCart(id, qty);
      renderCartDrawer();
      btn.textContent = "Added ✓";
      btn.classList.add("added");
      showToast(`${REGALIA_PRODUCTS.find((p) => p.id === id).name} added to basket`);
      setTimeout(() => {
        btn.textContent = "Add more";
        btn.classList.remove("added");
      }, 1400);
    });
  });
}

function syncProductQtyInputs() {
  if (document.querySelector("[data-store-page]")) renderProductGrid();
}

/* ---------------- Checkout page ---------------- */
function initCheckoutPage() {
  renderCheckoutSummary();

  const form = document.querySelector("#checkout-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    handlePaystackCheckout(form);
  });
}

function renderCheckoutSummary() {
  const wrap = document.querySelector("[data-checkout-lines]");
  const subtotalEl = document.querySelector("[data-checkout-subtotal]");
  const deliveryEl = document.querySelector("[data-checkout-delivery]");
  const totalEl = document.querySelector("[data-checkout-total]");
  const payBtn = document.querySelector("#pay-btn");
  if (!wrap) return;

  const lines = getCartLines();
  const subtotal = getCartSubtotal();
  const deliveryFee = getSelectedDeliveryFee();
  const total = subtotal + deliveryFee;

  if (lines.length === 0) {
    wrap.innerHTML = `<p style="color:var(--stone);">Your basket is empty. <a href="index.html" style="color:var(--green-deep); font-weight:600;">Go back to the store</a> to add some items.</p>`;
    if (payBtn) payBtn.setAttribute("disabled", "disabled");
  } else {
    wrap.innerHTML = lines
      .map(
        (l) => `
      <div class="summary-line-item">
        <span>${l.qty} × ${l.product.name}</span>
        <span>${formatNaira(l.lineTotal)}</span>
      </div>`
      )
      .join("");
    if (payBtn) payBtn.removeAttribute("disabled");
  }

  if (subtotalEl) subtotalEl.textContent = formatNaira(subtotal);
  if (deliveryEl) deliveryEl.textContent = deliveryFee === 0 ? "Free" : formatNaira(deliveryFee);
  if (totalEl) totalEl.textContent = formatNaira(total);
}

function getSelectedDeliveryFee() {
  const checked = document.querySelector('input[name="delivery"]:checked');
  if (!checked) return 0;
  return parseInt(checked.getAttribute("data-fee") || "0", 10);
}

document.addEventListener("change", (e) => {
  if (e.target && e.target.name === "delivery") {
    renderCheckoutSummary();
  }
});

function handlePaystackCheckout(form) {
  const name = form.querySelector("#customer-name").value.trim();
  const email = form.querySelector("#customer-email").value.trim();
  const phone = form.querySelector("#customer-phone").value.trim();
  const deliveryChecked = form.querySelector('input[name="delivery"]:checked');
  const address = form.querySelector("#customer-address");

  if (!name || !email || !phone || !deliveryChecked) {
    showToast("Please fill in all required fields.");
    return;
  }

  if (deliveryChecked.value === "delivery" && address && !address.value.trim()) {
    showToast("Please add a delivery address.");
    address.focus();
    return;
  }

  const subtotal = getCartSubtotal();
  const deliveryFee = getSelectedDeliveryFee();
  const total = subtotal + deliveryFee;

  if (total <= 0) {
    showToast("Your basket is empty.");
    return;
  }

  if (typeof PaystackPop === "undefined") {
    showToast("Payment service failed to load. Check your connection and try again.");
    return;
  }

  // ⚠️ Replace with your live/test PUBLIC key from the Paystack dashboard.
  const PAYSTACK_PUBLIC_KEY = "pk_test_00000000000000000000000000000000";

  const orderRef = "REGALIA_" + Date.now();
  const lines = getCartLines();

  const handler = PaystackPop.setup({
    key: PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: total * 100, // Paystack expects kobo
    currency: "NGN",
    ref: orderRef,
    metadata: {
      custom_fields: [
        { display_name: "Customer Name", variable_name: "customer_name", value: name },
        { display_name: "Phone", variable_name: "phone", value: phone },
        { display_name: "Delivery Method", variable_name: "delivery_method", value: deliveryChecked.value },
        {
          display_name: "Order Items",
          variable_name: "order_items",
          value: lines.map((l) => `${l.qty}x ${l.product.name}`).join(", "),
        },
      ],
    },
    callback: function (response) {
      sessionStorage.setItem(
        "regalia_last_order",
        JSON.stringify({
          ref: response.reference,
          name,
          email,
          phone,
          total,
          items: lines.map((l) => ({ name: l.product.name, qty: l.qty })),
        })
      );
      clearCart();
      window.location.href = "thankyou.html?ref=" + encodeURIComponent(response.reference);
    },
    onClose: function () {
      showToast("Payment window closed. Your basket is still saved.");
    },
  });

  handler.openIframe();
}

/* ---------------- Thank you page ---------------- */
function initThankYouPage() {
  const refEl = document.querySelector("[data-order-ref]");
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (refEl) refEl.textContent = ref || "—";

  const detailWrap = document.querySelector("[data-order-detail]");
  try {
    const saved = JSON.parse(sessionStorage.getItem("regalia_last_order") || "null");
    if (saved && detailWrap) {
      detailWrap.innerHTML = `
        <div class="summary-row"><span>Name</span><span>${saved.name}</span></div>
        <div class="summary-row"><span>Phone</span><span>${saved.phone}</span></div>
        <div class="summary-row total"><span>Total Paid</span><span>${formatNaira(saved.total)}</span></div>
      `;
    }
  } catch (e) {}
}
