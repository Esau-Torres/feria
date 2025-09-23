// r_pago.js

// Función que inicializa los botones y formulario de pago
function setupPaymentPage() {
  const tarjetaBtn = document.getElementById("tarjetaBtn");
  const presencialBtn = document.getElementById("presencialBtn");
  const cardForm = document.getElementById("cardForm");
  const tarjetaForm = document.getElementById("tarjetaForm");

  if (!tarjetaBtn || !presencialBtn || !cardForm || !tarjetaForm) return;

  // Quitar listeners antiguos para evitar duplicados
  tarjetaBtn.onclick = null;
  presencialBtn.onclick = null;
  tarjetaForm.onsubmit = null;

  // Mostrar/ocultar formulario al hacer click en tarjeta
  tarjetaBtn.addEventListener("click", () => {
    if (cardForm.classList.contains("opacity-0")) {
      cardForm.classList.remove("opacity-0", "max-h-0");
      cardForm.classList.add("opacity-100", "max-h-screen");
    } else {
      cardForm.classList.add("opacity-0", "max-h-0");
      cardForm.classList.remove("opacity-100", "max-h-screen");
    }
  });

  // Pago presencial
  presencialBtn.addEventListener("click", () => {
    alert("Has seleccionado pago presencial. Nos comunicaremos con el docente asignado.");
    loadContent('home'); 
  });

  // Cerrar formulario si se hace click fuera
  document.addEventListener("click", (e) => {
    if (!cardForm.contains(e.target) && e.target !== tarjetaBtn) {
      cardForm.classList.add("opacity-0", "max-h-0");
      cardForm.classList.remove("opacity-100", "max-h-screen");
    }
  });

  // Formateo automático de inputs
  document.addEventListener("input", (e) => {
    if (e.target.id === "cardNumber") {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    }
    if (e.target.id === "expiry") {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }
    if (e.target.id === "cvv") {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0,3);
    }
  });

  // Manejar submit del formulario de tarjeta
  tarjetaForm.addEventListener("submit", (e) => {
    e.preventDefault(); 
    alert("Pago realizado con éxito! Redirigiendo a home...");
    loadContent('home');
  });
}

// Si se carga directamente la página de pagos, inicializamos
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("tarjetaBtn")) {
    setupPaymentPage();
  }
});

// Función para llamar desde los botones de "Contratar"
function openPago() {
  loadContent('pago').then(() => {
    setupPaymentPage(); // Inicializa los botones cada vez
  });
}
