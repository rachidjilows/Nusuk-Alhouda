const box = document.querySelector(".consent");
function refresh() {
  let value = null;
  try {
    value = localStorage.getItem("maps-choice");
  } catch {}
  box.hidden = !!value;
  const frame = document.querySelector("[data-map]");
  if (frame) {
    frame.hidden = value !== "yes";
    if (value === "yes") frame.src = frame.dataset.map;
    else frame.removeAttribute("src");
  }
}
refresh();
document.querySelectorAll("[data-settings]").forEach((b) =>
  b.addEventListener("click", () => {
    box.hidden = false;
    box.querySelector("button")?.focus();
  }),
);
document.querySelectorAll("[data-choice]").forEach(
  (b) =>
    (b.onclick = () => {
      try {
        localStorage.setItem("maps-choice", b.dataset.choice);
      } catch {}
      refresh();
      box.hidden = true;
    }),
);
