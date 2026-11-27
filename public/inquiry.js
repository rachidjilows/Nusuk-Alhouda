const form = document.querySelector("[data-inquiry]");
if (form) {
  const select = form.elements.namedItem("program");
  select.value = new URLSearchParams(location.search).get("program") || "";
  if (select.selectedIndex < 0) select.selectedIndex = 0;
  let requestId = crypto.randomUUID();
  form.addEventListener("input", () => (requestId = crypto.randomUUID()));
  form.onsubmit = async (e) => {
    e.preventDefault();
    const button = form.querySelector("button"),
      status = form.querySelector("[role=status]");
    button.disabled = true;
    status.textContent = "…";
    try {
      const values = Object.fromEntries(new FormData(form));
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, requestId }),
      });
      if (!response.ok) throw Error();
      status.textContent = form.dataset.success;
      form.reset();
      requestId = crypto.randomUUID();
    } catch {
      status.textContent = form.dataset.error;
    } finally {
      button.disabled = false;
      window.turnstile?.reset();
    }
  };
}
