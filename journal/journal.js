const chips = document.querySelectorAll(".filter-chip");
const cards = document.querySelectorAll(".journal-card");
const form = document.querySelector(".newsletter-form");
const emailInput = document.querySelector("#newsletter-email");
const message = document.querySelector(".newsletter-message");

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const category = chip.dataset.category;
    chips.forEach((item) => item.classList.toggle("is-active", item === chip));
    cards.forEach((card) => {
      const visible = category === "all" || card.dataset.category === category;
      card.hidden = !visible;
    });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!emailInput.checkValidity() || !email) {
    message.textContent = "Enter a valid email address.";
    message.dataset.state = "error";
    emailInput.focus();
    return;
  }

  message.textContent = "Newsletter functionality coming soon.";
  message.dataset.state = "ready";
  form.reset();
});
