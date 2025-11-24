// main.js
async function loadContent(page) {
  try {
    sessionStorage.setItem("currentPage", page);

    // Rutas posibles
    const possiblePaths = [
      `vistas/home/${page}.html`,
      `./vistas/home/${page}.html`,
      `${page}.html`,
      `./${page}.html`
    ];

    let response;
    let finalPath = '';
    
    for (const path of possiblePaths) {
      try {
        const testResponse = await fetch(path);
        if (testResponse.ok) {
          response = testResponse;
          finalPath = path;
          console.log(`Archivo encontrado en: ${path}`);
          break;
        }
      } catch (e) {
        continue; // seguir probando rutas
      }
    }

    if (!response || !response.ok) {
      throw new Error(`No se pudo encontrar ${page}.html en ninguna ruta`);
    }

    const content = await response.text();
    document.getElementById("main-content").innerHTML = content;
    console.log(`Contenido de ${page} cargado correctamente desde ${finalPath}`);

    // ======================================================
    // ¡NUEVO! Ocultar el menú de usuario al cargar una página nueva
    // ======================================================
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
      userMenu.classList.add('hidden');
    }

    // ======================================================
    // Lógica de Inicialización de Scripts (AHORA INCLUYE MIS-CURSOS)
    // ======================================================
    if (page === 'creditos') {
      if (typeof setupCreditsPage === 'function') {
        setupCreditsPage();
      } else {
        console.warn('setupCreditsPage() no está definida. Asegúrate de que r_creditos.js está cargado.');
      }
    }
    
    if (page === 'login') {
      if (typeof setupLoginPage === 'function') {
        setupLoginPage();
      } else {
        console.warn('setupLoginPage() no está definida. Asegúrate de que r_login.js está cargado.');
      }
    }

    if (page === 'curso-detalle') {
      if (typeof setupCourseDetailPage === 'function') {
        setupCourseDetailPage();
      } else {
        console.warn('setupCourseDetailPage() no está definida. Asegúrate de que r_curso_detalle.js está cargado.');
      }
    }

    // ======================================================
    // ¡CORRECCIÓN! Este bloque se movió aquí
    // ======================================================
    if (page === 'mis-cursos') {
      if (typeof setupMyCoursesPage === 'function') {
        setupMyCoursesPage();
      } else {
        console.warn('setupMyCoursesPage() no está definida. Asegúrate de que r_mis_cursos.js está cargado.');
      }
    }

    if (page === 'tutoriales') {
        if (typeof setupTutorialesPage === 'function') {
            setupTutorialesPage();
        } else {
            console.warn('setupTutorialesPage() no está definida. Asegúrate de que r_tutoriales.js está cargado.');
        }
    }
    if (page === 'tutores') {
        if (typeof setupTutoresPage === 'function') {
            setupTutoresPage();
        } else {
            console.warn('setupTutoresPage() no está definida. Asegúrate de que r_tutores.js está cargado.');
        }
    }
    if (page === 'mis-tutores') {
        if (typeof setupMyTutoresPage === 'function') {
            setupMyTutoresPage();
        } else {
            console.warn('setupMyTutoresPage() no está definida. Asegúrate de que r_mis_tutores.js está cargado.');
        }
    }

  } catch (error) {
    console.error('Error al cargar el contenido:', error);
    document.getElementById("main-content").innerHTML = `
      <div class="container mx-auto px-4 py-8 text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p class="text-gray-600">No se pudo cargar el contenido de la página.</p>
        <p class="text-sm text-gray-500 mt-2">Error: ${error.message}</p>
        <p class="text-xs text-gray-400 mt-2">Ruta actual: ${window.location.href}</p>
      </div>
    `;
  }
} // <-- AQUÍ TERMINA loadContent()

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, revisando última página visitada...');
  
  updateAuthUI(); 
  
  const lastPage = sessionStorage.getItem("currentPage") || "home";
  loadContent(lastPage);

  // ======================================================
  // ¡NUEVO! Listener global para cerrar el menú
  // ======================================================
  window.addEventListener('click', function(e) {
    const authButton = document.getElementById('authButton');
    const userMenu = document.getElementById('userMenu');

    // Si el clic NO fue en el botón Y NO fue dentro del menú
    // Y el menú está visible, entonces lo cerramos.
    if (authButton && userMenu && 
        !authButton.contains(e.target) && 
        !userMenu.contains(e.target) &&
        !userMenu.classList.contains('hidden')) {
      
      userMenu.classList.add('hidden');
    }
  });
});


// ======================================================
// ¡FUNCIONES GLOBALES DE AUTENTICACIÓN (MODIFICADAS)!
// ======================================================

function updateAuthUI() {
  const session = JSON.parse(localStorage.getItem("tutorEX_session"));
  const authButton = document.getElementById("authButton");
  const creditsButton = document.getElementById("creditsButton");
  const creditsDisplay = document.getElementById("creditsDisplay");
  const userMenu = document.getElementById("userMenu"); // ¡NUEVO!

  if (authButton && creditsButton && creditsDisplay && userMenu) { 
    if (session && session.name) {
      // --- Usuario Logueado ---
      // ¡NUEVO! Añadimos un icono de usuario
      authButton.innerHTML = `
        <i class="fas fa-user-circle mr-2"></i>
        Hola, ${session.name.split(' ')[0]}
        <i class="fas fa-chevron-down ml-2 text-xs"></i>
      `;
      
      const users = JSON.parse(localStorage.getItem("tutorEX_users")) || [];
      const currentUser = users.find(u => u.email === session.email);
      const userCredits = currentUser ? (currentUser.credits || 0) : 0; 
      
      creditsDisplay.innerText = userCredits;
      creditsButton.classList.remove('hidden');

    } else {
      // --- Usuario Deslogueado ---
      authButton.innerHTML = 'Iniciar Sesión';
      creditsButton.classList.add('hidden'); 
      userMenu.classList.add('hidden'); // ¡NUEVO! Ocultar menú si está deslogueado
    }
  }
}

/**
 * Cierra la sesión del usuario.
 */
function logout() {
  if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
    localStorage.removeItem("tutorEX_session");
    alert("Has cerrado sesión.");
    updateAuthUI();
    loadContent('home');
  }
}

/**
 * Decide qué hacer al hacer clic en el botón de Auth:
 * - Si está logueado -> MUESTRA/OCULTA EL MENÚ
 * - Si está deslogueado -> Llama a loadContent('login')
 */
function handleAuthClick() {
  const session = JSON.parse(localStorage.getItem("tutorEX_session"));
  
  if (session) {
    // --- Usuario Logueado: Toggle (mostrar/ocultar) el menú ---
    const menu = document.getElementById("userMenu");
    menu.classList.toggle("hidden");
  } else {
    // --- Usuario Deslogueado: Ir a Login ---
    loadContent('login');
  }
}

// ======================================================
// ¡ERROR ARREGLADO!
// El bloque de "mis-cursos" que estaba aquí abajo fue
// movido a su lugar correcto DENTRO de la función
// loadContent() (alrededor de la línea 79).
// ======================================================