const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelectorAll(".main-nav a");
const contactForm = document.querySelector("[data-contact-form]");
const formNote = document.querySelector("[data-form-note]");
const requestModal = document.querySelector("[data-request-modal]");
const requestOpeners = document.querySelectorAll("[data-modal-open]");
const requestClosers = document.querySelectorAll("[data-modal-close]");
const requestForm = document.querySelector("[data-request-form]");
const requestNote = document.querySelector("[data-request-note]");
const galleryModal = document.querySelector("[data-gallery-modal]");
const galleryOpeners = document.querySelectorAll("[data-gallery-open]");
const galleryClosers = document.querySelectorAll("[data-gallery-close]");
const galleryTitle = document.querySelector("#gallery-modal-title");
const gallerySubtitle = document.querySelector("#gallery-modal-subtitle");
const galleryImage = document.querySelector("[data-gallery-image]");
const galleryThumbs = document.querySelector("[data-gallery-thumbs]");
const galleryCounter = document.querySelector("[data-gallery-counter]");
const galleryPrev = document.querySelector("[data-gallery-prev]");
const galleryNext = document.querySelector("[data-gallery-next]");
let lastModalTrigger = null;
let lastGalleryTrigger = null;
let galleryImages = [];
let galleryIndex = 0;

const updateModalLock = () => {
  const requestIsOpen = requestModal && !requestModal.hidden;
  const galleryIsOpen = galleryModal && !galleryModal.hidden;
  document.body.classList.toggle("modal-open", Boolean(requestIsOpen || galleryIsOpen));
};

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Закрыть меню" : "Открыть меню");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Открыть меню");
  });
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  contactForm.reset();

  if (formNote) {
    formNote.textContent = "Заявка подготовлена. Подключите реальную форму или мессенджер для отправки.";
    formNote.classList.add("is-success");
  }
});

const openRequestModal = (trigger) => {
  if (!requestModal) return;

  lastModalTrigger = trigger;
  requestModal.hidden = false;
  updateModalLock();
  requestNote?.classList.remove("is-success");

  if (requestNote) {
    requestNote.textContent = "";
  }

  requestModal.querySelector("input")?.focus();
};

const closeRequestModal = () => {
  if (!requestModal || requestModal.hidden) return;

  requestModal.hidden = true;
  updateModalLock();
  lastModalTrigger?.focus?.();
};

const parseGalleryImages = (value) => value.split(",").map((item) => item.trim()).filter(Boolean);

const renderGallery = () => {
  if (!galleryImage || !galleryThumbs || !galleryCounter || galleryImages.length === 0) return;

  const src = galleryImages[galleryIndex];
  galleryImage.src = src;
  galleryImage.alt = `${galleryTitle?.textContent || "Фото проекта"} — фото ${galleryIndex + 1}`;
  galleryCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;

  galleryThumbs.innerHTML = "";
  galleryImages.forEach((image, index) => {
    const thumb = document.createElement("button");
    thumb.type = "button";
    thumb.className = index === galleryIndex ? "is-active" : "";
    thumb.setAttribute("aria-label", `Открыть фото ${index + 1}`);

    const img = document.createElement("img");
    img.src = image;
    img.alt = "";
    img.setAttribute("aria-hidden", "true");
    thumb.append(img);

    thumb.addEventListener("click", () => {
      galleryIndex = index;
      renderGallery();
    });

    galleryThumbs.append(thumb);
  });
};

const openGalleryModal = (trigger) => {
  if (!galleryModal) return;

  const images = parseGalleryImages(trigger.dataset.galleryImages || "");
  if (images.length === 0) return;

  lastGalleryTrigger = trigger;
  galleryImages = images;
  galleryIndex = 0;

  if (galleryTitle) {
    galleryTitle.textContent = trigger.dataset.galleryTitle || "Проект";
  }

  if (gallerySubtitle) {
    gallerySubtitle.textContent = trigger.dataset.gallerySubtitle || "";
  }

  galleryModal.hidden = false;
  updateModalLock();
  renderGallery();
  galleryPrev?.focus();
};

const closeGalleryModal = () => {
  if (!galleryModal || galleryModal.hidden) return;

  galleryModal.hidden = true;
  updateModalLock();
  lastGalleryTrigger?.focus?.();
};

const showGalleryImage = (direction) => {
  if (!galleryImages.length) return;

  galleryIndex = (galleryIndex + direction + galleryImages.length) % galleryImages.length;
  renderGallery();
};

requestOpeners.forEach((opener) => {
  opener.addEventListener("click", (event) => {
    event.preventDefault();
    openRequestModal(opener);
  });
});

requestClosers.forEach((closer) => {
  closer.addEventListener("click", closeRequestModal);
});

galleryOpeners.forEach((opener) => {
  opener.addEventListener("click", () => {
    openGalleryModal(opener);
  });

  opener.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openGalleryModal(opener);
  });
});

galleryClosers.forEach((closer) => {
  closer.addEventListener("click", closeGalleryModal);
});

galleryPrev?.addEventListener("click", () => showGalleryImage(-1));
galleryNext?.addEventListener("click", () => showGalleryImage(1));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRequestModal();
    closeGalleryModal();
  }

  if (!galleryModal || galleryModal.hidden) return;

  if (event.key === "ArrowLeft") {
    showGalleryImage(-1);
  }

  if (event.key === "ArrowRight") {
    showGalleryImage(1);
  }
});

requestForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  requestForm.reset();

  if (requestNote) {
    requestNote.textContent = "Заявка принята. Мы свяжемся с вами в ближайшее время.";
    requestNote.classList.add("is-success");
  }
});
