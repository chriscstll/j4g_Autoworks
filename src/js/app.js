'use strict';

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const openContactButtons = document.querySelectorAll(".open-contact");
const closeContactBtn = document.querySelector("#close-contact");
const contactSection = document.querySelector("#contact");
const contactOverlay = document.querySelector("#contact .overlay");


// OPEN AND CLOSE NAV
let navOpen = false;

function closeNav() {
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  navOpen = false;
}

function toggleNav() {
  navOpen = !navOpen;
  nav?.classList.toggle("open", navOpen);
  menuToggle?.setAttribute("aria-expanded", String(navOpen));
  if (navOpen) {
    history.pushState({ mobileNav: true }, "");
  }
}
menuToggle?.addEventListener("click", toggleNav);
navLinks.forEach((link) => {
  link.addEventListener("click", closeNav);
});

window.addEventListener("popstate", (event) => {
  if (navOpen) {
    closeNav();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navOpen) {
    closeNav();
    history.back();
  }
});


// CONTACT / BOOKING
function openContact() {
  closeNav();
  contactSection?.classList.remove("hidden");
  document.body.classList.add("booking-open");
  document.body.style.overflow = "hidden";
}

function closeContact() {
  contactSection?.classList.add("hidden");
  document.body.classList.remove("booking-open");
  document.body.style.overflow = "";
}

openContactButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openContact();
  });
});

closeContactBtn?.addEventListener("click", closeContact);
contactOverlay?.addEventListener("click", closeContact);

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (nav?.classList.contains("open")) {
    closeNavAndPopHistory();
  }

  if (contactSection && !contactSection.classList.contains("hidden")) {
    closeContact();
  }
});


// ACTIVE NAV LINK ON SCROLL
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);
sections.forEach((section) => observer.observe(section));


// HEADER ON SCROLL
const siteHeader = document.querySelector('.site-header');
let lastScrollY = window.scrollY;
let scrollDirection = 'up';
const scrollThreshold = 10;
const topThreshold = 20;

function updateHeaderOnScroll() {
  if (!siteHeader) return;

  const currentScrollY = window.scrollY;

  if (currentScrollY <= topThreshold) {
    siteHeader.classList.remove('is-hidden', 'is-scrolled'); 
    lastScrollY = currentScrollY;
    return;
  }

  siteHeader.classList.add('is-scrolled');

  const difference = currentScrollY - lastScrollY;
  if (Math.abs(difference) < scrollThreshold) return;
  scrollDirection = difference > 0 ? 'down' : 'up';

  if (!nav?.classList.contains('open')) {
    siteHeader.classList.toggle('is-hidden', scrollDirection === 'down');
  }
  lastScrollY = currentScrollY;
}
window.addEventListener('scroll', updateHeaderOnScroll, { passive: true });

// SCROLL REVEAL
const baseConfig = {
  duration: 1000,
  distance: '60px',
  easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
  reset: false 
};

ScrollReveal().reveal('.reveal-top', { ...baseConfig, origin: 'top', delay: 200 });
ScrollReveal().reveal('.reveal-left', { ...baseConfig, origin: 'left', delay: 300 });
ScrollReveal().reveal('.reveal-right', { ...baseConfig, origin: 'right', delay: 300 });
ScrollReveal().reveal('.reveal-scale', { ...baseConfig, distance: '0px', scale: 0.85 });
ScrollReveal().reveal('.reveal-card', { ...baseConfig, origin: 'bottom', interval: 150 });
;



// SEE MORE / SEE LESS
const seeMoreButtons = document.querySelectorAll(".see-more");
seeMoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");
    const expanded = card.classList.toggle("expanded");
    button.innerHTML = expanded ? 'SEE LESS <span>−</span>' : 'SEE MORE <span>+</span>'; 
  });
});


// BOOKING FORM
const serviceForm = document.querySelector("#service-form");
const formMessage = document.querySelector("#form-message");


serviceForm?.addEventListener("submit", async function (event) {
  event.preventDefault();
  const submitButton = serviceForm.querySelector('button[type="submit"]');
  const formData = new FormData(serviceForm);

  const bookingData = {
    name: formData.get("name"),
    email: formData.get("email"),
    vehicle: formData.get("vehicle"),
    service: formData.get("service"),
    date: formData.get("date"),
    message: formData.get("message"),
  };

  submitButton.disabled = true;
  submitButton.textContent = "SENDING...";
  submitButton.classList.add("sending");
  formMessage.textContent = "";
  formMessage.className = "form-message";

  try {
    await fetch("https://script.google.com/macros/s/AKfycbx8954e2FXgyPwl0dR1AMkriBXdR66nY0SywlSfA9MXQizIIxBplB4NnHIJyR8HMuoszA/exec", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    submitButton.textContent = "SENT";
    submitButton.classList.remove("sending");
    submitButton.classList.add("sent");
    formMessage.textContent = "REQUEST RECEIVED — WE'LL BE IN TOUCH SOON.";
    formMessage.classList.add("success");
    serviceForm.reset();
    setTimeout(() => {
      closeContact();
      formMessage.textContent = "";
      formMessage.className = "form-message";
    }, 2000); 

  } catch (error) {
    console.error("Booking error:", error);
    formMessage.textContent = "UNABLE TO SEND REQUEST — PLEASE TRY AGAIN.";
    formMessage.classList.add("error");
    submitButton.textContent = "REQUEST SERVICE";
    submitButton.classList.remove("sending");
    submitButton.disabled = false;

  } finally {
    setTimeout(() => {
      submitButton.textContent = "REQUEST SERVICE";
      submitButton.classList.remove("sending", "sent");
      submitButton.disabled = false;
    }, 3000);
  }
});


//    GOOGLE ACCOUNT 
// Email: jgautoworks11@gmail.com
// Password: @j4g-admin

