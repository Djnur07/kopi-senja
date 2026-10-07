// ====== DATA MENU ======
const menu = [
  { id: 1,  nama: "Espresso",            kategori: "kopi",    harga: 18000, gambar: "assets/img/menu/espresso.jpg" },
  { id: 2,  nama: "Americano",           kategori: "kopi",    harga: 20000, gambar: "assets/img/menu/americano.jpg" },
  { id: 3,  nama: "Café Latte",          kategori: "kopi",    harga: 25000, gambar: "assets/img/menu/cafe-latte.jpg" },
  { id: 4,  nama: "Cappuccino",          kategori: "kopi",    harga: 25000, gambar: "assets/img/menu/cappuccino.jpg" },
  { id: 5,  nama: "Caramel Macchiato",   kategori: "kopi",    harga: 28000, gambar: "assets/img/menu/caramel-macchiato.jpg" },
  { id: 6,  nama: "Kopi Susu Gula Aren", kategori: "kopi",    harga: 22000, gambar: "assets/img/menu/kopi-susu-gula-aren.jpg" },
  { id: 7,  nama: "Matcha Latte",        kategori: "nonkopi", harga: 25000, gambar: "assets/img/menu/matcha-latte.jpg" },
  { id: 8,  nama: "Chocolate",           kategori: "nonkopi", harga: 24000, gambar: "assets/img/menu/chocolate.jpg" },
  { id: 9,  nama: "Croissant",           kategori: "makanan", harga: 20000, gambar: "assets/img/menu/croissant.jpg" },
  { id: 10, nama: "Chicken Sandwich",    kategori: "makanan", harga: 28000, gambar: "assets/img/menu/chicken-sandwich.jpg" },
];

const NOMOR_WA = "6281234567890";

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const grid = document.getElementById("menu-grid");
const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("cart-total");
const cart = {};

function renderMenu(filter = "semua") {
  const items = filter === "semua" ? menu : menu.filter((m) => m.kategori === filter);
  grid.innerHTML = items.map((m) => `
    <article class="card">
      <img class="card-img" src="${m.gambar}" alt="${m.nama}" loading="lazy">
      <h3>${m.nama}</h3>
      <div class="card-bottom">
        <span class="price">${rupiah(m.harga)}</span>
        <button class="add" data-id="${m.id}">+ Tambah</button>
      </div>
    </article>`).join("");
}

function renderCart() {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    cartEl.innerHTML = '<p class="empty">Belum ada pesanan. Pilih menu di atas.</p>';
    totalEl.textContent = rupiah(0);
    return;
  }
  let total = 0;
  cartEl.innerHTML = ids.map((id) => {
    const item = menu.find((m) => m.id == id);
    total += item.harga * cart[id];
    return `
      <div class="cart-item">
        <span>${item.nama}</span>
        <div class="qty">
          <button data-minus="${id}">−</button>
          <span>${cart[id]}</span>
          <button data-plus="${id}">+</button>
        </div>
      </div>`;
  }).join("");
  totalEl.textContent = rupiah(total);
}

document.querySelector(".tabs").addEventListener("click", (e) => {
  if (!e.target.matches(".tab")) return;
  document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
  e.target.classList.add("active");
  renderMenu(e.target.dataset.filter);
});

grid.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  e.target.textContent = "✓ Ditambah";
  setTimeout(() => (e.target.textContent = "+ Tambah"), 800);
});

cartEl.addEventListener("click", (e) => {
  const { plus, minus } = e.target.dataset;
  if (plus) cart[plus]++;
  if (minus && --cart[minus] <= 0) delete cart[minus];
  renderCart();
});

document.getElementById("checkout").addEventListener("click", () => {
  const ids = Object.keys(cart);
  if (ids.length === 0) return alert("Keranjang masih kosong.");
  let total = 0;
  const baris = ids.map((id) => {
    const item = menu.find((m) => m.id == id);
    total += item.harga * cart[id];
    return `- ${item.nama} x${cart[id]}`;
  });
  const pesan = `Halo Kopi Senja, saya ingin pesan:\n${baris.join("\n")}\nTotal: ${rupiah(total)}`;
  window.open(`https://wa.me/${NOMOR_WA}?text=${encodeURIComponent(pesan)}`, "_blank");
});

document.querySelector(".nav-toggle").addEventListener("click", () =>
  document.querySelector(".nav-links").classList.toggle("open"));
document.querySelectorAll(".nav-links a").forEach((a) =>
  a.addEventListener("click", () => document.querySelector(".nav-links").classList.remove("open")));

document.getElementById("year").textContent = new Date().getFullYear();
renderMenu();
