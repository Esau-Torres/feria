// js/r_tutores.js

async function setupTutoresPage() {
    console.log("Inicializando página de Tutores...");

    const container = document.getElementById("tutores-container");
    if (!container) return; 

    try {
        // 1. Cargar la Base de Datos JSON
        const response = await fetch('tutores.json');
        if (!response.ok) {
            throw new Error('No se pudo cargar la base de datos de tutores (tutores.json).');
        }
        const tutores = await response.json();
        
        container.innerHTML = ""; // Limpiar el contenedor

        // 2. Determinar si el usuario está logueado para mostrar botones activos
        const session = JSON.parse(localStorage.getItem("tutorEX_session"));
        
        // 3. Dibujar las tarjetas
        tutores.forEach(tutor => {
            
            // Lógica para mostrar el botón adecuado
            let actionButtonHtml = '';
            if (session) {
                // Logueado: Puede contratar
                actionButtonHtml = `
                    <button onclick="hireTutor('${tutor.id}', ${tutor.rate}, '${tutor.name}')"
                            class="w-full bg-rose-700 text-white font-semibold py-2 rounded-xl hover:bg-rose-800 transition">
                        Reservar Clase (${tutor.rate} Créditos/h)
                    </button>
                `;
            } else {
                // No Logueado: Solo puede ver
                actionButtonHtml = `
                    <button onclick="loadContent('login')"
                            class="w-full bg-stone-500 text-white font-semibold py-2 rounded-xl hover:bg-stone-600 transition">
                        Inicia Sesión para Contactar
                    </button>
                `;
            }

            const cardHtml = `
                <div class="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full">
                    <div class="h-48 bg-stone-100 flex items-center justify-center overflow-hidden">
                        <img src="${tutor.imageUrl}" alt="Foto de ${tutor.name}" class="max-h-full max-w-full object-contain">
                    </div>
                    <div class="p-6 flex-grow flex flex-col">
                        <h3 class="text-xl font-Roboto font-bold text-stone-700 mb-1">${tutor.name}</h3>
                        <p class="text-rose-700 font-Inter font-semibold text-sm mb-3">${tutor.subject}</p>
                        <p class="text-gray-700 font-Inter text-sm mb-4 flex-grow">${tutor.focus}</p>
                        <div class="flex justify-between items-center mt-auto pt-3 border-t border-gray-100 flex-col gap-3">
                            <div class="flex justify-between w-full">
                                <span class="text-gray-700 font-Inter text-sm"><i class="fas fa-briefcase mr-1"></i>${tutor.experience}</span>
                                <span class="text-stone-700 font-Roboto font-bold text-lg">Costo: ${tutor.rate} C.</span>
                            </div>
                            ${actionButtonHtml}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += cardHtml;
        });

    } catch (error) {
        console.error("Error al renderizar los tutores:", error);
        container.innerHTML = `<p class="text-red-500">Error al cargar la lista de tutores: ${error.message}</p>`;
    }
}

/**
 * ===================================================================
 * Lógica de CONTRATACIÓN (Simulada)
 * ===================================================================
 */
function hireTutor(tutorId, cost, tutorName) {
    // La sesión ya fue verificada en la UI, solo verificamos el saldo
    const session = JSON.parse(localStorage.getItem("tutorEX_session"));
    const userEmail = session.email;

    let users = JSON.parse(localStorage.getItem("tutorEX_users")) || [];
    let currentUser = users.find(user => user.email === userEmail);
    const userCredits = currentUser.credits || 0;

    if (userCredits < cost) {
        alert(`Créditos insuficientes para contratar a ${tutorName}.\nTu saldo: ${userCredits} Créditos.`);
        loadContent('creditos'); // Redirige a recargar
        return;
    }

    if (confirm(`¿Confirmas la reserva de una clase con ${tutorName} por ${cost} créditos?`)) {
        
        let newBalance = 0;
        
        // 1. Descontar el saldo
        const updatedUsers = users.map(user => {
            if (user.email === userEmail) {
                user.credits -= cost;
                newBalance = user.credits;
            }
            return user;
        });
        localStorage.setItem("tutorEX_users", JSON.stringify(updatedUsers));

        // 2. Guardar la tutoría contratada (Simulación de seguimiento)
        let hiredTutories = JSON.parse(localStorage.getItem("tutorEX_hiredTutories")) || [];
        hiredTutories.push({ tutorId: tutorId, date: new Date().toISOString(), cost: cost });
        localStorage.setItem("tutorEX_hiredTutories", JSON.stringify(hiredTutories));

        // 3. Actualizar la UI del header
        if (typeof updateAuthUI === 'function') {
            updateAuthUI();
        }

        alert(`¡Tutoría reservada con ${tutorName}!\nTu nuevo saldo es ${newBalance} créditos.\nEl tutor se pondrá en contacto contigo.`);
    }
}