// js/r_mis_tutores.js

async function setupMyTutoresPage() {
    console.log("Inicializando página Mis Tutores...");

    const placeholder = document.getElementById("my-tutores-placeholder");
    const container = document.getElementById("my-tutores-container");

    // 1. Verificar si el usuario está logueado
    const session = JSON.parse(localStorage.getItem("tutorEX_session"));
    if (!session) {
        placeholder.innerHTML = 'Debes <a href="#" onclick="loadContent(\'login\')" class="text-rose-700 font-bold underline">iniciar sesión</a> para ver a tus tutores.';
        return;
    }

    // 2. Obtener la lista de tutorías contratadas del usuario
    const hiredTutories = JSON.parse(localStorage.getItem("tutorEX_hiredTutories")) || [];
    const tutorIds = [...new Set(hiredTutories.map(t => t.tutorId))]; 

    // 3. Verificar si hay tutores contratados
    if (tutorIds.length === 0) {
        placeholder.innerText = "Aún no has contratado a ningún tutor. ¡Encuentra el ideal!";
        container.innerHTML = "";
        return;
    }
    
    // 4. Cargar la Base de Datos de Tutores
    try {
        const response = await fetch('tutores.json');
        if (!response.ok) throw new Error('No se pudo cargar la base de datos de tutores.');
        const allTutores = await response.json();

        // 5. Filtrar solo los tutores que el usuario ha contratado
        const myTutores = allTutores.filter(tutor => tutorIds.includes(tutor.id));

        // 6. Renderizar las tarjetas
        placeholder.classList.add("hidden");
        container.innerHTML = "";
        
        myTutores.forEach(tutor => {
            // Preparamos los datos de horario y contacto (si existen)
            const schedule = tutor.schedule || { days: ["No disponible"], isAvailable: false };
            const daysHtml = schedule.days.map(day => 
                `<span class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md">${day}</span>`
            ).join('');

            const cardHtml = `
                <div class="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 flex flex-col h-full">
                    <div class="h-48 bg-stone-100 flex items-center justify-center overflow-hidden">
                        <img src="${tutor.imageUrl}" alt="Foto de ${tutor.name}" class="max-h-full max-w-full object-contain">
                    </div>
                    <div class="p-6 flex-grow flex flex-col">
                        <h3 class="text-xl font-Roboto font-bold text-stone-700 mb-1">${tutor.name}</h3>
                        <p class="text-rose-700 font-Inter font-semibold text-sm mb-3">${tutor.subject}</p>
                        <p class="text-gray-700 font-Inter text-sm mb-4 flex-grow">${tutor.focus}</p>
                        
                        <div class="mt-auto pt-3 border-t border-gray-100">
                            <button onclick="toggleSchedule('${tutor.id}')" 
                                class="w-full bg-stone-700 text-white font-semibold py-2 px-4 rounded-xl hover:bg-black transition">
                                Ver Horarios
                            </button>
                        </div>
                    </div>
                </div>

                <div id="schedule-panel-${tutor.id}" class="hidden bg-stone-50 border border-gray-200 rounded-xl p-4 mt-2 mb-4 col-span-full">
                    <h4 class="font-bold text-stone-700 mb-3">Horarios disponibles:</h4>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${daysHtml}
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
                        <button onclick="alert('Simulación: Selecciona la hora y agenda con ${tutor.name}')" 
                                class="w-full bg-rose-700 text-white font-semibold py-2 rounded-xl hover:bg-rose-800 transition">
                            <i class="fas fa-calendar-check mr-2"></i>Agendar Cita
                        </button>
                        
                        <a href="${schedule.contactLink || '#'}" target="_blank"
                            class="w-full text-center bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition">
                            <i class="fas fa-comments mr-2"></i>Contactar (Chat)
                        </a>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Error al renderizar Mis Tutores:", error);
        container.innerHTML = `<p class="text-red-500">Error al cargar la lista: ${error.message}</p>`;
    }
}

/**
 * ===================================================================
 * ¡NUEVA FUNCIÓN! Toggle para mostrar/ocultar el panel de horarios
 * ===================================================================
 * @param {string} tutorId - El ID del tutor para ubicar su panel
 */
function toggleSchedule(tutorId) {
    const panelId = `schedule-panel-${tutorId}`;
    const panel = document.getElementById(panelId);

    // Seleccionar todos los paneles para cerrar los otros
    document.querySelectorAll('[id^="schedule-panel-"]').forEach(otherPanel => {
        if (otherPanel.id !== panelId) {
            otherPanel.classList.add('hidden');
        }
    });

    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Mantener la función de inicialización visible para main.js
// setupMyTutoresPage(); // Se llama desde main.js