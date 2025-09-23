// main.js
async function loadContent(page) {
  try {
    // Guardar la página actual en localStorage
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

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM cargado, revisando última página visitada...');
  
  // Recuperar la última página visitada de localStorage o cargar "home" por defecto
  const lastPage = sessionStorage.getItem("currentPage") || "home";
  loadContent(lastPage);
});
