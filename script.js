/* ---------------------------
   Kingsukh Guest House — script
   - Supports: place modal (openModal('baranti')), booking modal (openModal())
   - Single closeModal() that closes either modal
   - sendWhatsApp() handles both contact form (contact section) and booking form
   - Feedback reviews saved to localStorage and auto-scroll right->left
   --------------------------- */

/* ---------- Place info ---------- */
const info = {
  baranti: `<h2>Baranti Lake</h2>
    <p>Located beside Kingsukh Guest House, Baranti Lake offers serene beauty and mesmerizing sunsets.</p>
    <ul>
      <li><b>Distance:</b> 0 km (walkable)</li>
      <li><b>Best Time:</b> Evening for sunset views</li>
      <li><b>Travel:</b> Walk / Local Bike</li>
      <li><a href="https://maps.google.com/?q=Baranti+Lake"><b>Map</b></a></li>
    </ul>`,
  garh: `<h2>Garh Panchkot</h2>
    <p>Ancient fort ruins surrounded by lush hills and history.</p>
    <ul>
      <li><b>Distance:</b> 12 km</li>
      <li><b>Nearest Travel:</b> Local cab or bike</li>
      <li><b>Special:</b> Historic fort and scenic background</li>
      <li><a href="https://maps.google.com/?q=Garh+Panchkot"><b>Map</b></a></li>
    </ul>`,
  biharinath: `<h2>Biharinath Hill</h2>
    <p>Highest hill in Bankura district with a Shiva temple at the base.</p>
    <ul>
      <li><b>Distance:</b> 20 km</li>
      <li><b>Best Travel:</b> Car / Bike</li>
      <li><b>Nearby:</b> Eco park, local shops</li>
      <li><a href="https://maps.google.com/?q=Biharinath+Hill"><b>Map</b></a></li>
    </ul>`,
  joychandi: `<h2>Joychandi Hill</h2>
    <p>Famous for rock climbing and panoramic views from the top.</p>
    <ul>
      <li><b>Distance:</b> 21 km</li>
      <li><b>Activity:</b> 500-step climb</li>
      <li><a href="https://maps.google.com/?q=Joychandi+Hill"><b>Map</b></a></li>
    </ul>`,
  panchet: `<h2>Panchet Dam</h2>
    <p>Scenic dam over Damodar River, perfect for day trips.</p>
    <ul>
      <li><b>Distance:</b> 25–50 km</li>
      <li><b>Travel:</b> Car preferred</li>
      <li><a href="https://maps.google.com/?q=Panchet+Dam"><b>Map</b></a></li>
    </ul>`,
  maithon: `<h2>Maithon Dam</h2>
    <p>Beautiful reservoir offering boating and picnic opportunities.</p>
    <ul>
      <li><b>Distance:</b> 40 km</li>
      <li><b>Known For:</b> Boating & Scenic Views</li>
      <li><a href="https://maps.google.com/?q=Maithon+Dam"><b>Map</b></a></li>
    </ul>`,
  susunia: `<h2>Susunia Hill</h2>
    <p>Ancient inscriptions, rock climbing, and medicinal plants.</p>
    <ul>
      <li><b>Distance:</b> 36 km</li>
      <li><b>Perfect For:</b> Trekkers & Nature Lovers</li>
      <li><a href="https://maps.google.com/?q=Susunia+Hill"><b>Map</b></a></li>
    </ul>`
};

/* ---------- Modal helpers ---------- */
const placeModal = document.getElementById("modal");            // places modal (modal-text inside)
const placeModalText = document.getElementById("modal-text");
const bookingModal = document.getElementById("bookingModal");   // booking modal element

// openModal(place) -> if place provided, open place modal; if not, open booking modal
function openModal(place) {
  if (place) {
    // Open tourist/place modal
    if (!placeModal) return;
    placeModalText.innerHTML = info[place] || "<p>Details not found.</p>";
    placeModal.style.display = "flex";
  } else {
    // Open booking modal
    if (!bookingModal) return;
    bookingModal.style.display = "flex";
  }
}

