document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".course-card");

  cards.forEach(card => {
    card.addEventListener("click", (e) => {
      // Evitar que el botón cerrar dispare el toggle de nuevo
      if (e.target.classList.contains("close-btn")) return;

      // Cerrar cualquier otra tarjeta abierta
      document.querySelectorAll(".extra-content").forEach(extra => {
        if (extra !== card.querySelector(".extra-content")) {
          extra.classList.add("hidden");
        }
      });

      // Alternar esta tarjeta
      const extra = card.querySelector(".extra-content");
      extra.classList.toggle("hidden");
    });

      // Contratar: todos los botones llevan a la vista parcial "pago"
    const hireButtons = document.querySelectorAll(".hireBtn");
    hireButtons.forEach(btn => {
      btn.addEventListener("click", (e) => {
        const modal = e.target.closest(".fixed");
        if (modal) modal.classList.add("hidden"); // cerrar modal
        loadContent('pago'); // carga la vista parcial de pagos
      });
    });

    // Botón de cerrar
    card.querySelector(".close-btn").addEventListener("click", () => {
      card.querySelector(".extra-content").classList.add("hidden");
    });
  });

});
