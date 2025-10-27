/**
 * Carga dinámicamente el contenido de una página parcial en el main-content.
 * @param {string} page - El nombre del archivo HTML (sin .html) a cargar.
 */
async function loadContent(page) {
    try {
        const possiblePaths = [
            `vistas/tutoriales/${page}.html`,
            `./vistas/tutoriales/${page}.html`,
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
                continue;
            }
        }

        if (!response || !response.ok) {
            throw new Error(`No se pudo encontrar ${page}.html en ninguna ruta`);
        }

        const content = await response.text();
        document.getElementById("main-content").innerHTML = content;
        console.log(`Contenido de ${page} cargado correctamente desde ${finalPath}`);

        // Inicializa los scripts específicos de la página cargada
        initializePageScripts(page);

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

/**
 * Llama a funciones JS específicas basadas en la página que se acaba de cargar.
 * @param {string} page - El nombre de la página cargada.
 */
function initializePageScripts(page) {
    if (page === 'tutorial') {
        initializeTutorialModals();
    }
    // Puedes añadir más 'else if' para otras páginas (ej: 'cursos', 'tutores')
}

/**
 * Inicializa toda la lógica del modal para la página de tutoriales.
 */
function initializeTutorialModals() {
    const modalOverlay = document.getElementById('tutorial-modal-overlay');
    const modalContent = document.getElementById('tutorial-modal-content');
    const closeBtn = document.getElementById('modal-close-btn');
    const cards = document.querySelectorAll('.tutorial-card-trigger');

    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalAccessBtn = document.getElementById('modal-access-btn');
    const modalVideoContainer = document.getElementById('modal-video-container');

    // Si no se encuentran los elementos del modal, no hacer nada.
    if (!modalOverlay || !closeBtn || cards.length === 0) {
        console.warn("No se pudieron encontrar los elementos del modal de tutoriales.");
        return;
    }

    // --- Funciones del Modal ---

    const openModal = (card) => {
        // 1. Obtener datos de la tarjeta
        const title = card.dataset.title || "Sin Título";
        const description = card.dataset.description || "Sin Descripción.";
        const videoId = card.dataset.videoId;

        // 2. Poblar el modal con los datos
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        modalAccessBtn.href = "#"; // Aquí iría el enlace real al curso
        
        // ---- LÍNEAS DE CRÉDITOS ELIMINADAS ----

        // 3. Inyectar el Iframe de YouTube
        if (videoId) {
            modalVideoContainer.innerHTML = `
                <iframe class="w-full h-full rounded-t-xl" 
                        src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0" 
                        title="YouTube video player" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                </iframe>`;
        } else {
            modalVideoContainer.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-stone-900"><p class="text-white">Video no disponible.</p></div>`;
        }

        // 4. Mostrar el modal
        modalOverlay.classList.remove('hidden');
    };

    const closeModal = () => {
        // 1. Ocultar el modal
        modalOverlay.classList.add('hidden');
        
        // 2. ¡Importante! Destruir el iframe para detener el video
        modalVideoContainer.innerHTML = "";
    };

    // --- Asignar Event Listeners ---

    // 1. Listeners para abrir el modal
    cards.forEach(card => {
        card.addEventListener('click', () => {
            openModal(card);
        });
    });

    // 2. Listeners para cerrar el modal
    closeBtn.addEventListener('click', closeModal);
    
    // 3. Cerrar al hacer clic en el fondo oscuro (overlay)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // 4. Prevenir que el clic en el contenido cierre el modal
    modalContent.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    console.log('Scripts del modal de tutoriales inicializados.');
}


// --- Carga inicial de la página ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, intentando cargar tutorial...');
    // Cargar la página 'tutorial' por defecto
    loadContent('tutorial');
});