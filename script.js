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
let lastModalTrigger = null;

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
  document.body.classList.add("modal-open");
  requestNote?.classList.remove("is-success");

  if (requestNote) {
    requestNote.textContent = "";
  }

  requestModal.querySelector("input")?.focus();
};

const closeRequestModal = () => {
  if (!requestModal || requestModal.hidden) return;

  requestModal.hidden = true;
  document.body.classList.remove("modal-open");
  lastModalTrigger?.focus?.();
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

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeRequestModal();
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