// closeModal() -> close whichever modal(s) are currently open
function closeModal() {
  if (placeModal && placeModal.style.display !== "none") placeModal.style.display = "none";
  if (bookingModal && bookingModal.style.display !== "none") bookingModal.style.display = "none";
}

// close when clicking outside modal content
window.addEventListener("click", (e) => {
  if (e.target === placeModal) placeModal.style.display = "none";
  if (e.target === bookingModal) bookingModal.style.display = "none";
});

/* ---------- Reviews / feedback ---------- */
const feedbackForm = document.getElementById("feedbackForm");
const reviewsContainer = document.getElementById("reviewsContainer");
const REVIEWS_KEY = "kingsukh_reviews";
const MAX_REVIEWS = 10; // store more if needed (we'll display latest ones)

// Load reviews from localStorage or start empty
let reviews = JSON.parse(localStorage.getItem(REVIEWS_KEY)) || [];

// Create review card HTML (keeps them inline for horizontal scroll)
function buildReviewHTML(r) {
  // using inline-block so typical CSS can handle horizontal layout
  return `
    <div class="review-card" style="display:inline-block; vertical-align:top; margin-right:12px; min-width:220px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <img src="${r.imgSrc || 'https://i.pravatar.cc/60'}" alt="${escapeHtml(r.name)}" style="width:48px; height:48px; border-radius:50%;">
        <div>
          <div style="font-weight:700;">${escapeHtml(r.name)}</div>
          <div style="font-size:12px; color:#666;">${escapeHtml(r.location)}</div>
        </div>
      </div>
      <p style="margin:8px 0 4px;">${escapeHtml(r.message)}</p>
      <div style="font-size:14px;">${'⭐'.repeat(Math.max(0, Math.min(5, r.stars || 0)))}</div>
    </div>
  `;
}

function renderReviews() {
  if (!reviewsContainer) return;
  // show newest first
  const latest = reviews.slice(0, MAX_REVIEWS);
  const reviewHTML = latest.map(buildReviewHTML).join("");

  // duplicate content to allow seamless scroll effect
  reviewsContainer.innerHTML = reviewHTML + reviewHTML;

  // reset scroll position so animation restarts
  reviewsContainer.scrollLeft = 0;
}

/* small helper to prevent XSS in inserted text */
function escapeHtml(text = "") {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* add review from the feedback form */
if (feedbackForm) {
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // gather fields by id (these are from the feedback form in your HTML)
    const name = document.getElementById("name")?.value || "";
    const phone = document.getElementById("phone")?.value || "";
    const location = document.getElementById("location")?.value || "";
    const message = document.getElementById("message")?.value || "";
    const stars = parseInt(document.getElementById("stars")?.value || "0", 10);

    // small guard: don't add empty
    if (!name || !message) {
      alert("Please enter name and message.");
      return;
    }

    const imgSrc = `https://i.pravatar.cc/60?u=${encodeURIComponent(name)}`;
    reviews.unshift({ name, phone, location, message, stars, imgSrc });

    // keep stored reviews bounded
    if (reviews.length > 50) reviews = reviews.slice(0, 50);

    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    renderReviews();

    feedbackForm.reset();
  });
}

/* ---------- Auto-scroll reviews right -> left ---------- */
let scrollSpeed = 0.5; // px per frame (adjust to taste)
let scrolling = false;

function startAutoScroll() {
  if (!reviewsContainer || scrolling) return;
  scrolling = true;

  let rafId;
  function step() {
    // when scroll reaches half (because we duplicated content), reset to 0
    const maxScroll = reviewsContainer.scrollWidth / 2;
    reviewsContainer.scrollLeft += scrollSpeed;
    if (reviewsContainer.scrollLeft >= maxScroll) {
      reviewsContainer.scrollLeft = 0;
    }
    rafId = requestAnimationFrame(step);
  }
  rafId = requestAnimationFrame(step);

  // stop on hover
  reviewsContainer.addEventListener("mouseenter", () => { cancelAnimationFrame(rafId); scrolling = false; });
  reviewsContainer.addEventListener("mouseleave", () => { if (!scrolling) startAutoScroll(); });
}

