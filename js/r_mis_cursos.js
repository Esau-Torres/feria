// js/r_mis_cursos.js

function setupMyCoursesPage() {
  console.log("Inicializando página Mis Cursos...");

  const placeholder = document.getElementById("my-courses-placeholder");
  const container = document.getElementById("my-courses-container");

  // 1. Verificar si el usuario está logueado
  const session = JSON.parse(localStorage.getItem("tutorEX_session"));
  if (!session) {
    placeholder.innerHTML = 'Debes <a href="#" onclick="loadContent(\'login\')" class="text-rose-700 font-bold underline">iniciar sesión</a> para ver tus cursos.';
    return;
  }
  const userEmail = session.email;

  // 2. Obtener los cursos del usuario
  const allUserCourses = JSON.parse(localStorage.getItem("tutorEX_myCourses")) || {};
  const myCourses = allUserCourses[userEmail] || [];

  // 3. Renderizar los cursos
  if (myCourses.length === 0) {
    placeholder.innerText = "Aún no has comprado ningún curso. ¡Explora el catálogo!";
    container.innerHTML = "";
  } else {
    placeholder.classList.add("hidden");
    container.innerHTML = ""; 

    myCourses.forEach(course => {
      // ===================================================================
      // ¡CAMBIO! El botón ahora llama a 'goToCourseView'
      // ===================================================================
      const courseCardHtml = `
        <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
          <div class="h-40 overflow-hidden">
            <img src="${course.image}" alt="${course.name}" class="h-full w-full object-cover">
          </div>
          <div class="p-6 flex-grow flex flex-col">
            <h3 class="text-xl font-Roboto font-bold text-stone-700 mb-2">${course.name}</h3>
            <p class="text-gray-700 font-Inter text-sm mb-4">¡Curso adquirido! Listo para empezar.</p>
            <div class="mt-auto pt-3 border-t border-gray-100">
              <button 
                class="w-full bg-rose-700 text-white font-semibold py-2 px-4 rounded-xl hover:bg-rose-800 transition"
                onclick="goToCourseView('${course.id}')">
                Ir al Curso
              </button>
            </div>
          </div>
        </div>
      `;
      // ===================================================================
      container.innerHTML += courseCardHtml;
    });
  }
}

/**
 * ===================================================================
 * ¡NUEVO! Esta función guarda el ID y carga la página de detalle.
 * ===================================================================
 * @param {string} courseId - El ID del curso (ej: "1", "2")
 */
function goToCourseView(courseId) {
  // 1. Guardamos el ID en sessionStorage para que la próxima página lo lea
  sessionStorage.setItem('currentCourseId', courseId);
  
  // 2. Cargamos la página plantilla genérica
  loadContent('curso-detalle');
}