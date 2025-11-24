// js/r_login.js

function setupLoginPage() {
  console.log("Inicializando página de Login/Registro...");

  // Elementos de la UI
  const loginToggleBtn = document.getElementById("loginToggleBtn");
  const registerToggleBtn = document.getElementById("registerToggleBtn");
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const authTitle = document.getElementById("authTitle");

  if (!loginToggleBtn) return; // Salir si los elementos no están (no estamos en login.html)

  // --- Lógica de Toggle ---
  loginToggleBtn.addEventListener("click", () => {
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");
    authTitle.innerText = "Iniciar Sesión";
    
    // Estilos de botón activo
    loginToggleBtn.classList.add("bg-rose-700", "text-white");
    loginToggleBtn.classList.remove("bg-gray-200", "text-stone-700");
    // Estilos de botón inactivo
    registerToggleBtn.classList.add("bg-gray-200", "text-stone-700");
    registerToggleBtn.classList.remove("bg-rose-700", "text-white");
  });

  registerToggleBtn.addEventListener("click", () => {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
    authTitle.innerText = "Crear Cuenta";

    // Estilos de botón activo
    registerToggleBtn.classList.add("bg-rose-700", "text-white");
    registerToggleBtn.classList.remove("bg-gray-200", "text-stone-700");
    // Estilos de botón inactivo
    loginToggleBtn.classList.add("bg-gray-200", "text-stone-700");
    loginToggleBtn.classList.remove("bg-rose-700", "text-white");
  });

  // --- Lógica de Registro (Simulada con localStorage) ---
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const pass = document.getElementById("registerPass").value;

    // Obtenemos la "base de datos" de usuarios desde localStorage
    let users = JSON.parse(localStorage.getItem("tutorEX_users")) || [];
    
    // Verificamos si el usuario ya existe
    const userExists = users.find(user => user.email === email);
    
    if (userExists) {
      alert("Error: El correo electrónico ya está registrado.");
      return;
    }

    // Creamos el nuevo usuario y lo guardamos
    const newUser = { name, email, pass, credits: 10 }; // ADVERTENCIA: ¡Nunca guardar contraseñas en texto plano en una app real!
    users.push(newUser);
    localStorage.setItem("tutorEX_users", JSON.stringify(users));

    alert("¡Registro exitoso! Te hemos dado 10 créditos de bienvenida. Por favor, inicia sesión.");
    loginToggleBtn.click(); // Simulamos clic para volver al login
  });

  // --- Lógica de Login (Simulada con localStorage) ---
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const pass = document.getElementById("loginPass").value;

    // Obtenemos los usuarios
    let users = JSON.parse(localStorage.getItem("tutorEX_users")) || [];
    
    // Buscamos al usuario y validamos la contraseña
    const user = users.find(user => user.email === email && user.pass === pass);

    if (user) {
      // ¡Éxito! Creamos una "sesión"
      const sessionData = {
        name: user.name,
        email: user.email
      };
      // Usamos sessionStorage para la sesión (se borra al cerrar el navegador)
      // o localStorage si queremos que sea persistente. Usemos localStorage por ahora.
      localStorage.setItem("tutorEX_session", JSON.stringify(sessionData));
      
      alert(`¡Bienvenido, ${user.name}!`);
      updateAuthUI(); // Actualizamos el botón del header
      loadContent('home'); // Redirigimos al home
    } else {
      alert("Error: Correo o contraseña incorrectos.");
    }
  });
}

