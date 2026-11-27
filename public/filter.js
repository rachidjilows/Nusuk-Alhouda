const kind = document.querySelector("#kind"),
  duration = document.querySelector("#duration");
if (kind && duration) {
  const update = () => {
    let count = 0;
    document.querySelectorAll("[data-offer]").forEach((card) => {
      card.hidden = !!(
        (kind.value && kind.value !== card.dataset.type) ||
        (duration.value &&
          duration.value !==
            (Number(card.dataset.days) > 14 ? "long" : "short"))
      );
      if (!card.hidden) count++;
    });
    document.querySelector("#empty").hidden = count > 0;
  };
  kind.onchange = duration.onchange = update;
}
