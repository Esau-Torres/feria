// js/r_tutoriales.js

async function setupTutorialesPage() {
    console.log("Inicializando página de Tutoriales Gratuitos...");

    const container = document.getElementById("tutoriales-container");
    if (!container) return; 

    try {
        // 1. Cargar la Base de Datos JSON
        const response = await fetch('tutoriales.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la base de datos de tutoriales (tutoriales.json).');
        }
        const tutoriales = await response.json();
        
        container.innerHTML = ""; // Limpiar el contenedor

        // 2. Dibujar las tarjetas
        tutoriales.forEach(tutorial => {
            const cardHtml = `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition duration-300 flex flex-col h-full p-6">
                    
                    <span class="${tutorial.color} text-xs font-Inter font-semibold px-3 py-1 rounded-full self-start mb-3">
                        ${tutorial.category}
                    </span>

                    <h3 class="text-xl font-Roboto font-bold text-stone-700 mt-2 mb-2">${tutorial.name}</h3>
                    
                    <p class="text-gray-700 font-Inter text-sm mb-4 flex-grow">${tutorial.description}</p>
                    
                    <div class="mt-auto pt-3 border-t border-gray-100">
                        <a href="${tutorial.pdfLink}" target="_blank" download
                            class="w-full inline-flex items-center justify-center bg-stone-700 text-white font-semibold py-2 px-4 rounded-xl hover:bg-black transition">
                            <i class="${tutorial.icon} mr-2"></i>
                            Descargar PDF
                        </a>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Error al renderizar los tutoriales:", error);
        container.innerHTML = `<p class="text-red-500">Error al cargar los tutoriales: ${error.message}</p>`;
    }
}

// Para nuestra arquitectura SPA, no necesitamos DOMContentLoaded aquí.
// main.js se encarga de llamar a setupTutorialesPage()