// js/r_creditos.js

function setupCreditsPage() {
  console.log("Inicializando página de Créditos...");

  // Asignar listeners a los botones
  document.getElementById("add10").addEventListener("click", () => addCredits(10));
  document.getElementById("add50").addEventListener("click", () => addCredits(50));
  document.getElementById("add100").addEventListener("click", () => addCredits(100));
}

/**
 * Lógica principal para añadir créditos al usuario actual en localStorage
 * @param {number} amount - La cantidad de créditos a añadir
 */
function addCredits(amount) {
  // 1. Obtener la sesión actual para saber QUIÉN está logueado
  const session = JSON.parse(localStorage.getItem("tutorEX_session"));
  if (!session) {
    alert("Error: Debes iniciar sesión para añadir créditos.");
    loadContent('login');
    return;
  }

  // 2. Obtener la "Base de Datos" COMPLETA de usuarios
  let users = JSON.parse(localStorage.getItem("tutorEX_users")) || [];
  
  let userFound = false;
  let newBalance = 0;

  // 3. Mapear la lista de usuarios y actualizar al correcto
  const updatedUsers = users.map(user => {
    if (user.email === session.email) {
      userFound = true;
      user.credits = (user.credits || 0) + amount; // Actualiza el saldo
      newBalance = user.credits;
    }
    return user;
  });

  if (!userFound) {
    // Esto no debería pasar si el login funciona, pero es buena defensa
    alert("Error: No se pudo encontrar tu usuario.");
    return;
  }

  // 4. Guardar la "Base de Datos" actualizada en localStorage
  localStorage.setItem("tutorEX_users", JSON.stringify(updatedUsers));

  // 5. Actualizar la UI del header INMEDIATAMENTE
  // (updateAuthUI es una función global de main.js)
  if (typeof updateAuthUI === 'function') {
    updateAuthUI();
  }

  alert(`¡Éxito! Se añadieron ${amount} créditos. Tu nuevo saldo es ${newBalance} créditos.`);
}