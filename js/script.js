// ====== DATA MENU ======
const menu = [
  { id: 1,  nama: "Espresso",            kategori: "kopi",    harga: 18000, gambar: "assets/img/menu/espresso.jpg", deskripsi: "Espresso pekat dengan cita rasa kuat dan crema lembut." },
  { id: 2,  nama: "Americano",           kategori: "kopi",    harga: 20000, gambar: "assets/img/menu/americano.jpg", deskripsi: "Espresso klasik dengan air, ringan namun tetap kaya rasa." },
  { id: 3,  nama: "Café Latte",          kategori: "kopi",    harga: 25000, gambar: "assets/img/menu/cafe-latte.jpg", deskripsi: "Espresso lembut berpadu dengan susu creamy dan halus." },
  { id: 4,  nama: "Cappuccino",          kategori: "kopi",    harga: 25000, gambar: "assets/img/menu/cappuccino.jpg", deskripsi: "Perpaduan espresso, susu, dan foam lembut yang seimbang." },
  { id: 5,  nama: "Caramel Macchiato",   kategori: "kopi",    harga: 28000, gambar: "assets/img/menu/caramel-macchiato.jpg", deskripsi: "Espresso creamy dengan susu lembut dan sentuhan karamel manis." },
  { id: 6,  nama: "Kopi Susu Gula Aren", kategori: "kopi",    harga: 22000, gambar: "assets/img/menu/kopi-susu-gula-aren.jpg", deskripsi: "Kopi susu creamy dengan manis alami dan aroma khas gula aren." },
  { id: 7,  nama: "Matcha Latte",        kategori: "nonkopi", harga: 25000, gambar: "assets/img/menu/matcha-latte.jpg", deskripsi: "Matcha pilihan dengan susu creamy dan rasa earthy yang lembut." },
  { id: 8,  nama: "Chocolate",           kategori: "nonkopi", harga: 24000, gambar: "assets/img/menu/chocolate.jpg", deskripsi: "Cokelat hangat yang creamy, manis, dan kaya rasa." },
  { id: 9,  nama: "Croissant",           kategori: "makanan", harga: 20000, gambar: "assets/img/menu/croissant.jpg", deskripsi: "Croissant renyah berlapis dengan tekstur buttery yang lembut." },
  { id: 10, nama: "Chicken Sandwich",    kategori: "makanan", harga: 28000, gambar: "assets/img/menu/chicken-sandwich.jpg", deskripsi: "Roti panggang dengan ayam gurih, sayuran segar, keju, dan saus creamy." },
];

const NOMOR_WA = "6281234567890";

const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const grid = document.getElementById("menu-grid");
const cartEl = document.getElementById("cart");
const totalEl = document.getElementById("cart-total");
const cart = {};


// ====== MENU DETAIL MODAL ======
const menuModal = document.getElementById("menu-modal");
const modalImage = document.getElementById("modal-menu-image");
const modalName = document.getElementById("modal-menu-name");
const modalCategory = document.getElementById("modal-menu-category");
const modalDescription = document.getElementById("modal-menu-description");
const modalPrice = document.getElementById("modal-menu-price");
const modalTotal = document.getElementById("modal-menu-total");
const modalClose = document.getElementById("menu-modal-close");
const modalAdd = document.getElementById("modal-menu-add");
const modalMinus = document.getElementById("modal-minus");
const modalPlus = document.getElementById("modal-plus");
const modalQty = document.getElementById("modal-qty");

let activeMenuId = null;

/*
 * IMPORTANT:
 * The modal quantity belongs ONLY to the menu currently being viewed.
 * The cart remains the global order list.
 */
function updateModalQuantity() {
  if (!activeMenuId) return;

  const item = menu.find((m) => m.id === activeMenuId);
  if (!item) return;

  const quantity = cart[activeMenuId] || 0;
  const itemTotal = item.harga * quantity;

  if (modalQty) {
    modalQty.textContent = quantity;
  }

  if (modalTotal) {
    modalTotal.textContent = `Total: ${rupiah(itemTotal)}`;
  }
}

