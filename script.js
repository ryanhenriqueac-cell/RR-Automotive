const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");

function updateHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 20);
}

function closeNav() {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
}

navToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNav);
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
updateHeaderState();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.14,
  rootMargin: "0px 0px -40px 0px"
});

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});
const obdDemo = document.querySelector("[data-obd-demo]");
if (obdDemo) {
  const tabs = obdDemo.querySelectorAll("[data-demo-tab]");
  const panels = obdDemo.querySelectorAll("[data-demo-panel]");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.demoTab;
      tabs.forEach((item) => item.classList.toggle("active", item === tab));
      panels.forEach((panel) => panel.classList.toggle("active", panel.dataset.demoPanel === target));
    });
  });

  const rpm = obdDemo.querySelector("[data-live-rpm]");
  const bars = obdDemo.querySelectorAll(".live-chart i");
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.setInterval(() => {
      if (rpm) rpm.textContent = String(2680 + Math.round(Math.random() * 420));
      bars.forEach((bar) => {
        bar.style.height = `${30 + Math.round(Math.random() * 58)}%`;
      });
    }, 1400);
  }
}

const calculator = document.querySelector("[data-margin-calculator]");
if (calculator) {
  const fields = Object.fromEntries(
    [...calculator.querySelectorAll("[data-calc]")].map((field) => [field.dataset.calc, field])
  );
  const results = Object.fromEntries(
    [...calculator.querySelectorAll("[data-result]")].map((element) => [element.dataset.result, element])
  );
  const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const numberValue = (field) => Math.max(0, Number.parseFloat(field?.value) || 0);

  function updateMarginCalculator() {
    const partsCost = numberValue(fields.parts);
    const margin = numberValue(fields.margin);
    const hours = numberValue(fields.hours);
    const hourRate = numberValue(fields.hourRate);
    const partsPrice = partsCost * (1 + margin / 100);
    const labor = hours * hourRate;
    const total = partsPrice + labor;
    const grossResult = total - partsCost;

    results.partsPrice.textContent = currency.format(partsPrice);
    results.labor.textContent = currency.format(labor);
    results.total.textContent = currency.format(total);
    results.profit.textContent = currency.format(grossResult);
  }

  Object.values(fields).forEach((field) => field.addEventListener("input", updateMarginCalculator));
  updateMarginCalculator();
}
