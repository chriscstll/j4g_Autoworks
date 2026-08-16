'use strict';

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const openContactButtons = document.querySelectorAll(".open-contact");
const closeContactBtn = document.querySelector("#close-contact");
const contactSection = document.querySelector("#contact");
const contactOverlay = document.querySelector("#contact .overlay");


// OPEN AND CLOSE NAV
let navHistoryState = false;

function closeNav() {
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}
function toggleNav() {
  const isOpen = nav?.classList.toggle("open") ?? false;
  menuToggle?.setAttribute("aria-expanded", String(isOpen));
  if (isOpen && !navHistoryState) {
    history.pushState({ mobileNav: true }, "");
    navHistoryState = true;
  }
}

menuToggle?.addEventListener("click", toggleNav);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeNav();
    if (navHistoryState) {
      history.back();
      navHistoryState = false;
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (nav?.classList.contains("open")) {
    closeNav();

    if (navHistoryState) {
      history.back();
      navHistoryState = false;
    }
  }
});

window.addEventListener("popstate", () => {
  navHistoryState = false;
  closeNav();
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
  if (event.key === "Escape" && contactSection && !contactSection.classList.contains("hidden")) {
    closeContact();
  }
});
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isActive =
          link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("active", isActive);
      });
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
  }
);
sections.forEach((section) => observer.observe(section));



// HEADER ONSCROLL
const siteHeader = document.querySelector('.site-header');
let lastScrollY = window.scrollY;
let scrollDirection = 'up';
const scrollThreshold = 10;
const topThreshold = 20;

  function updateHeaderOnScroll() {
    if (!siteHeader) return;

  const currentScrollY = window.scrollY;
    if (currentScrollY <= topThreshold) {
      siteHeader.classList.remove('is-hidden');
      siteHeader.classList.remove('is-scrolled');
      lastScrollY = currentScrollY;
    return;
  }

  siteHeader.classList.add('is-scrolled');
  const difference = currentScrollY - lastScrollY;
    if (Math.abs(difference) < scrollThreshold) {
      return;
  }
    if (difference > 0) {
      scrollDirection = 'down';
  }
    else {
      scrollDirection = 'up';
  }
  const menuIsOpen = nav?.classList.contains('open');
    if (menuIsOpen) {
      siteHeader.classList.remove('is-hidden');
      lastScrollY = currentScrollY;
      return;
  }
    if (scrollDirection === 'down') {
      siteHeader.classList.add('is-hidden');
  }
    else if (scrollDirection === 'up') {
      siteHeader.classList.remove('is-hidden');
  }
    lastScrollY = currentScrollY;
}

window.addEventListener(
  'scroll',
  updateHeaderOnScroll,
  {
    passive: true
  }
);




// SEE MORE / SEE LESS

const seeMoreButtons = document.querySelectorAll(".see-more");

seeMoreButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".service-card");

    card.classList.toggle("expanded");

    if (card.classList.contains("expanded")) {
      button.innerHTML = 'SEE LESS <span>−</span>';
    } else {
      button.innerHTML = 'SEE MORE <span>+</span>';
    }
  });
});


// REVEAL ONSCROL
document.addEventListener("DOMContentLoaded", () => {
  const revealSections =
    document.querySelectorAll(".reveal-section");

  console.log("Reveal sections found:", revealSections.length);

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  revealSections.forEach((section) => {
    revealObserver.observe(section);
  });
});



// BOOKING FORM
const serviceForm = document.querySelector("#service-form");
const formMessage = document.querySelector("#form-message");
const GOOGLE_SCRIPT_URL =
  "WEB APP URL/APPS SCRIPT DEPLOY URL... SEE FILE BELOW ";


serviceForm?.addEventListener("submit", async function (event) {
  event.preventDefault();

  const submitButton = serviceForm.querySelector(
    'button[type="submit"]'
  );

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
  formMessage.textContent = "";
  formMessage.className = "form-message";
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(bookingData),
    });

    formMessage.textContent =
      "REQUEST RECEIVED — WE'LL BE IN TOUCH SOON.";
    formMessage.classList.add("success");
    serviceForm.reset();
  } catch (error) {
    console.error("Booking error:", error);
    formMessage.textContent =
      "UNABLE TO SEND REQUEST — PLEASE TRY AGAIN.";
    formMessage.classList.add("error");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "REQUEST SERVICE";
  }
});


//    TO BE PUT AT APPS SCRIPT
/* const SHEET_NAME = "Bookings";

function doPost(e) {
  try {
    const sheet =
      SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error(`Sheet "${SHEET_NAME}" was not found.`);
    }

    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("No booking data received.");
    }

    const data = JSON.parse(e.postData.contents);

    if (!data.name || !data.email || !data.service) {
      throw new Error("Required booking information is missing.");
    }

    if (data.website) {
      throw new Error("Spam detected.");
    }

    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.vehicle || "",
      data.service,
      data.message || "",
      "New",
    ]);

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: true,
          message: "Booking submitted successfully.",
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );

  } catch (error) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          message: error.message,
        })
      )
      .setMimeType(
        ContentService.MimeType.JSON
      );
  }
} */

  