function openMenuModal(id) {
  const item = menu.find((m) => m.id === Number(id));
  if (!item) return;

  // This is the critical part:
  // every time a different menu opens, activeMenuId changes.
  activeMenuId = item.id;

  modalImage.src = item.gambar;
  modalImage.alt = item.nama;
  modalName.textContent = item.nama;
  modalCategory.textContent =
    item.kategori === "kopi"
      ? "KOPI"
      : item.kategori === "nonkopi"
      ? "NON-KOPI"
      : "MAKANAN";
  modalDescription.textContent = item.deskripsi || "";
  modalPrice.textContent = rupiah(item.harga);

  // Always recalculate from THIS menu's cart quantity.
  updateModalQuantity();

  menuModal.classList.add("show");
  menuModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeMenuModal() {
  menuModal.classList.remove("show");
  menuModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeMenuId = null;
}

if (modalPlus) {
  modalPlus.addEventListener("click", () => {
    if (!activeMenuId) return;

    cart[activeMenuId] = (cart[activeMenuId] || 0) + 1;

    // Update both modal and Pesanan Anda.
    updateModalQuantity();
    renderCart();
  });
}

if (modalMinus) {
  modalMinus.addEventListener("click", () => {
    if (!activeMenuId) return;

    const current = cart[activeMenuId] || 0;

    if (current <= 1) {
      delete cart[activeMenuId];
    } else {
      cart[activeMenuId] = current - 1;
    }

    // Update both modal and Pesanan Anda.
    updateModalQuantity();
    renderCart();
  });
}

if (modalAdd) {
  modalAdd.addEventListener("click", () => {
    if (!activeMenuId) return;

    cart[activeMenuId] = (cart[activeMenuId] || 0) + 1;

    updateModalQuantity();
    renderCart();
  });
}

if (modalClose) {
  modalClose.addEventListener("click", closeMenuModal);
}

if (menuModal) {
  menuModal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) {
      closeMenuModal();
    }
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuModal.classList.contains("show")) {
    closeMenuModal();
  }
});

grid.addEventListener("click", (e) => {
  const image = e.target.closest(".menu-clickable");

  if (!image) return;

  e.preventDefault();
  e.stopPropagation();

  openMenuModal(image.dataset.menuId);
});

grid.addEventListener("keydown", (e) => {
  const image = e.target.closest(".menu-clickable");

  if (!image) return;

  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    e.stopPropagation();

    openMenuModal(image.dataset.menuId);
  }
});

function renderMenu(filter = "semua") {
  const items = filter === "semua" ? menu : menu.filter((m) => m.kategori === filter);
  grid.innerHTML = items.map((m) => `
    <article class="card">
      <img class="card-img menu-clickable" src="${m.gambar}" alt="${m.nama}" loading="lazy" data-menu-id="${m.id}" tabindex="0" role="button" aria-label="Lihat detail ${m.nama}" onclick="openMenuModal(${m.id})">
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

/* Lazy-load video background Menu & Galeri (hemat loading awal) */
(function () {
  const vids = document.querySelectorAll("video.section-bg");
  const activate = (v) => {
    const s = v.querySelector("source");
    if (s && s.dataset.src && !s.src) { s.src = s.dataset.src; v.load(); }
    v.play().catch(() => {});
  };
  if (!("IntersectionObserver" in window)) { vids.forEach(activate); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) activate(e.target); else e.target.pause(); });
  }, { rootMargin: "200px" });
  vids.forEach((v) => io.observe(v));
})();

/* Scroll progress bar + reveal + parallax hero */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bar = document.getElementById("scroll-progress");
  const heroVideo = document.querySelector(".hero-video");

  function onScroll() {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    if (heroVideo && !reduce && h.scrollTop < h.clientHeight) {
      heroVideo.style.transform = "translateY(" + (h.scrollTop * 0.08) + "px)";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (!reduce && "IntersectionObserver" in window) {
    const targets = document.querySelectorAll(".section h2, .gallery-sub, .gallery-note, .menu-grid, #galeri .gallery-grid img, #lokasi p, #lokasi .hours, #lokasi .map-wrap");
    targets.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = ((i % 6) * 0.06) + "s";
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => io.observe(el));
  }
})();
