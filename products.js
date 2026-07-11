/* =========================================================
   REGALIA FOODS — Product Catalog
   Edit prices, units, or descriptions any time — the store
   re-renders straight from this file. Prices are in Naira (₦).
   ========================================================= */

const REGALIA_CATEGORIES = [
  { id: "grains", label: "Grains & Flours" },
  { id: "produce", label: "Fresh Produce" },
  { id: "oils", label: "Oils" },
  { id: "spices", label: "Spices & Pepper" },
  { id: "drinks", label: "Drinks" },
];

const REGALIA_PRODUCTS = [
  { id: "beans-brown", name: "Brown Beans", category: "grains", unit: "per derica", price: 1500, desc: "Well-sorted, stone-free brown beans for pottage or moi-moi." },
  { id: "beans-flour", name: "Beans Flour", category: "grains", unit: "per 1kg", price: 2200, desc: "Milled beans flour for a quicker moi-moi or akara batter." },
  { id: "wheat-flour", name: "Wheat Flour", category: "grains", unit: "per 1kg", price: 1800, desc: "Fine wheat flour for swallow, baking, or thickening soups." },
  { id: "amala-flour", name: "Amala Flour (Elubo)", category: "grains", unit: "per 1kg", price: 2500, desc: "Traditional yam flour, smooth-milled for classic amala." },
  { id: "rice", name: "Rice", category: "grains", unit: "per derica", price: 1700, desc: "Clean long-grain rice, sorted and de-stoned." },
  { id: "garri", name: "Garri", category: "grains", unit: "per derica", price: 900, desc: "Fine white or yellow garri, ready for eba or soaking." },
  { id: "corn", name: "Corn (Maize)", category: "grains", unit: "per derica", price: 1200, desc: "Dried whole maize, great for pap or roasting." },
  { id: "corn-flour", name: "Corn Flour (Pap/Ogi Base)", category: "grains", unit: "per 1kg", price: 1700, desc: "Finely milled corn flour, the base for pap and ogi." },
  { id: "ugu", name: "Ugu (Fluted Pumpkin Leaves)", category: "produce", unit: "per bunch", price: 700, desc: "Freshly cut ugu, picked for soups like edikang ikong." },
  { id: "waterleaf", name: "Waterleaf", category: "produce", unit: "per bunch", price: 500, desc: "Tender waterleaf, a soft-soup staple." },
  { id: "fresh-pepper", name: "Fresh Pepper", category: "produce", unit: "per kg", price: 2000, desc: "A mix of tatashe and rodo, sold fresh off the market run." },
  { id: "tomatoes", name: "Tomatoes", category: "produce", unit: "per kg", price: 1500, desc: "Ripe, firm tomatoes for stew and sauce." },
  { id: "grinded-pepper", name: "Grinded Pepper", category: "spices", unit: "per 500g", price: 2800, desc: "Dried pepper, milled fine and packed airtight." },
  { id: "palm-oil", name: "Palm Oil", category: "oils", unit: "per litre", price: 2200, desc: "Unadulterated red palm oil, bottled fresh." },
  { id: "vegetable-oil", name: "Vegetable Oil", category: "oils", unit: "per litre", price: 2000, desc: "Everyday vegetable oil for frying and cooking." },
  { id: "dr-pepper", name: "Dr Pepper", category: "drinks", unit: "60cl bottle", price: 600, desc: "Chilled and ready to grab on your way out." },
];

/* ---------------------------------------------------------
   Icon set — one clean line-icon per category, reused across
   product cards, cart items, and the checkout summary.
   --------------------------------------------------------- */
const REGALIA_ICONS = {
  grains: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 6C24 6 32 14 32 24C32 31.7 28.4 38 24 42C19.6 38 16 31.7 16 24C16 14 24 6 24 6Z" stroke="#1F6B45" stroke-width="2.2"/><path d="M24 10V38" stroke="#C6912F" stroke-width="2"/><path d="M24 16C24 16 20 18 19 22" stroke="#1F6B45" stroke-width="1.6" stroke-linecap="round"/><path d="M24 16C24 16 28 18 29 22" stroke="#1F6B45" stroke-width="1.6" stroke-linecap="round"/><path d="M24 24C24 24 19.5 26.3 18.5 30.5" stroke="#1F6B45" stroke-width="1.6" stroke-linecap="round"/><path d="M24 24C24 24 28.5 26.3 29.5 30.5" stroke="#1F6B45" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  produce: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24 42C24 42 10 33.5 10 20C10 13 15 8 22 9C22 9 20 18 24 24C28 18 26 9 26 9C33 8 38 13 38 20C38 33.5 24 42 24 42Z" stroke="#2F8F5B" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 24V38" stroke="#1F6B45" stroke-width="2"/></svg>`,
  oils: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 6H29V13L34 20V40C34 41.1 33.1 42 32 42H16C14.9 42 14 41.1 14 40V20L19 13V6Z" stroke="#C6912F" stroke-width="2.2" stroke-linejoin="round"/><path d="M14 26H34" stroke="#C6912F" stroke-width="1.6"/><path d="M19 6H29" stroke="#C6912F" stroke-width="2.2"/></svg>`,
  spices: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 20C14 14 18.5 10 24 10C29.5 10 34 14 34 20C34 28 24 40 24 40C24 40 14 28 14 20Z" stroke="#B23A2E" stroke-width="2.2" stroke-linejoin="round"/><path d="M24 10C24 10 22 6 26 4" stroke="#1F6B45" stroke-width="2" stroke-linecap="round"/></svg>`,
  drinks: `<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 6H31L29 16C31.5 18 33 21.6 33 26C33 33.7 29 40 24 40C19 40 15 33.7 15 26C15 21.6 16.5 18 19 16L17 6Z" stroke="#B23A2E" stroke-width="2.2" stroke-linejoin="round"/><path d="M17.5 9H30.5" stroke="#B23A2E" stroke-width="1.6"/></svg>`,
};

const REGALIA_SEAL = `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="56" stroke="#E8C874" stroke-width="1.4" stroke-dasharray="2 6"/>
  <circle cx="60" cy="60" r="44" stroke="#E8C874" stroke-width="1.2"/>
  <path d="M60 22C60 22 76 34 76 54C76 72 68 84 60 92C52 84 44 72 44 54C44 34 60 22 60 22Z" stroke="#E8C874" stroke-width="1.6"/>
  <path d="M60 30V88" stroke="#E8C874" stroke-width="1"/>
</svg>`;

const REGALIA_LOGO_MARK = `<svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="20" cy="20" r="18.5" stroke="#C6912F" stroke-width="1.4"/>
  <path d="M20 8C20 8 29 15 29 24C29 31 25 36 20 39C15 36 11 31 11 24C11 15 20 8 20 8Z" fill="#123B29"/>
  <path d="M20 12V37" stroke="#E8C874" stroke-width="1"/>
</svg>`;
