// js/ocultarcards.js
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    
    // --- Lógica para ABRIR modal (Sin cambios) ---
    const card = e.target.closest("[data-id]");
    if (card) {
      const id = card.getAttribute("data-id");
      const modal = document.getElementById("modal-" + id);
      if (modal) {
        modal.classList.remove("hidden");
      }
    }

    // --- Lógica para CERRAR modal (Sin cambios) ---
    if (e.target.classList.contains("closeModal")) {
      e.target.closest("div[id^='modal']").classList.add("hidden");
    }

    // --- Lógica para CERRAR al hacer clic en el fondo (Sin cambios) ---
    if (e.target.matches("div[id^='modal']")) {
      e.target.classList.add("hidden");
    }

    // ===================================================================
    // ¡LÓGICA DE COMPRA ACTUALIZADA!
    // ===================================================================
    if (e.target.classList.contains("hireBtn")) {
      
      const button = e.target;
      // Obtenemos TODOS los datos del curso desde el botón
      const cost = parseInt(button.dataset.cost);
      const courseName = button.dataset.courseName;
      const courseId = button.dataset.courseId;
      const courseImage = button.dataset.courseImage;

      // 1. Verificar si el usuario está logueado
      const session = JSON.parse(localStorage.getItem("tutorEX_session"));
      if (!session) {
        alert("Debes iniciar sesión para comprar un curso.");
        loadContent('login');
        return;
      }
      const userEmail = session.email;

      // 2. Obtener la "Base de Datos" de usuarios
      let users = JSON.parse(localStorage.getItem("tutorEX_users")) || [];
      let currentUser = users.find(user => user.email === userEmail);

      if (!currentUser) {
        alert("Error de sesión. Por favor, vuelve a iniciar sesión.");
        localStorage.removeItem("tutorEX_session");
        updateAuthUI();
        loadContent('login');
        return;
      }
      const userCredits = currentUser.credits || 0;

      // ===================================================================
      // ¡NUEVO! Verificar si ya posee el curso
      // ===================================================================
      let allUserCourses = JSON.parse(localStorage.getItem("tutorEX_myCourses")) || {};
      let thisUserCourses = allUserCourses[userEmail] || [];
      
      const alreadyOwned = thisUserCourses.find(c => c.id === courseId);
      if (alreadyOwned) {
        alert("¡Ya eres dueño de este curso!");
        return; // Detiene la compra
      }
      // ===================================================================

      // 3. Verificar si tiene créditos suficientes
      if (userCredits < cost) {
        alert(`No tienes suficientes créditos. \nTu saldo: ${userCredits} \nCosto del curso: ${cost}`);
        loadContent('creditos');
        return;
      }

      // 4. ¡Confirmar y realizar la compra!
      if (confirm(`¿Confirmas la compra de "${courseName}" por ${cost} créditos?\n\nTu saldo actual: ${userCredits} créditos.`)) {
        
        let newBalance = 0;
        
        // 4a. Actualizar el saldo del usuario
        const updatedUsers = users.map(user => {
          if (user.email === userEmail) {
            user.credits -= cost;
            newBalance = user.credits;
          }
          return user;
        });
        localStorage.setItem("tutorEX_users", JSON.stringify(updatedUsers));

        // ===================================================================
        // ¡NUEVO! Guardar el curso comprado
        // ===================================================================
        const newCourse = {
          id: courseId,
          name: courseName,
          image: courseImage
        };
        thisUserCourses.push(newCourse);
        allUserCourses[userEmail] = thisUserCourses;
        localStorage.setItem("tutorEX_myCourses", JSON.stringify(allUserCourses));
        // ===================================================================

        // 4c. Actualizar el header
        if (typeof updateAuthUI === 'function') {
          updateAuthUI();
        }

        // 4d. Damos feedback y cerramos el modal
        alert(`¡Compra exitosa! \nHas comprado "${courseName}".\nTu nuevo saldo es ${newBalance} créditos.`);
        button.closest("div[id^='modal']").classList.add("hidden");
        
      }
      
    } // Fin de la lógica hireBtn

  }); // Fin del listener de body
});