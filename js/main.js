// main.js
async function loadContent(page) {
  try {
    // Prueba diferentes rutas posibles
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
        // Continuar probando otras rutas
        continue;
      }
    }

    if (!response || !response.ok) {
      throw new Error(`No se pudo encontrar ${page}.html en ninguna ruta`);
    }

    const content = await response.text();
    document.getElementById("main-content").innerHTML = content;
    console.log(`Contenido de ${page} cargado correctamente desde ${finalPath}`);
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
}

// Cargar la página principal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, intentando cargar home...');
  loadContent('home');
});


//--------------------JOSE--------------------------------
// necesario para el navbar responsive
const btn = document.getElementById("menu-btn");
const menu = document.getElementById("menu");

btn.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  // Cambiar aria-expanded para accesibilidad
  const isExpanded = menu.classList.contains("hidden") ? "false" : "true";
  btn.setAttribute("aria-expanded", isExpanded);
});

// Cerrar menú al hacer clic fuera
document.addEventListener("click", (e) => {
  if (!menu.classList.contains("hidden") &&
    !btn.contains(e.target) &&
    !menu.contains(e.target)) {
    menu.classList.add("hidden");
    btn.setAttribute("aria-expanded", "false");
  }
});