// js/ocultarcards.js
document.addEventListener("DOMContentLoaded", () => {

  // Delegación de evento para abrir modales
  document.body.addEventListener("click", (e) => {
    const card = e.target.closest("[data-id]");
    if (card) {
      const id = card.getAttribute("data-id");
      const modal = document.getElementById("modal-" + id);
      if (modal) {
        modal.classList.remove("hidden");
      }
    }

    // Cerrar modal
    if (e.target.classList.contains("closeModal")) {
      e.target.closest("div[id^='modal']").classList.add("hidden");
    }

    // Botón contratar
    if (e.target.classList.contains("hireBtn")) {
      const modalDiv = e.target.closest("div[id^='modal']");
      const title = modalDiv.querySelector("h2").innerText;
      modalDiv.classList.add("hidden");
    }

    // Cerrar al hacer clic en el fondo
    if (e.target.matches("div[id^='modal']")) {
      e.target.classList.add("hidden");
    }
  });
});