/* ---------- FAQ toggle ---------- */
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const answer = item.querySelector(".faq-answer");
    const icon = btn.querySelector(".faq-icon");

    if (item.classList.contains("active")) {
      item.classList.remove("active");
      if (answer) answer.style.maxHeight = null;
      if (icon) icon.textContent = "+";
    } else {
      // close others
      document.querySelectorAll(".faq-item").forEach(i => {
        i.classList.remove("active");
        const a = i.querySelector(".faq-answer");
        if (a) a.style.maxHeight = null;
        const ic = i.querySelector(".faq-icon");
        if (ic) ic.textContent = "+";
      });

      item.classList.add("active");
      if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
      if (icon) icon.textContent = "-";
    }
  });
});

/* ---------- WhatsApp sending (single function handles both contexts) ---------- */
/*
 - Both booking form and contact form call sendWhatsApp() in your HTML.
 - This function detects whether booking modal is currently open.
 - If booking modal visible -> read booking form values (from inside #bookingForm).
 - Otherwise -> read contact form values (from inside #contactForm).
 - Sends to the number requested by you: 8977239306
*/
function sendWhatsApp() {
  const targetNumber = "918977239306";

  // ---------- BOOKING FORM ----------
  if (bookingModal && bookingModal.style.display !== "none") {
    const bf = document.getElementById("bookingForm");
    if (!bf) return alert("Booking form not found.");

    const bName = (bf.querySelector("#name")?.value || "").trim();
    const bPlace = (bf.querySelector("#place")?.value || "").trim();
    const bPhone = (bf.querySelector("#phone")?.value || "").trim();
    const bEmail = (bf.querySelector("#email")?.value || "").trim();
    const bDuration = (bf.querySelector("#duration")?.value || "").trim();
    const bRoom = (bf.querySelector("#roomType")?.value || "").trim();
    const bMembers = (bf.querySelector("#members")?.value || "").trim();

    if (!bName || !bPhone)
      return alert("Please provide name and phone for booking.");

    // NORMAL message (no %0A)
    let msg =
`🟦 New Room Booking 🟦

Name: ${bName}
Place: ${bPlace}
Phone: ${bPhone}
Email: ${bEmail}
Duration: ${bDuration}
Room Type: ${bRoom}
Members: ${bMembers}

Please confirm the booking.`;

    const url = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
    return;
  }

  // ---------- CONTACT FORM ----------
  const cf = document.getElementById("contactForm");
  if (!cf) return alert("Contact form not found.");

  const firstName = (cf.querySelector('input[placeholder="First Name"]')?.value || "").trim();
  const lastName = (cf.querySelector('input[placeholder="Last Name"]')?.value || "").trim();
  const email = (cf.querySelector('input[placeholder="Email Address"]')?.value || "").trim();
  const phone = (cf.querySelector('input[placeholder="Mobile Number"]')?.value || "").trim();
  const msgText = (cf.querySelector("textarea")?.value || "").trim();

  if (!firstName || !phone)
    return alert("Please provide your name and phone.");

  let msg =
`🟦 New Contact Message 🟦

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

Message:
${msgText}`;

  const url = `https://api.whatsapp.com/send?phone=${targetNumber}&text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");
}


/* ---------- Initialize everything on load ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Ensure both modals are hidden initially
  if (placeModal) placeModal.style.display = placeModal.style.display === "flex" ? "flex" : "none";
  if (bookingModal) bookingModal.style.display = bookingModal.style.display === "flex" ? "flex" : "none";

  renderReviews();
  startAutoScroll();
});
